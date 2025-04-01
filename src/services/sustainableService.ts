interface Practice {
  id: string;
  title: string;
  description: string;
  category: 'home' | 'transport' | 'food' | 'waste' | 'energy' | 'water';
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'low' | 'medium' | 'high';
  steps: string[];
  benefits: string[];
  resources: {
    title: string;
    url: string;
  }[];
  savingsEstimate?: {
    amount: number;
    unit: string;
    period: 'monthly' | 'yearly';
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

class SustainableService {
  private categories: Category[] = [
    {
      id: 'home',
      name: 'Home & Living',
      icon: '🏠',
      description: 'Sustainable practices for your home environment'
    },
    {
      id: 'transport',
      name: 'Transportation',
      icon: '🚲',
      description: 'Eco-friendly transportation methods'
    },
    {
      id: 'food',
      name: 'Food & Diet',
      icon: '🥗',
      description: 'Sustainable food choices and habits'
    },
    {
      id: 'waste',
      name: 'Waste Management',
      icon: '♻️',
      description: 'Reducing and managing waste effectively'
    },
    {
      id: 'energy',
      name: 'Energy Usage',
      icon: '⚡',
      description: 'Energy conservation and efficiency'
    },
    {
      id: 'water',
      name: 'Water Conservation',
      icon: '💧',
      description: 'Water-saving techniques and habits'
    }
  ];

  private practices: Practice[] = [
    {
      id: 'composting',
      title: 'Start Home Composting',
      description: 'Convert kitchen and garden waste into nutrient-rich soil',
      category: 'waste',
      difficulty: 'medium',
      impact: 'high',
      steps: [
        'Choose a suitable composting location',
        'Get a composting bin or create a pile',
        'Layer green and brown materials',
        'Maintain proper moisture',
        'Turn the compost regularly'
      ],
      benefits: [
        'Reduces landfill waste by up to 30%',
        'Creates nutrient-rich soil for gardening',
        'Lowers carbon footprint',
        'Saves money on fertilizers'
      ],
      resources: [
        {
          title: 'Composting Guide',
          url: 'https://example.com/composting'
        }
      ],
      savingsEstimate: {
        amount: 100,
        unit: 'kg',
        period: 'yearly'
      }
    },
    {
      id: 'energy-audit',
      title: 'Conduct Home Energy Audit',
      description: 'Identify and fix energy wastage in your home',
      category: 'energy',
      difficulty: 'medium',
      impact: 'high',
      steps: [
        'Check for air leaks',
        'Inspect insulation',
        'Evaluate appliance efficiency',
        'Review lighting setup',
        'Monitor energy usage patterns'
      ],
      benefits: [
        'Reduces energy bills',
        'Improves home comfort',
        'Identifies inefficient appliances',
        'Lowers carbon emissions'
      ],
      resources: [
        {
          title: 'DIY Energy Audit Guide',
          url: 'https://example.com/energy-audit'
        }
      ],
      savingsEstimate: {
        amount: 20,
        unit: '%',
        period: 'yearly'
      }
    },
    {
      id: 'rainwater',
      title: 'Rainwater Harvesting',
      description: 'Collect and use rainwater for various purposes',
      category: 'water',
      difficulty: 'hard',
      impact: 'high',
      steps: [
        'Install rain barrels or tanks',
        'Set up collection system',
        'Create filtration system',
        'Connect to irrigation',
        'Maintain the system'
      ],
      benefits: [
        'Reduces water bills',
        'Provides water during shortages',
        'Helps prevent flooding',
        'Reduces stormwater runoff'
      ],
      resources: [
        {
          title: 'Rainwater Harvesting Basics',
          url: 'https://example.com/rainwater'
        }
      ],
      savingsEstimate: {
        amount: 1500,
        unit: 'liters',
        period: 'monthly'
      }
    }
  ];

  async getCategories(): Promise<Category[]> {
    console.log('Getting categories...'); // Debug log
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Categories:', this.categories); // Debug log
    return this.categories;
  }

  async getPractices(category?: string): Promise<Practice[]> {
    console.log('Getting practices...', category ? `for category: ${category}` : 'all'); // Debug log
    await new Promise(resolve => setTimeout(resolve, 800));
    const filteredPractices = category ? this.practices.filter(p => p.category === category) : this.practices;
    console.log('Practices:', filteredPractices); // Debug log
    return filteredPractices;
  }

  async getPracticeById(id: string): Promise<Practice | undefined> {
    console.log('Getting practice by id:', id); // Debug log
    await new Promise(resolve => setTimeout(resolve, 300));
    const practice = this.practices.find(p => p.id === id);
    console.log('Found practice:', practice); // Debug log
    return practice;
  }

  getDifficultyColor(difficulty: Practice['difficulty']): string {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
    }
  }

  getImpactColor(impact: Practice['impact']): string {
    switch (impact) {
      case 'low':
        return 'text-yellow-500';
      case 'medium':
        return 'text-blue-500';
      case 'high':
        return 'text-green-500';
    }
  }
}

export const sustainableService = new SustainableService();
export type { Practice, Category }; 