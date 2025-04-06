
// Mock API functions for the modules
import { useEffect, useState } from 'react';

// Water Module Types
export interface WaterQualityData {
  ph: number;
  turbidity: number;
  tds: number; // Total Dissolved Solids
  chlorine: number;
  status: 'good' | 'moderate' | 'poor';
  lastTested: string;
  indicators?: { name: string; value: number; status: string }[]; // Add support for indicators
}

export interface WaterLeakReport {
  id: string;
  location: string;
  description: string;
  reportDate: string;
  resolved: boolean;
  severity: 'low' | 'medium' | 'high';
  image?: string;
  reporter?: string; // Added for compatibility
  date?: string; // Added for compatibility
  status?: 'reported' | 'resolved' | 'investigating' | 'pending'; // Added for compatibility
}

export interface WaterPurificationMethod {
  id: string;
  name: string;
  description: string;
  steps: string[];
  effectiveAgainst: string[];
  resourcesNeeded: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  method?: string; // Added for compatibility
  effectiveness?: string; // Added for compatibility
  materials?: string[]; // Added for compatibility
  timeRequired?: string; // Added for compatibility
}

export interface WaterData {
  qualityData: WaterQualityData;
  leakReports: WaterLeakReport[];
  purificationMethods: WaterPurificationMethod[];
  purificationGuides?: WaterPurificationMethod[]; // Add alias for compatibility
  villageStats: {
    accessToCleanWater: number;
    leaksReported: number;
    leaksFixed: number;
  };
  alerts: string[];
  leakFixRate?: number; // Add missing field
  purificationEfficiency?: number; // Add missing field
}

// Farmer Module Types
export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  type: string;
  fertility: string;
  organicMatter: string;
}

