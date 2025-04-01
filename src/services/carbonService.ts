export interface CarbonActivity {
  id: string;
  type: 'electricity' | 'transportation' | 'waste' | 'water' | 'food';
  value: number;
  unit: string;
  date: string;
  emissions: number; // in kg CO2
}

export interface CarbonSummary {
  totalEmissions: number;
  monthlyAverage: number;
  comparisonToAverage: number;
  breakdownByType: {
    [key: string]: number;
  };
  reductionTips: string[];
}

export interface CarbonInput {
  electricity: {
    monthlyUsage: number; // in kWh
  };
  transportation: {
    carDistance: number; // in km
    publicTransitDistance: number; // in km
  };
  waste: {
    monthlyWaste: number; // in kg
    recyclingPercentage: number;
  };
  water: {
    monthlyUsage: number; // in liters
  };
  food: {
    meatConsumption: 'high' | 'medium' | 'low' | 'none';
    localFoodPercentage: number;
  };
}

class CarbonService {
  private activities: CarbonActivity[] = [];
  
  // Emission factors (kg CO2 per unit)
  private readonly EMISSION_FACTORS = {
    electricity: 0.85, // per kWh
    car: 0.2, // per km
    publicTransit: 0.04, // per km
    waste: 2.86, // per kg
    water: 0.000298, // per liter
    food: {
      high: 600, // monthly
      medium: 400,
      low: 200,
      none: 100
    }
  };

  async calculateFootprint(input: CarbonInput): Promise<CarbonSummary> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calculate emissions for each category
    const electricityEmissions = input.electricity.monthlyUsage * this.EMISSION_FACTORS.electricity;
    const transportationEmissions = 
      (input.transportation.carDistance * this.EMISSION_FACTORS.car) +
      (input.transportation.publicTransitDistance * this.EMISSION_FACTORS.publicTransit);
    const wasteEmissions = 
      input.waste.monthlyWaste * this.EMISSION_FACTORS.waste * 
      (1 - (input.waste.recyclingPercentage / 100));
    const waterEmissions = input.water.monthlyUsage * this.EMISSION_FACTORS.water;
    const foodEmissions = this.EMISSION_FACTORS.food[input.food.meatConsumption] *
      (1 - (input.food.localFoodPercentage / 100) * 0.1); // 10% reduction for local food

    const totalEmissions = 
      electricityEmissions +
      transportationEmissions +
      wasteEmissions +
      waterEmissions +
      foodEmissions;

    // Generate personalized reduction tips
    const tips: string[] = [];
    if (electricityEmissions > 300) {
      tips.push('Consider switching to LED bulbs and energy-efficient appliances');
    }
    if (input.transportation.carDistance > 500) {
      tips.push('Try carpooling or using public transportation more frequently');
    }
    if (input.waste.recyclingPercentage < 50) {
      tips.push('Increase your recycling rate to reduce waste emissions');
    }
    if (waterEmissions > 50) {
      tips.push('Install water-efficient fixtures to reduce water consumption');
    }
    if (input.food.meatConsumption === 'high') {
      tips.push('Consider reducing meat consumption for a lower carbon footprint');
    }
    if (input.food.localFoodPercentage < 30) {
      tips.push('Buy more local produce to reduce transportation emissions');
    }

    return {
      totalEmissions,
      monthlyAverage: totalEmissions,
      comparisonToAverage: (totalEmissions / 1000 - 1) * 100, // Compared to 1000kg monthly average
      breakdownByType: {
        electricity: electricityEmissions,
        transportation: transportationEmissions,
        waste: wasteEmissions,
        water: waterEmissions,
        food: foodEmissions
      },
      reductionTips: tips
    };
  }

  async getActivityHistory(): Promise<CarbonActivity[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.activities;
  }

  async addActivity(activity: Omit<CarbonActivity, 'id' | 'emissions'>): Promise<CarbonActivity> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      emissions: this.calculateEmissionsForActivity(activity)
    };
    
    this.activities.push(newActivity);
    return newActivity;
  }

  private calculateEmissionsForActivity(activity: Omit<CarbonActivity, 'id' | 'emissions'>): number {
    switch (activity.type) {
      case 'electricity':
        return activity.value * this.EMISSION_FACTORS.electricity;
      case 'transportation':
        return activity.value * this.EMISSION_FACTORS.car;
      case 'waste':
        return activity.value * this.EMISSION_FACTORS.waste;
      case 'water':
        return activity.value * this.EMISSION_FACTORS.water;
      case 'food':
        return this.EMISSION_FACTORS.food.medium; // Default to medium consumption
      default:
        return 0;
    }
  }
}

export const carbonService = new CarbonService(); 