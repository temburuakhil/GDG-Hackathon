import { AlertCircle, MapPin, Clock, Activity } from 'lucide-react';

export interface DeforestationAlert {
  id: string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  area: number; // in hectares
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved';
  description: string;
  confidence: number; // percentage
  satelliteImage?: string;
  previousImage?: string;
  affectedSpecies?: string[];
  actionRequired: string;
}

class DeforestationService {
  private alerts: DeforestationAlert[] = [
    {
      id: '1',
      location: {
        name: 'Koraput Forest Range',
        coordinates: {
          lat: 18.8124,
          lng: 82.7188
        }
      },
      severity: 'high',
      area: 2.5,
      timestamp: new Date(),
      status: 'active',
      description: 'Significant tree cover loss detected in protected forest area',
      confidence: 92,
      affectedSpecies: ['Sal', 'Teak', 'Bamboo'],
      actionRequired: 'Immediate ground verification required'
    },
    {
      id: '2',
      location: {
        name: 'Nayagarh Forest Block',
        coordinates: {
          lat: 20.1284,
          lng: 85.0952
        }
      },
      severity: 'medium',
      area: 1.2,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'investigating',
      description: 'Moderate deforestation activity detected near village boundary',
      confidence: 85,
      affectedSpecies: ['Mango', 'Neem'],
      actionRequired: 'Schedule field visit within 24 hours'
    }
  ];

  private listeners: ((alerts: DeforestationAlert[]) => void)[] = [];

  constructor() {
    // Simulate real-time updates
    setInterval(() => {
      this.simulateNewAlert();
    }, 300000); // Check every 5 minutes
  }

  private simulateNewAlert() {
    const random = Math.random();
    if (random < 0.3) { // 30% chance of new alert
      const newAlert: DeforestationAlert = {
        id: Date.now().toString(),
        location: {
          name: ['Koraput Forest Range', 'Nayagarh Forest Block', 'Kandhamal Forest'][Math.floor(Math.random() * 3)],
          coordinates: {
            lat: 18 + Math.random() * 2,
            lng: 82 + Math.random() * 3
          }
        },
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as DeforestationAlert['severity'],
        area: 0.5 + Math.random() * 3,
        timestamp: new Date(),
        status: 'active',
        description: 'New deforestation activity detected',
        confidence: 80 + Math.floor(Math.random() * 20),
        affectedSpecies: ['Sal', 'Teak', 'Bamboo', 'Mango', 'Neem'].slice(0, 2 + Math.floor(Math.random() * 3)),
        actionRequired: 'Investigation required'
      };
      this.alerts.unshift(newAlert);
      this.notifyListeners();
    }
  }

  subscribe(listener: (alerts: DeforestationAlert[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.alerts));
  }

  async getAlerts(): Promise<DeforestationAlert[]> {
    return this.alerts;
  }

  async getAlertById(id: string): Promise<DeforestationAlert | undefined> {
    return this.alerts.find(alert => alert.id === id);
  }

  getSeverityColor(severity: DeforestationAlert['severity']): string {
    switch (severity) {
      case 'low':
        return 'text-yellow-500';
      case 'medium':
        return 'text-orange-500';
      case 'high':
        return 'text-red-500';
      case 'critical':
        return 'text-red-700';
      default:
        return 'text-gray-500';
    }
  }

  getStatusColor(status: DeforestationAlert['status']): string {
    switch (status) {
      case 'active':
        return 'text-red-500';
      case 'investigating':
        return 'text-yellow-500';
      case 'resolved':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  }
}

export const deforestationService = new DeforestationService(); 