export interface MarketPrice {
  crop: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PriceHistory {
  month: string;
  wheat: number;
  rice: number;
  pulses: number;
}

export interface WeatherAlert {
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
  description: string;
  date: string;
  message: string;
  recommendation: string;
}

export interface CropData {
  soilData: SoilData;
  recommendedCrops: string[];
  marketPrices: MarketPrice[];
  priceHistory: PriceHistory[];
  weatherAlerts: WeatherAlert[];
}

// Education Module Types
export interface Course {
  id: string;
  title: string;
  subject: string;
  level: string;
  students: number;
  completion?: number;
}

export interface AttendanceStat {
  month: string;
  attendance: number;
}

export interface PerformanceMetric {
  subject: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  metric: string;
}

export interface Class {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  teacher: string;
  location: string;
}

export interface EducationData {
  availableCourses: Course[];
  attendanceStats: AttendanceStat[];
  performanceMetrics: PerformanceMetric[];
  upcomingClasses: Class[];
}

// Health Module Types
export interface HealthFacility {
  name: string;
  type: string;
  distance: number;
  contact: string;
}

export interface DiseasePrevalence {
  disease: string;
  cases: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  speciality: string;
  availability: string;
  contact: string;
  distance: number;
}

export interface HealthData {
  diseasePrevalence: DiseasePrevalence[];
  facilities: HealthFacility[];
  vitals: {
    temperature: { celsius: number; status: 'normal' | 'elevated' | 'fever' };
    bloodPressure: { systolic: number; diastolic: number; status: 'normal' | 'elevated' | 'high' };
    oxygenLevel: { percentage: number; status: 'low' | 'normal' | 'critical' };
    heartRate: { bpm: number; status: 'low' | 'normal' | 'elevated' };
  };
  activeAlerts: string[];
  advisories: string[];
  commonSymptoms: string[];
  availableDoctors: Doctor[];
}

// Resource Module Types
export interface ResourceData {
  deforestationAlerts: {
    location: string;
    area: number;
    date: string;
    severity: 'low' | 'medium' | 'high';
    action: string;
    description?: string; // Added for ResourceModule
  }[];
  soilQuality: {
    region: string; // Changed from location
    quality: number; // Changed from health
    issues?: string[];
    recommendations: string[];
    details?: Record<string, string | number>; // Added for ResourceModule
  }[];
  resourceMaps: {
    title: string; // Changed from name
    type: string;
    coverage: number;
    lastUpdated: string;
    itemCount: number;
    description?: string; // Added for ResourceModule
  }[];
  reservoirLevels: {
    name: string;
    currentLevel: number; // Changed from level
    capacity: number;
    status: 'normal' | 'low' | 'critical';
    trend: 'rising' | 'falling' | 'stable';
    change: number; // Added for ResourceModule
  }[];
  forestCoverage: {
    current: number;
    change: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  waterBodies: {
    healthy: number;
    polluted: number;
    dry: number;
  };
}

// Climate Module Types
export interface CarbonFootprint {
  month: string;
  household: number;
  transportation: number;
  food: number;
  utilities: number;
  goods: number;
  total: number;
  homeEnergy: number;
  comparison: number;
}

export interface ClimateInsight {
  id: string;
  title: string;
  description: string;
  trend: 'positive' | 'negative' | 'neutral';
  impact: string;
  regionalTrend: string;
  seasonalForecast: string;
  adaptationTips: string[];
}

export interface SustainablePractice {
  category: string;
  title: string;
  description: string;
  tips: string[];
  potentialSaving: number;
}

export interface ClimateData {
  carbonFootprint: CarbonFootprint[];
  climateTips: SustainablePractice[];
  climateInsights: ClimateInsight[];
  userActions: {
    completed: number;
    pending: number;
    impact: number;
  };
  localConditions: {
    temperature: number;
    precipitation: number;
    airQuality: number;
    forecast: ('sunny' | 'rainy' | 'cloudy' | 'windy' | 'snowy')[];
  };
}

// Weather Data Types for Climate Module
export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
  forecast: {
    date: string;
    temperature: number;
    condition: string;
    humidity?: number;
    precipitation?: number;
    windSpeed?: number;
  }[];
  carbonData?: {
    homeEnergy: number;
    transportation: number;
    food: number;
    goods: number;
    total: number;
    comparison: string;
  };
  carbonReductionTips?: {
    title: string;
    description: string;
    potentialSaving: number;
  }[];
  sustainableCategories?: {
    name: string;
    itemCount: number;
  }[];
  sustainablePractices?: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
  climateInsights?: {
    regionalTrend: string;
    seasonalForecast: string;
    adaptationTips: string;
  };
}

// Gender Module Types
export interface SkillDemand {
  skill: string;
  demand: number;
  description?: string;
}

export interface GenderStat {
  metric: string;
  value: number;
}

export interface JobListing {
  title: string;
  sector: string;
  location: string;
  salary: string;
  postedDate: string;
}

export interface SkillCourse {
  id: string;
  title: string;
  duration: string;
  level: string;
  provider: string;
  startDate: string;
  location: string;
  skills: string[];
  rating: number;
  offline: boolean;
}

export interface MicrofinanceOption {
  id: string;
  name: string;
  provider: string;
  amount: number; 
  interestRate: number;
  duration: string;
  description: string;
  requirements: string[];
}

export interface SuccessStory {
  id: string;
  name: string;
  age: number;
  location: string;
  story: string;
  profession: string;
  outcome: string;
  photoUrl: string;
}

export interface GenderJobsData {
  skillDemand: SkillDemand[];
  genderStats: GenderStat[];
  microfinanceOptions: MicrofinanceOption[];
  availableJobs: JobListing[];
  skillCourses: SkillCourse[];
  successStories: SuccessStory[];
  eligibilityRequirements: string[];
}

// Mock data fetch functions
export async function fetchWaterData(): Promise<WaterData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        qualityData: {
          ph: 7.2,
          turbidity: 1.8,
          tds: 145,
          chlorine: 0.5,
          status: 'good',
          lastTested: '2025-04-01',
          indicators: [
            { name: 'pH Level', value: 7.2, status: 'normal' },
            { name: 'Turbidity', value: 1.8, status: 'normal' },
            { name: 'Total Dissolved Solids', value: 145, status: 'normal' },
            { name: 'Chlorine', value: 0.5, status: 'normal' }
          ]
        },
        leakReports: [
          {
            id: '1',
            location: 'Main Street Pipeline',
            description: 'Water leaking from burst pipe',
            reportDate: '2025-03-28',
            resolved: false,
            severity: 'high',
            status: 'reported'
          },
          {
            id: '2',
            location: 'Village Square Fountain',
            description: 'Small leak from the base',
            reportDate: '2025-03-30',
            resolved: true,
            severity: 'low',
            status: 'resolved'
          }
        ],
        purificationMethods: [
          {
            id: '1',
            name: 'Boiling',
            method: 'Boiling', // Added for compatibility
            description: 'Simple method that kills most pathogens',
            steps: ['Fill a pot with water', 'Heat until rolling boil', 'Continue boiling for 1-3 minutes', 'Let cool before drinking'],
            effectiveAgainst: ['Bacteria', 'Parasites', 'Most viruses'],
            resourcesNeeded: ['Pot', 'Heat source'],
            difficulty: 'easy',
            effectiveness: 'High', // Added for compatibility
            materials: ['Pot', 'Heat source'], // Added for compatibility
            timeRequired: '15-30 minutes' // Added for compatibility
          },
          {
            id: '2',
            name: 'Solar Disinfection (SODIS)',
            method: 'Solar Disinfection', // Added for compatibility
            description: 'Uses sunlight to kill pathogens',
            steps: ['Fill clear plastic bottles with water', 'Place in direct sunlight for 6+ hours', 'Store properly after disinfection'],
            effectiveAgainst: ['Most bacteria', 'Some viruses'],
            resourcesNeeded: ['Clear plastic bottles', 'Sunlight'],
            difficulty: 'easy',
            effectiveness: 'Medium', // Added for compatibility
            materials: ['Clear plastic bottles', 'Sunlight'], // Added for compatibility
            timeRequired: '6+ hours' // Added for compatibility
          }
        ],
        villageStats: {
          accessToCleanWater: 78.5,
          leaksReported: 12,
          leaksFixed: 8
        },
        alerts: [
          'Maintenance scheduled for water treatment facility on April 15',
          'Boil advisory in effect for northern district due to recent pipe repairs'
        ],
        leakFixRate: 85.2,
        purificationEfficiency: 90.5
      });
    }, 1000);
  });
}

