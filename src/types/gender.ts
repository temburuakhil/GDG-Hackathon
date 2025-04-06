
export interface GenderData {
  employmentRatio: {
    male: number;
    female: number;
    gap: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  wageGap: number;
  sectorDistribution: {
    sector: string;
    malePercentage: number;
    femalePercentage: number;
    insights?: string;
  }[];
  leadershipPositions: {
    male: number;
    female: number;
    initiatives?: string[];
  };
  skillTraining: {
    maleParticipation: number;
    femaleParticipation: number;
    programs?: {
      name: string;
      description: string;
      targetGender: 'male' | 'female' | 'all';
      enrollmentStatus?: 'open' | 'coming_soon';
    }[];
    recommendations?: string[];
  };
}
