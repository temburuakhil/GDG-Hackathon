import { Droplets, Thermometer, Leaf, Activity } from 'lucide-react';

export interface SoilHealthData {
  id: string;
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  timestamp: Date;
  metrics: {
    moisture: number; // percentage
    temperature: number; // celsius
    pH: number;
    nitrogen: number; // mg/kg
    phosphorus: number; // mg/kg
    potassium: number; // mg/kg
    organicMatter: number; // percentage
  };
  status: 'healthy' | 'warning' | 'critical';
  recommendations: string[];
  lastRainfall?: {
    amount: number; // mm
    timestamp: Date;
  };
  cropHistory?: {
    crop: string;
    plantedDate: Date;
    harvestedDate?: Date;
    yield?: number; // tons/hectare
  }[];
}

class SoilHealthService {
  private data: SoilHealthData[] = [
    {
      id: '1',
      location: {
        name: 'Koraput Farm Block A',
        coordinates: {
          lat: 18.8124,
          lng: 82.7188
        }
      },
      timestamp: new Date(),
      metrics: {
        moisture: 65,
        temperature: 28,
        pH: 6.5,
        nitrogen: 45,
        phosphorus: 25,
        potassium: 180,
        organicMatter: 2.8
      },
      status: 'healthy',
      recommendations: [
        'Maintain current irrigation schedule',
        'Consider adding organic compost in next season'
      ],
      lastRainfall: {
        amount: 15,
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      },
      cropHistory: [
        {
          crop: 'Rice',
          plantedDate: new Date(Date.now() - 1209600000), // 14 days ago
          yield: 4.2
        }
      ]
    },
    {
      id: '2',
      location: {
        name: 'Nayagarh Farm Block B',
        coordinates: {
          lat: 20.1284,
          lng: 85.0952
        }
      },
      timestamp: new Date(),
      metrics: {
        moisture: 45,
        temperature: 32,
        pH: 5.8,
        nitrogen: 35,
        phosphorus: 18,
        potassium: 150,
        organicMatter: 2.1
      },
      status: 'warning',
      recommendations: [
        'Increase irrigation frequency',
        'Apply nitrogen-rich fertilizer',
        'Consider soil pH correction'
      ],
      lastRainfall: {
        amount: 8,
        timestamp: new Date(Date.now() - 172800000) // 2 days ago
      },
      cropHistory: [
        {
          crop: 'Wheat',
          plantedDate: new Date(Date.now() - 259200000) // 3 days ago
        }
      ]
    }
  ];

  private listeners: ((data: SoilHealthData[]) => void)[] = [];

  constructor() {
    // Simulate real-time updates
    setInterval(() => {
      this.simulateDataUpdate();
    }, 60000); // Update every minute
  }

  private simulateDataUpdate() {
    this.data = this.data.map(location => {
      const randomChange = (base: number, variance: number) => {
        return base + (Math.random() - 0.5) * variance;
      };

      const metrics = { ...location.metrics };
      
      // Simulate natural variations
      metrics.moisture = Math.max(0, Math.min(100, randomChange(metrics.moisture, 2)));
      metrics.temperature = randomChange(metrics.temperature, 0.5);
      metrics.pH = randomChange(metrics.pH, 0.1);
      metrics.nitrogen = Math.max(0, randomChange(metrics.nitrogen, 2));
      metrics.phosphorus = Math.max(0, randomChange(metrics.phosphorus, 1));
      metrics.potassium = Math.max(0, randomChange(metrics.potassium, 5));
      metrics.organicMatter = randomChange(metrics.organicMatter, 0.1);

      // Update status based on metrics
      const status = this.calculateStatus(metrics);

      return {
        ...location,
        timestamp: new Date(),
        metrics,
        status,
        recommendations: this.generateRecommendations(metrics, status)
      };
    });

    this.notifyListeners();
  }

  private calculateStatus(metrics: SoilHealthData['metrics']): SoilHealthData['status'] {
    const criticalThresholds = {
      moisture: { min: 30, max: 80 },
      pH: { min: 5.5, max: 7.5 },
      nitrogen: { min: 30, max: 60 },
      phosphorus: { min: 15, max: 40 },
      potassium: { min: 120, max: 250 }
    };

    const isCritical = Object.entries(metrics).some(([key, value]) => {
      const threshold = criticalThresholds[key as keyof typeof criticalThresholds];
      if (!threshold) return false;
      return value < threshold.min || value > threshold.max;
    });

    if (isCritical) return 'critical';

    const warningThresholds = {
      moisture: { min: 40, max: 70 },
      pH: { min: 6.0, max: 7.0 },
      nitrogen: { min: 35, max: 50 },
      phosphorus: { min: 20, max: 30 },
      potassium: { min: 140, max: 200 }
    };

    const isWarning = Object.entries(metrics).some(([key, value]) => {
      const threshold = warningThresholds[key as keyof typeof warningThresholds];
      if (!threshold) return false;
      return value < threshold.min || value > threshold.max;
    });

    return isWarning ? 'warning' : 'healthy';
  }

  private generateRecommendations(metrics: SoilHealthData['metrics'], status: SoilHealthData['status']): string[] {
    const recommendations: string[] = [];

    if (metrics.moisture < 40) {
      recommendations.push('Increase irrigation frequency');
    } else if (metrics.moisture > 70) {
      recommendations.push('Reduce irrigation to prevent waterlogging');
    }

    if (metrics.pH < 6.0) {
      recommendations.push('Apply lime to increase soil pH');
    } else if (metrics.pH > 7.0) {
      recommendations.push('Add sulfur to decrease soil pH');
    }

    if (metrics.nitrogen < 35) {
      recommendations.push('Apply nitrogen-rich fertilizer');
    }

    if (metrics.phosphorus < 20) {
      recommendations.push('Add phosphorus fertilizer');
    }

    if (metrics.potassium < 140) {
      recommendations.push('Apply potassium-rich fertilizer');
    }

    if (metrics.organicMatter < 2.5) {
      recommendations.push('Add organic compost to improve soil health');
    }

    if (status === 'critical') {
      recommendations.push('Immediate action required - Contact agricultural expert');
    }

    return recommendations;
  }

  subscribe(listener: (data: SoilHealthData[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.data));
  }

  async getSoilHealthData(): Promise<SoilHealthData[]> {
    return this.data;
  }

  async getSoilHealthDataById(id: string): Promise<SoilHealthData | undefined> {
    return this.data.find(location => location.id === id);
  }

  getStatusColor(status: SoilHealthData['status']): string {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }
}

export const soilHealthService = new SoilHealthService(); 