export async function fetchCropData(): Promise<CropData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        soilData: {
          ph: 6.8,
          nitrogen: 3.2,
          phosphorus: 2.5,
          potassium: 1.8,
          type: 'Loam',
          fertility: 'moderate',
          organicMatter: 'medium'
        },
        recommendedCrops: [
          'Wheat', 'Barley', 'Lentils', 'Peas', 'Mustard'
        ],
        marketPrices: [
          { crop: 'Wheat', price: 2125.75, trend: 'up' },
          { crop: 'Rice', price: 3400.50, trend: 'stable' },
          { crop: 'Pulses', price: 5600.25, trend: 'down' }
        ],
        priceHistory: [
          { month: 'Jan', wheat: 2000.50, rice: 3200.75, pulses: 5800.25 },
          { month: 'Feb', wheat: 2050.25, rice: 3250.50, pulses: 5750.75 },
          { month: 'Mar', wheat: 2100.00, rice: 3300.25, pulses: 5700.50 },
          { month: 'Apr', wheat: 2125.75, rice: 3400.50, pulses: 5600.25 }
        ],
        weatherAlerts: [
          {
            title: 'Heavy Rain Warning',
            type: 'Rain',
            severity: 'medium',
            time: '24 Hours',
            description: 'Heavy rainfall expected in the next 24 hours',
            date: '2025-04-05',
            message: 'Protect crops from water logging',
            recommendation: 'Create drainage channels in fields'
          },
          {
            title: 'Frost Advisory',
            type: 'Temperature',
            severity: 'low',
            time: '3 Days',
            description: 'Light frost possible in early mornings',
            date: '2025-04-08',
            message: 'Sensitive crops may be affected',
            recommendation: 'Cover sensitive seedlings in the evening'
          }
        ]
      });
    }, 1000);
  });
}

