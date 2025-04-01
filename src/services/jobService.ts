export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // full-time, part-time, contract
  description: string;
  requirements: string[];
  skills: string[];
  salary: string;
  postedDate: string;
  deadline: string;
  category: string; // e.g., handicrafts, textile, etc.
  contactEmail: string;
}

export interface JobFilters {
  category?: string;
  location?: string;
  type?: string;
  skills?: string[];
  search?: string;
}

// Mock data for development
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Handicraft Artisan',
    company: 'Creative Crafts Co.',
    location: 'Mumbai, Maharashtra',
    type: 'full-time',
    description: 'Looking for skilled artisans to create traditional handicrafts.',
    requirements: [
      'Minimum 2 years experience in handicraft making',
      'Knowledge of traditional Indian art forms',
      'Attention to detail',
      'Ability to work independently'
    ],
    skills: ['Handicrafts', 'Traditional Art', 'Design'],
    salary: '₹20,000 - ₹30,000 per month',
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Handicrafts',
    contactEmail: 'jobs@creativecrafts.com'
  },
  {
    id: '2',
    title: 'Textile Designer',
    company: 'Fashion Fabrics Ltd',
    location: 'Delhi, NCR',
    type: 'full-time',
    description: 'Seeking experienced textile designers for creating innovative fabric patterns.',
    requirements: [
      'Degree in Textile Design',
      'Proficiency in design software',
      'Understanding of fabric construction',
      'Portfolio of previous work'
    ],
    skills: ['Textile Design', 'CAD', 'Pattern Making'],
    salary: '₹35,000 - ₹50,000 per month',
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Textile',
    contactEmail: 'careers@fashionfabrics.com'
  },
  {
    id: '3',
    title: 'Weaving Instructor',
    company: 'Traditional Textiles Academy',
    location: 'Bangalore, Karnataka',
    type: 'part-time',
    description: 'Teaching traditional weaving techniques to students.',
    requirements: [
      'Expert knowledge in traditional weaving',
      'Teaching experience',
      'Good communication skills',
      'Patience and dedication'
    ],
    skills: ['Weaving', 'Teaching', 'Traditional Techniques'],
    salary: '₹25,000 - ₹35,000 per month',
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Textile',
    contactEmail: 'hr@textilesacademy.com'
  }
];

const mockCategories = ['Handicrafts', 'Textile', 'Fashion', 'Art & Design', 'Teaching'];

class JobService {
  // For development, we'll use mock data instead of actual API calls
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredJobs = [...mockJobs];

      if (filters) {
        if (filters.category) {
          filteredJobs = filteredJobs.filter(job => 
            job.category.toLowerCase() === filters.category?.toLowerCase()
          );
        }
        if (filters.type) {
          filteredJobs = filteredJobs.filter(job => 
            job.type.toLowerCase() === filters.type?.toLowerCase()
          );
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredJobs = filteredJobs.filter(job =>
            job.title.toLowerCase().includes(searchLower) ||
            job.company.toLowerCase().includes(searchLower) ||
            job.description.toLowerCase().includes(searchLower)
          );
        }
      }

      return filteredJobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async getJobCategories(): Promise<string[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCategories;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  }

  async getJobById(id: string): Promise<Job> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const job = mockJobs.find(j => j.id === id);
      if (!job) {
        throw new Error('Job not found');
      }
      return job;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  }
}

export const jobService = new JobService(); 