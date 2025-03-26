import { api } from './api';

export interface WaterQualityData {
  ph: number;
  turbidity: number;
  dissolvedOxygen: number;
  temperature: number;
  timestamp: string;
}

export interface WaterLeakReport {
  id: string;
  location: string;
  description: string;
  imageUrl?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface WaterStats {
  qualityReports: number;
  leaksFixed: number;
  villagesCovered: number;
}

export const waterService = {
  // Get water quality data
  getWaterQuality: async (): Promise<WaterQualityData[]> => {
    const response = await api.get('/api/water/quality', {
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  },

  // Get water quality trends
  getWaterQualityTrends: async (): Promise<WaterQualityData[]> => {
    const response = await api.get('/api/water/quality/trends');
    return response.data;
  },

  // Report a water leak
  reportLeak: async (data: Omit<WaterLeakReport, 'id' | 'status' | 'createdAt'>): Promise<WaterLeakReport> => {
    const response = await api.post('/api/water/leaks', data);
    return response.data;
  },

  // Get leak reports
  getLeakReports: async (): Promise<WaterLeakReport[]> => {
    const response = await api.get('/api/water/leaks');
    return response.data;
  },

  // Get water statistics
  getStats: async (): Promise<WaterStats> => {
    const response = await api.get('/api/water/stats');
    return response.data;
  },

  // Get purification guides
  getPurificationGuides: async (): Promise<{ title: string; content: string; steps: string[] }[]> => {
    const response = await api.get('/api/water/purification-guides');
    return response.data;
  }
}; 