export async function fetchEducationData(): Promise<EducationData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        availableCourses: [
          { id: '1', title: 'Basic Mathematics', subject: 'Math', level: 'Beginner', students: 45, completion: 68.5 },
          { id: '2', title: 'Introduction to Science', subject: 'Science', level: 'Beginner', students: 38, completion: 72.3 },
          { id: '3', title: 'English Language', subject: 'Language', level: 'Intermediate', students: 32, completion: 56.7 },
          { id: '4', title: 'Computer Skills', subject: 'Technology', level: 'Beginner', students: 28, completion: 45.2 },
          { id: '5', title: 'History & Culture', subject: 'Social Studies', level: 'Intermediate', students: 22, completion: 62.8 }
        ],
        attendanceStats: [
          { month: 'Jan', attendance: 85.2 },
          { month: 'Feb', attendance: 87.5 },
          { month: 'Mar', attendance: 82.8 },
          { month: 'Apr', attendance: 89.4 }
        ],
        performanceMetrics: [
          { subject: 'Mathematics', metric: 'Math', score: 72.5, trend: 'up' },
          { subject: 'Science', metric: 'Science', score: 68.3, trend: 'stable' },
          { subject: 'Language', metric: 'Language', score: 76.2, trend: 'up' },
          { subject: 'Social Studies', metric: 'Social', score: 70.8, trend: 'down' }
        ],
        upcomingClasses: [
          { id: '1', title: 'Math Class', subject: 'Mathematics', date: 'Monday, Apr 5', time: '10:00 AM', teacher: 'Mrs. Sharma', location: 'Room 101' },
          { id: '2', title: 'Science Lab', subject: 'Science', date: 'Tuesday, Apr 6', time: '11:30 AM', teacher: 'Mr. Patel', location: 'Lab 203' },
          { id: '3', title: 'English', subject: 'Language', date: 'Wednesday, Apr 7', time: '9:30 AM', teacher: 'Ms. Gupta', location: 'Room 105' },
          { id: '4', title: 'History', subject: 'Social Studies', date: 'Thursday, Apr 8', time: '2:00 PM', teacher: 'Mr. Singh', location: 'Room 107' }
        ]
      });
    }, 1000);
  });
}

export async function fetchHealthData(): Promise<HealthData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        diseasePrevalence: [
          { disease: 'Malaria', cases: 32.5 },
          { disease: 'Dengue', cases: 18.3 },
          { disease: 'Diarrhea', cases: 45.7 },
          { disease: 'Respiratory', cases: 27.2 }
        ],
        facilities: [
          { name: 'Primary Health Center', type: 'Public Clinic', distance: 2.5, contact: '+91 9876543210' },
          { name: 'Community Hospital', type: 'General Hospital', distance: 12.8, contact: '+91 8765432109' },
          { name: 'Mobile Medical Unit', type: 'Mobile Clinic', distance: 0.5, contact: '+91 7654321098' }
        ],
        vitals: {
          temperature: { celsius: 36.8, status: 'normal' },
          bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
          oxygenLevel: { percentage: 98, status: 'normal' },
          heartRate: { bpm: 72, status: 'normal' }
        },
        activeAlerts: [
          'Dengue outbreak reported in neighboring village. Take precautions.'
        ],
        advisories: [
          'Use mosquito nets while sleeping',
          'Ensure drinking water is properly purified',
          'Get children vaccinated according to schedule',
          'Wash hands regularly with soap'
        ],
        commonSymptoms: [
          'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Sore throat'
        ],
        availableDoctors: [
          { id: '1', name: 'Dr. Reddy', specialization: 'General Medicine', speciality: 'General Medicine', availability: 'Available today', contact: '+91 9876543210', distance: 3.5 },
          { id: '2', name: 'Dr. Khan', specialization: 'Pediatrics', speciality: 'Pediatrics', availability: 'Available tomorrow', contact: '+91 8765432109', distance: 5.2 },
          { id: '3', name: 'Dr. Sharma', specialization: 'Gynecology', speciality: 'Gynecology', availability: 'Available today', contact: '+91 7654321098', distance: 4.8 }
        ]
      });
    }, 1000);
  });
}

