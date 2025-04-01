interface ImpactCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  impactScore: number; // 0-100
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
  dataPoints: {
    label: string;
    value: number;
    unit: string;
  }[];
}

interface ImpactSummary {
  totalScore: number;
  categories: ImpactCategory[];
  overallTrend: 'increasing' | 'decreasing' | 'stable';
  topRecommendations: string[];
}

class ClimateImpactService {
  private mockImpactData: ImpactSummary = {
    totalScore: 65,
    overallTrend: 'increasing',
    categories: [
      {
        id: 'agriculture',
        name: 'Agricultural Impact',
        description: 'Impact from farming practices and crop management',
        icon: '🌾',
        impactScore: 75,
        trend: 'increasing',
        recommendations: [
          'Implement crop rotation to improve soil health',
          'Use organic fertilizers instead of synthetic ones',
          'Adopt water-efficient irrigation methods'
        ],
        dataPoints: [
          { label: 'Water Usage', value: 2500, unit: 'liters/day' },
          { label: 'Fertilizer Usage', value: 150, unit: 'kg/month' },
          { label: 'Soil Health', value: 65, unit: '%' }
        ]
      },
      {
        id: 'energy',
        name: 'Energy Consumption',
        description: 'Impact from energy usage and efficiency',
        icon: '⚡',
        impactScore: 60,
        trend: 'stable',
        recommendations: [
          'Switch to LED lighting',
          'Install solar panels',
          'Improve insulation in buildings'
        ],
        dataPoints: [
          { label: 'Electricity Usage', value: 300, unit: 'kWh/month' },
          { label: 'Renewable Energy', value: 25, unit: '%' },
          { label: 'Energy Efficiency', value: 70, unit: '%' }
        ]
      },
      {
        id: 'waste',
        name: 'Waste Management',
        description: 'Impact from waste generation and disposal',
        icon: '🗑️',
        impactScore: 45,
        trend: 'decreasing',
        recommendations: [
          'Implement comprehensive recycling program',
          'Reduce single-use plastics',
          'Compost organic waste'
        ],
        dataPoints: [
          { label: 'Waste Generated', value: 40, unit: 'kg/month' },
          { label: 'Recycling Rate', value: 35, unit: '%' },
          { label: 'Composting Rate', value: 20, unit: '%' }
        ]
      }
    ],
    topRecommendations: [
      'Implement crop rotation to improve soil health',
      'Switch to LED lighting',
      'Implement comprehensive recycling program'
    ]
  };

  async getImpactData(): Promise<ImpactSummary> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.mockImpactData;
  }

  getImpactStatus(score: number): string {
    if (score >= 80) return 'High Impact';
    if (score >= 60) return 'Moderate Impact';
    if (score >= 40) return 'Low Impact';
    return 'Minimal Impact';
  }

  getTrendAnalysis(trend: 'increasing' | 'decreasing' | 'stable'): string {
    switch (trend) {
      case 'increasing':
        return 'Impact is increasing';
      case 'decreasing':
        return 'Impact is decreasing';
      case 'stable':
        return 'Impact is stable';
    }
  }
}

export const climateImpactService = new ClimateImpactService();
export type { ImpactCategory, ImpactSummary }; 