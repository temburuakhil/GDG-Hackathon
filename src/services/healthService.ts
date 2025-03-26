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
    const response = await api.get('/api/health/advisories');
    return response.data;
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