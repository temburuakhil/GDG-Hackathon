import { api } from './api';

export interface HealthStats {
  healthChecks: number;
  medicalCamps: number;
}

export interface HealthAdvisory {
  id: string;
  type: 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  affectedAreas?: string[];
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  operatingHours: string;
  rating: number;
  specialties: string[];
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SymptomCheckResult {
  possibleConditions: {
    name: string;
    probability: number;
    description: string;
    recommendations: string[];
  }[];
  severity: 'low' | 'medium' | 'high';
  nextSteps: string[];
}

export const healthService = {
  getStats: async (): Promise<HealthStats> => {
    const response = await api.get('/api/health/stats');
    return response.data;
  },

  getHealthAdvisories: async (): Promise<HealthAdvisory[]> => {
    // Mock data - in a real app this would come from an API
    return [
      {
        id: '1',
        type: 'seasonal',
        title: 'Heat Wave Advisory',
        message: 'High temperatures expected this week. Stay hydrated and avoid prolonged sun exposure. Elderly and children are particularly at risk.',
        severity: 'high',
        affectedAreas: ['Urban Areas', 'Central Districts'],
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'general',
        title: 'Seasonal Flu Prevention',
        message: 'Increased flu cases reported in the region. Practice good hygiene, wear masks in crowded places, and get vaccinated if you haven\'t already.',
        severity: 'medium',
        affectedAreas: ['All Districts'],
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'environmental',
        title: 'Air Quality Alert',
        message: 'Moderate air pollution levels detected. People with respiratory conditions should limit outdoor activities during peak hours.',
        severity: 'low',
        affectedAreas: ['Industrial Zones', 'Downtown'],
        timestamp: new Date().toISOString()
      }
    ];
  },

  findHealthcareFacilities: async (location: string, coordinates?: { lat: number; lng: number }): Promise<HealthcareFacility[]> => {
    const params: Record<string, string> = { location };
    if (coordinates) {
      params.lat = coordinates.lat.toString();
      params.lng = coordinates.lng.toString();
    }
    const response = await api.get('/api/health/facilities', { params });
    return response.data;
  },

  checkSymptoms: async (symptoms: string[]): Promise<SymptomCheckResult> => {
    const response = await api.post('/api/health/symptom-check', { symptoms });
    return response.data;
  }
}; 