export async function fetchResourceData(): Promise<ResourceData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        deforestationAlerts: [
          { 
            location: 'Northern Forest Range', 
            area: 1.2, 
            date: '2025-03-25', 
            severity: 'medium', 
            action: 'Investigation ongoing',
            description: 'Illegal logging detected in protected area'
          },
          { 
            location: 'Western Watershed', 
            area: 0.5, 
            date: '2025-04-01', 
            severity: 'low', 
            action: 'Monitoring',
            description: 'Small clearing detected, possibly natural'
          },
          { 
            location: 'Eastern Reserve', 
            area: 2.3, 
            date: '2025-03-30', 
            severity: 'high', 
            action: 'Enforcement dispatched',
            description: 'Large scale clearing for agriculture'
          }
        ],
        soilQuality: [
          { 
            region: 'Agricultural Belt', 
            quality: 72.5, 
            issues: ['Moderate erosion', 'Low organic content'], 
            recommendations: ['Add compost', 'Implement crop rotation'],
            details: {
              'pH': 6.8,
              'Nitrogen': '45 ppm',
              'Phosphorus': '28 ppm',
              'Potassium': '180 ppm'
            }
          },
          { 
            region: 'River Delta', 
            quality: 85.2, 
            issues: ['Silt accumulation'], 
            recommendations: ['Maintain buffer zones'],
            details: {
              'pH': 7.2,
              'Nitrogen': '62 ppm',
              'Phosphorus': '35 ppm',
              'Potassium': '210 ppm'
            }
          },
          { 
            region: 'Hillside Farms', 
            quality: 65.8, 
            issues: ['Severe erosion', 'Nutrient depletion'], 
            recommendations: ['Terracing', 'Cover crops', 'Agroforestry'],
            details: {
              'pH': 6.2,
              'Nitrogen': '32 ppm',
              'Phosphorus': '18 ppm',
              'Potassium': '120 ppm'
            }
          }
        ],
        resourceMaps: [
          { 
            title: 'Forest Cover', 
            type: 'Vegetation', 
            coverage: 68.5, 
            lastUpdated: '2025-03-15', 
            itemCount: 35,
            description: 'Map showing distribution of forest types and density'
          },
          { 
            title: 'Water Bodies', 
            type: 'Hydrology', 
            coverage: 92.3, 
            lastUpdated: '2025-03-20', 
            itemCount: 28,
            description: 'Map of rivers, lakes, ponds and underground water sources'
          },
          { 
            title: 'Soil Types', 
            type: 'Pedology', 
            coverage: 85.7, 
            lastUpdated: '2025-03-10', 
            itemCount: 12,
            description: 'Distribution of major soil types and quality indicators'
          }
        ],
        reservoirLevels: [
          { 
            name: 'Main Reservoir', 
            currentLevel: 72.3, 
            capacity: 100, 
            status: 'normal', 
            trend: 'stable',
            change: 0.2
          },
          { 
            name: 'Agricultural Dam', 
            currentLevel: 45.8, 
            capacity: 80, 
            status: 'low', 
            trend: 'falling',
            change: -1.5
          },
          { 
            name: 'Community Pond', 
            currentLevel: 85.2, 
            capacity: 50, 
            status: 'normal', 
            trend: 'rising',
            change: 2.3
          }
        ],
        forestCoverage: {
          current: 32.5,
          change: -0.8,
          trend: 'decreasing'
        },
        waterBodies: {
          healthy: 18,
          polluted: 5,
          dry: 2
        }
      });
    }, 1000);
  });
}

