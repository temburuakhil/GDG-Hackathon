export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  outcomes: string[];
  instructor: string;
  rating: number;
  enrolledCount: number;
  image: string;
  startDate: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
}

export interface SkillFilter {
  category?: string;
  level?: string;
  mode?: string;
  search?: string;
}

// Mock data for development
const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Traditional Handicraft Making',
    category: 'Handicrafts',
    description: 'Learn the art of traditional Indian handicrafts including pottery, weaving, and embroidery.',
    duration: '3 months',
    level: 'Beginner',
    prerequisites: ['Basic hand coordination', 'Interest in traditional arts'],
    outcomes: [
      'Create basic pottery items',
      'Understanding of traditional patterns',
      'Basic weaving techniques',
      'Simple embroidery skills'
    ],
    instructor: 'Meera Sharma',
    rating: 4.8,
    enrolledCount: 125,
    image: '/images/handicraft.jpg',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai Skill Center',
    mode: 'Offline'
  },
  {
    id: '2',
    name: 'Digital Marketing for Artisans',
    category: 'Digital Skills',
    description: 'Learn how to market and sell your handicrafts online using social media and e-commerce platforms.',
    duration: '6 weeks',
    level: 'Beginner',
    prerequisites: ['Basic smartphone knowledge', 'Own handicraft products'],
    outcomes: [
      'Create engaging social media content',
      'Set up an online store',
      'Basic product photography',
      'Customer engagement strategies'
    ],
    instructor: 'Rahul Verma',
    rating: 4.6,
    enrolledCount: 250,
    image: '/images/digital-marketing.jpg',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Online',
    mode: 'Online'
  },
  {
    id: '3',
    name: 'Advanced Textile Design',
    category: 'Textile',
    description: 'Master advanced techniques in textile design including pattern making and sustainable practices.',
    duration: '4 months',
    level: 'Advanced',
    prerequisites: ['Basic textile knowledge', '2 years of experience'],
    outcomes: [
      'Create complex textile patterns',
      'Sustainable textile practices',
      'Advanced weaving techniques',
      'Modern design integration'
    ],
    instructor: 'Priya Patel',
    rating: 4.9,
    enrolledCount: 75,
    image: '/images/textile-design.jpg',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Delhi Design Institute',
    mode: 'Hybrid'
  }
];

const mockCategories = ['Handicrafts', 'Digital Skills', 'Textile', 'Business', 'Design'];

class SkillService {
  async getSkills(filters?: SkillFilter): Promise<Skill[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredSkills = [...mockSkills];

      if (filters) {
        if (filters.category) {
          filteredSkills = filteredSkills.filter(skill => 
            skill.category.toLowerCase() === filters.category?.toLowerCase()
          );
        }
        if (filters.level) {
          filteredSkills = filteredSkills.filter(skill => 
            skill.level.toLowerCase() === filters.level?.toLowerCase()
          );
        }
        if (filters.mode) {
          filteredSkills = filteredSkills.filter(skill => 
            skill.mode.toLowerCase() === filters.mode?.toLowerCase()
          );
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredSkills = filteredSkills.filter(skill =>
            skill.name.toLowerCase().includes(searchLower) ||
            skill.description.toLowerCase().includes(searchLower) ||
            skill.category.toLowerCase().includes(searchLower)
          );
        }
      }

      return filteredSkills;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getSkillById(id: string): Promise<Skill> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const skill = mockSkills.find(s => s.id === id);
      if (!skill) {
        throw new Error('Skill not found');
      }
      return skill;
    } catch (error) {
      console.error('Error fetching skill details:', error);
      throw error;
    }
  }
}

export const skillService = new SkillService(); 