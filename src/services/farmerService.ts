import { api } from './api';

export interface CropPrice {
  id: string;
  cropName: string;
  price: number;
  unit: string;
  market: string;
  timestamp: string;
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  startDate: string;
  endDate: string;
}

export interface CropRecommendation {
  id: string;
  cropName: string;
  confidence: number;
  expectedYield: number;
  waterRequirement: number;
  seasonality: string[];
  soilType: string[];
}

export interface MarketTrend {
  cropName: string;
  data: Array<{
    date: string;
    price: number;
  }>;
}

export interface FarmerStats {
  farmersRegistered: number;
  marketUpdates: string;
  cropVarieties: number;
  totalArea: number;
  activeMarkets: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket('ws://localhost:3001');

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        this.notifyListeners(type, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  subscribe(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(callback);
  }

  unsubscribe(type: string, callback: (data: any) => void) {
    this.listeners.get(type)?.delete(callback);
  }

  private notifyListeners(type: string, data: any) {
    this.listeners.get(type)?.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}

const wsService = new WebSocketService();

export const farmerService = {
  // WebSocket methods
  connectWebSocket: () => wsService.connect(),
  disconnectWebSocket: () => wsService.disconnect(),
  subscribeToUpdates: (type: string, callback: (data: any) => void) => {
    wsService.subscribe(type, callback);
    return () => wsService.unsubscribe(type, callback);
  },

  // REST API methods
  getMarketPrices: async () => {
    const response = await api.get<CropPrice[]>('/farmer/market-prices');
    return response.data;
  },

  getWeatherAlerts: async () => {
    const response = await api.get<WeatherAlert[]>('/farmer/weather-alerts');
    return response.data;
  },

  getCropRecommendations: async (soilType: string) => {
    const response = await api.get<CropRecommendation[]>('/farmer/crop-recommendations', {
      params: { soilType }
    });
    return response.data;
  },

  getMarketTrends: async () => {
    const response = await api.get<MarketTrend[]>('/farmer/market-trends');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<FarmerStats>('/farmer/stats');
    return response.data;
  },

  submitSoilAnalysis: async (formData: FormData) => {
    const response = await api.post('/farmer/soil-analysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}; 