export async function fetchClimateData(): Promise<ClimateData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        carbonFootprint: [
          { month: 'Jan', household: 320, transportation: 420, food: 280, utilities: 180, goods: 200, total: 1400, homeEnergy: 320, comparison: 1600 },
          { month: 'Feb', household: 300, transportation: 380, food: 260, utilities: 190, goods: 210, total: 1340, homeEnergy: 300, comparison: 1550 },
          { month: 'Mar', household: 280, transportation: 400, food: 250, utilities: 170, goods: 190, total: 1290, homeEnergy: 280, comparison: 1520 },
          { month: 'Apr', household: 270, transportation: 390, food: 240, utilities: 160, goods: 180, total: 1240, homeEnergy: 270, comparison: 1500 }
        ],
        climateTips: [
          {
            category: 'Energy',
            title: 'Reduce Energy Consumption',
            description: 'Simple ways to reduce your home energy use',
            tips: ['Use LED bulbs', 'Turn off unused appliances', 'Use natural lighting when possible'],
            potentialSaving: 15.5
          },
          {
            category: 'Water',
            title: 'Water Conservation',
            description: 'Ways to save water in daily life',
            tips: ['Fix leaking taps', 'Collect rainwater for gardening', 'Take shorter showers'],
            potentialSaving: 10.2
          },
          {
            category: 'Transport',
            title: 'Sustainable Transportation',
            description: 'Reduce your transportation footprint',
            tips: ['Use public transport', 'Consider carpooling', 'Walk or cycle for short distances'],
            potentialSaving: 20.8
          }
        ],
        climateInsights: [
          {
            id: '1',
            title: 'Increasing Temperatures',
            description: 'Local temperatures have increased 1.2°C over the past decade',
            trend: 'negative',
            impact: 'Affects crop yields and increases water scarcity',
            regionalTrend: 'Similar trends observed across the region',
            seasonalForecast: 'This summer is projected to be 0.8°C warmer than last year',
            adaptationTips: ['Plant heat-resistant crops', 'Implement water conservation measures']
          },
          {
            id: '2',
            title: 'Rainfall Patterns',
            description: 'More intense but less frequent rainfall events',
            trend: 'negative',
            impact: 'Increased risk of flooding and drought periods',
            regionalTrend: 'Widespread change in monsoon patterns',
            seasonalForecast: '15% higher rainfall intensity expected this monsoon',
            adaptationTips: ['Improve drainage systems', 'Rainwater harvesting']
          },
          {
            id: '3',
            title: 'Community Forest Cover',
            description: 'Local afforestation efforts increased forest cover by 5%',
            trend: 'positive',
            impact: 'Better air quality and reduced soil erosion',
            regionalTrend: 'One of the few areas with positive forest growth',
            seasonalForecast: 'Continued growth expected with community participation',
            adaptationTips: ['Participate in tree planting', 'Protect saplings during dry season']
          }
        ],
        userActions: {
          completed: 12,
          pending: 8,
          impact: 350
        },
        localConditions: {
          temperature: 28.5,
          precipitation: 85.2,
          airQuality: 42.3,
          forecast: ['sunny', 'sunny', 'cloudy', 'rainy', 'cloudy']
        }
      });
    }, 1000);
  });
}

