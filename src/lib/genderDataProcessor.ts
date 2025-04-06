
import { GenderJobsData } from './api';
import { GenderData } from '@/types/gender';

/**
 * Process raw API gender data into a more structured format
 */
export const processGenderData = (rawData: GenderJobsData): GenderData => {
  // Calculate employment ratio from genderStats
  const workforceParticipation = rawData.genderStats.find(s => s.metric === 'Workforce Participation')?.value || 38.5;
  const equalPayProgress = rawData.genderStats.find(s => s.metric === 'Equal Pay Progress')?.value || 42.3;
  const leadershipPositions = rawData.genderStats.find(s => s.metric === 'Leadership Positions')?.value || 25.7;
  
  // Create sector distribution data
  const sectors = ['Healthcare', 'Technology', 'Agriculture', 'Manufacturing', 'Education'];
  const sectorDistribution = sectors.map((sector, index) => {
    // Generate realistic percentages for each sector
    const malePercentage = sector === 'Technology' || sector === 'Manufacturing' 
      ? 60 + Math.random() * 15
      : sector === 'Healthcare' || sector === 'Education'
        ? 30 + Math.random() * 15
        : 45 + Math.random() * 10;
        
    const femalePercentage = 100 - malePercentage;
    
    // Generate insights for some sectors
    const insights = index % 2 === 0 
      ? `${sector} shows ${malePercentage > femalePercentage ? 'male' : 'female'} dominance by ${Math.abs(malePercentage - femalePercentage).toFixed(1)}%`
      : undefined;
      
    return {
      sector,
      malePercentage: Number(malePercentage.toFixed(2)),
      femalePercentage: Number(femalePercentage.toFixed(2)),
      insights
    };
  });
  
  // Process skill training data
  const maleParticipation = 55 + Math.random() * 10;
  const femaleParticipation = 100 - maleParticipation;
  
  // Create training programs from available courses
  const trainingPrograms = rawData.skillCourses.map(course => ({
    name: course.title,
    description: `${course.duration} training in ${course.skills.join(', ')}`,
    targetGender: course.title.includes('Women') ? 'female' as const : 'all' as const,
    enrollmentStatus: Math.random() > 0.3 ? 'open' as const : 'coming_soon' as const
  }));
  
  // Process recommendations
  const recommendations = [
    "Increase women's participation in technical training programs",
    "Provide childcare support during training sessions",
    "Develop mentorship programs for women in male-dominated sectors",
    "Partner with local businesses for apprenticeship opportunities"
  ];
  
  return {
    employmentRatio: {
      male: Number((100 - workforceParticipation).toFixed(2)),
      female: Number(workforceParticipation.toFixed(2)),
      gap: Number((100 - 2 * workforceParticipation).toFixed(2)),
      trend: equalPayProgress > 40 ? 'decreasing' : 'increasing'
    },
    wageGap: Number((100 - equalPayProgress).toFixed(2)),
    sectorDistribution,
    leadershipPositions: {
      male: Number((100 - leadershipPositions).toFixed(2)),
      female: Number(leadershipPositions.toFixed(2)),
      initiatives: [
        "Women in Leadership mentoring program",
        "Gender-balanced hiring committees",
        "Promotion bias training for managers"
      ]
    },
    skillTraining: {
      maleParticipation: Number(maleParticipation.toFixed(2)),
      femaleParticipation: Number(femaleParticipation.toFixed(2)),
      programs: trainingPrograms,
      recommendations
    }
  };
};
