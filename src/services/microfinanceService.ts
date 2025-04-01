export interface MicrofinanceOpportunity {
  id: string;
  title: string;
  provider: string;
  type: 'loan' | 'grant' | 'investment';
  amount: string;
  interestRate?: string;
  duration: string;
  description: string;
  requirements: string[];
  benefits: string[];
  eligibility: string[];
  applicationDeadline: string;
  status: 'open' | 'closing-soon' | 'closed';
  location: string;
  contactEmail: string;
  documents: string[];
  category: string;
}

export interface MicrofinanceFilter {
  type?: string;
  category?: string;
  status?: string;
  search?: string;
}

class MicrofinanceService {
  private opportunities: MicrofinanceOpportunity[] = [
    {
      id: '1',
      title: 'Women Entrepreneur Support Loan',
      provider: 'Rural Development Bank',
      type: 'loan',
      amount: '₹50,000 - ₹2,00,000',
      interestRate: '4% per annum',
      duration: '24 months',
      description: 'Special loan program designed for women entrepreneurs in rural areas to start or expand their businesses.',
      requirements: [
        'Valid ID proof',
        'Business plan or proposal',
        'Bank account statements for last 6 months',
        'No existing defaults'
      ],
      benefits: [
        'Low interest rate',
        'Flexible repayment options',
        'Business mentorship support',
        'No collateral required for loans up to ₹1,00,000'
      ],
      eligibility: [
        'Women aged 18-55 years',
        'Resident of rural area',
        'Basic literacy',
        'Valid business idea or existing business'
      ],
      applicationDeadline: '2024-05-30',
      status: 'open',
      location: 'Pan India',
      contactEmail: 'support@rdb.com',
      documents: [
        'Identity Proof',
        'Address Proof',
        'Business Plan',
        'Bank Statements',
        'Income Proof'
      ],
      category: 'Business Development'
    },
    {
      id: '2',
      title: 'Handicraft Artisan Grant',
      provider: 'Craft Development Foundation',
      type: 'grant',
      amount: '₹25,000 - ₹75,000',
      duration: 'One-time disbursement',
      description: 'Financial support for traditional handicraft artisans to preserve and promote local craft.',
      requirements: [
        'Proof of craft expertise',
        'Portfolio of work',
        'Local artisan certification',
        'Project proposal'
      ],
      benefits: [
        'Non-repayable grant',
        'Craft exhibition opportunity',
        'Marketing support',
        'Skill enhancement workshops'
      ],
      eligibility: [
        'Active artisan for minimum 3 years',
        'Traditional craft practitioner',
        'Rural/Semi-urban based',
        'No previous grant received'
      ],
      applicationDeadline: '2024-04-15',
      status: 'open',
      location: 'Selected Districts',
      contactEmail: 'grants@craftfoundation.org',
      documents: [
        'Artisan ID Card',
        'Work Portfolio',
        'Project Proposal',
        'Bank Account Details'
      ],
      category: 'Arts & Crafts'
    },
    {
      id: '3',
      title: 'Agricultural Micro Investment',
      provider: 'Agri Growth Fund',
      type: 'investment',
      amount: '₹1,00,000 - ₹5,00,000',
      interestRate: 'Profit sharing basis',
      duration: '12 months',
      description: 'Investment opportunity for small-scale agricultural projects with focus on organic farming.',
      requirements: [
        'Agricultural land ownership/lease',
        'Farming experience',
        'Detailed project report',
        'Local farmer group membership'
      ],
      benefits: [
        'Flexible profit sharing',
        'Technical assistance',
        'Market linkage support',
        'Insurance coverage'
      ],
      eligibility: [
        'Small/Marginal farmers',
        'Minimum 2 years farming experience',
        'Own/leased agricultural land',
        'Good credit history'
      ],
      applicationDeadline: '2024-06-30',
      status: 'closing-soon',
      location: 'Agricultural Regions',
      contactEmail: 'invest@agrigrowth.com',
      documents: [
        'Land Documents',
        'Farming Experience Proof',
        'Project Report',
        'Bank Account Details',
        'Credit Report'
      ],
      category: 'Agriculture'
    }
  ];

  private categories = [
    'Business Development',
    'Arts & Crafts',
    'Agriculture',
    'Education',
    'Healthcare',
    'Technology'
  ];

  async getOpportunities(filters?: MicrofinanceFilter): Promise<MicrofinanceOpportunity[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let filteredOpportunities = [...this.opportunities];

    if (filters) {
      if (filters.type) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.type === filters.type);
      }
      if (filters.category) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.category === filters.category);
      }
      if (filters.status) {
        filteredOpportunities = filteredOpportunities.filter(opp => opp.status === filters.status);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOpportunities = filteredOpportunities.filter(opp =>
          opp.title.toLowerCase().includes(searchLower) ||
          opp.description.toLowerCase().includes(searchLower) ||
          opp.provider.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredOpportunities;
  }

  async getCategories(): Promise<string[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.categories;
  }

  async getOpportunityById(id: string): Promise<MicrofinanceOpportunity | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.opportunities.find(opp => opp.id === id) || null;
  }
}

export const microfinanceService = new MicrofinanceService(); 