export async function fetchGenderJobsData(): Promise<GenderJobsData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        skillDemand: [
          { skill: 'Tailoring', demand: 75.8, description: 'High demand in local garment industry' },
          { skill: 'Digital Marketing', demand: 82.3, description: 'Growing demand for online business presence' },
          { skill: 'Food Processing', demand: 68.5, description: 'Stable demand in local food industry' },
          { skill: 'Handicrafts', demand: 62.7, description: 'Growing tourist market for local crafts' },
          { skill: 'Healthcare', demand: 88.2, description: 'Critical need in rural healthcare' }
        ],
        genderStats: [
          { metric: 'Workforce Participation', value: 38.5 },
          { metric: 'Equal Pay Progress', value: 42.3 },
          { metric: 'Leadership Positions', value: 25.7 },
          { metric: 'Entrepreneurship Rate', value: 32.6 }
        ],
        microfinanceOptions: [
          { 
            id: '1', 
            name: 'Women Entrepreneur Fund', 
            provider: 'Rural Development Bank', 
            amount: 25000, 
            interestRate: 4.5, 
            duration: '12 months',
            description: 'Low-interest loans for women starting small businesses',
            requirements: ['Valid ID', 'Business plan', 'Group guarantee'] 
          },
          { 
            id: '2', 
            name: 'Craft Business Development', 
            provider: 'Artisan Microfinance', 
            amount: 15000, 
            interestRate: 5.2, 
            duration: '6 months',
            description: 'Special financing for handicraft businesses',
            requirements: ['Craft skills certification', 'Market linkage plan'] 
          },
          { 
            id: '3', 
            name: 'Agricultural Enterprise', 
            provider: 'Rural Cooperative', 
            amount: 30000, 
            interestRate: 3.8, 
            duration: '18 months',
            description: 'Supports women in agricultural value addition',
            requirements: ['Land access document', 'Agricultural training certificate'] 
          }
        ],
        availableJobs: [
          { title: 'Community Health Worker', sector: 'Healthcare', location: 'Rampur Village', salary: '₹8,000/month', postedDate: '3 days ago' },
          { title: 'Tailoring Instructor', sector: 'Education', location: 'Motipur Center', salary: '₹10,000/month', postedDate: '1 week ago' },
          { title: 'Solar Panel Technician', sector: 'Energy', location: 'District-wide', salary: '₹12,000/month', postedDate: '2 days ago' },
          { title: 'Organic Farming Lead', sector: 'Agriculture', location: 'Greenfields Coop', salary: '₹9,500/month', postedDate: 'Today' }
        ],
        skillCourses: [
          {
            id: '1',
            title: 'Mobile Phone Repair',
            duration: '4 weeks',
            level: 'Beginner',
            provider: 'Digital Skills Foundation',
            startDate: 'April 15, 2025',
            location: 'Community Center',
            skills: ['Electronics', 'Customer Service', 'Troubleshooting'],
            rating: 4.5,
            offline: true
          },
          {
            id: '2',
            title: 'Advanced Tailoring',
            duration: '6 weeks',
            level: 'Intermediate',
            provider: 'Women Skill Development',
            startDate: 'April 10, 2025',
            location: 'Craft Center',
            skills: ['Tailoring', 'Design', 'Business'],
            rating: 4.8,
            offline: true
          },
          {
            id: '3',
            title: 'Digital Marketing Basics',
            duration: '3 weeks',
            level: 'Beginner',
            provider: 'Rural Digital Initiative',
            startDate: 'April 20, 2025',
            location: 'Online',
            skills: ['Digital Marketing', 'Social Media', 'Content Creation'],
            rating: 4.3,
            offline: false
          },
          {
            id: '4',
            title: 'Healthcare Assistant',
            duration: '8 weeks',
            level: 'Intermediate',
            provider: 'Health Development Institute',
            startDate: 'May 5, 2025',
            location: 'District Hospital',
            skills: ['Healthcare', 'First Aid', 'Patient Care'],
            rating: 4.7,
            offline: true
          }
        ],
        successStories: [
          {
            id: '1',
            name: 'Lakshmi Devi',
            age: 32,
            location: 'Sundarpur',
            profession: 'Tailor and Entrepreneur',
            story: 'Started with one sewing machine, now runs a workshop with 5 employees making school uniforms.',
            outcome: 'Increased household income by 300%',
            photoUrl: '/images/success-story-1.jpg'
          },
          {
            id: '2',
            name: 'Gita Sharma',
            age: 28,
            location: 'Rampur',
            profession: 'Digital Marketing Consultant',
            story: 'Learned digital skills and now helps local businesses establish online presence.',
            outcome: 'Works remotely for clients across the state',
            photoUrl: '/images/success-story-2.jpg'
          }
        ],
        eligibilityRequirements: [
          'Must be 18 years or older',
          'Resident of the village for at least 6 months',
          'Basic literacy (able to read/write)',
          'No existing large loans',
          'Willing to participate in weekly group meetings'
        ]
      });
    }, 1000);
  });
}

export async function fetchWeatherData(): Promise<WeatherData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        temperature: 28.5,
        humidity: 65.2,
        condition: "Partly Cloudy",
        windSpeed: 8.7,
        precipitation: 20.3,
        forecast: [
          { date: "Mon", temperature: 28.5, condition: "Partly Cloudy" },
          { date: "Tue", temperature: 30.2, condition: "Sunny" },
          { date: "Wed", temperature: 29.8, condition: "Sunny" },
          { date: "Thu", temperature: 27.4, condition: "Cloudy" },
          { date: "Fri", temperature: 25.6, condition: "Rainy" }
        ],
        carbonData: {
          homeEnergy: 234.5,
          transportation: 192.3,
          food: 145.8,
          goods: 87.4,
          total: 660,
          comparison: "12% below"
        },
        carbonReductionTips: [
          {
            title: "Install LED Lighting",
            description: "Replace conventional bulbs with LED lights to reduce energy consumption.",
            potentialSaving: 45.2
          },
          {
            title: "Use Public Transport",
            description: "Take public transport once a week instead of driving your car.",
            potentialSaving: 32.8
          },
          {
            title: "Reduce Meat Consumption",
            description: "Have one meat-free day per week to reduce your carbon footprint.",
            potentialSaving: 28.6
          },
          {
            title: "Optimize Heating",
            description: "Lower your thermostat by 1°C to reduce energy consumption.",
            potentialSaving: 55.3
          }
        ],
        sustainableCategories: [
          { name: "Energy", itemCount: 8 },
          { name: "Water", itemCount: 6 },
          { name: "Waste", itemCount: 5 }
        ],
        sustainablePractices: [
          {
            title: "Home Composting",
            description: "Turn kitchen waste into valuable compost for your garden.",
            impact: "medium",
            difficulty: "easy"
          },
          {
            title: "Rainwater Harvesting",
            description: "Collect and store rainwater for watering plants and gardens.",
            impact: "high",
            difficulty: "medium"
          },
          {
            title: "Solar Panel Installation",
            description: "Generate your own clean electricity from sunlight.",
            impact: "high",
            difficulty: "hard"
          },
          {
            title: "Energy Efficient Appliances",
            description: "Replace old appliances with energy-efficient models.",
            impact: "medium",
            difficulty: "medium"
          }
        ],
        climateInsights: {
          regionalTrend: "Your region has seen a 1.2°C temperature increase over the past decade, above the global average of 0.9°C. Local precipitation patterns have become more erratic, with longer dry spells followed by intense rainfall events.",
          seasonalForecast: "This upcoming summer is projected to be 0.8°C warmer than the historical average with a 30% increased chance of heat waves. Winter precipitation is expected to increase by 15-20%, primarily as rain rather than snow.",
          adaptationTips: "Consider drought-resistant landscaping to conserve water during longer dry periods. Improve drainage systems to handle more intense rainfall events. Plant shade trees on the south and west sides of your home to reduce cooling costs during warmer summers."
        }
      });
    }, 800);
  });
}
