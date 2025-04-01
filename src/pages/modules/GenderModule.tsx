import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, Briefcase, MapPin, Calendar, Search, Filter,
  Clock, Star, GraduationCap, Book, Monitor, Users2, IndianRupee,
  FileText, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job, JobFilters, jobService } from '@/services/jobService';
import { Skill, SkillFilter, skillService } from '@/services/skillService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { MicrofinanceOpportunity, MicrofinanceFilter, microfinanceService } from '@/services/microfinanceService';

const JobFinder = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, []);

  const fetchJobs = async (appliedFilters?: JobFilters) => {
    setLoading(true);
    try {
      const jobsData = await jobService.getJobs(appliedFilters);
      setJobs(jobsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await jobService.getJobCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    fetchJobs({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchJobs(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={applyFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedJob(job)}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge>{job.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-8">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Jobs Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-2xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedJob.company}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedJob.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div>
                    <p className="font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">{selectedJob.salary}</p>
                  </div>
                  <Button onClick={() => window.location.href = `mailto:${selectedJob.contactEmail}`}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SkillDevelopment = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filters, setFilters] = useState<SkillFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
    fetchCategories();
  }, []);

  const fetchSkills = async (appliedFilters?: SkillFilter) => {
    setLoading(true);
    try {
      const skillsData = await skillService.getSkills(appliedFilters);
      setSkills(skillsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch skills. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await skillService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    fetchSkills({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof SkillFilter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSkills(filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => handleFilterChange('level', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('mode', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={applyFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedSkill(skill)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge>{skill.mode}</Badge>
                  <Badge variant="outline">{skill.level}</Badge>
                </div>
                <CardTitle className="mt-2">{skill.name}</CardTitle>
                <CardDescription>{skill.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {skill.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {skill.duration}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {skill.rating}
                    </div>
                    <div className="flex items-center">
                      <Users2 className="h-4 w-4 mr-1" />
                      {skill.enrolledCount}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {skills.length === 0 && !loading && (
        <div className="text-center py-8">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Skills Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}

      <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
        <DialogContent className="max-w-2xl">
          {selectedSkill && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>{selectedSkill.name}</DialogTitle>
                  <Badge>{selectedSkill.mode}</Badge>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5" />
                    <h3 className="font-semibold">{selectedSkill.instructor}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedSkill.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Starts: {new Date(selectedSkill.startDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedSkill.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Prerequisites</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedSkill.prerequisites.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">What You'll Learn</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedSkill.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{selectedSkill.duration}</p>
                    </div>
                    <div>
                      <p className="font-medium">Rating</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{selectedSkill.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Button>
                    Enroll Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Microfinance = () => {
  const [opportunities, setOpportunities] = useState<MicrofinanceOpportunity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<MicrofinanceOpportunity | null>(null);
  const [filters, setFilters] = useState<MicrofinanceFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchOpportunities();
    fetchCategories();
  }, []);

  const fetchOpportunities = async (appliedFilters?: MicrofinanceFilter) => {
    setLoading(true);
    try {
      const data = await microfinanceService.getOpportunities(appliedFilters);
      setOpportunities(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch opportunities. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await microfinanceService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    fetchOpportunities({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (key: keyof MicrofinanceFilter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchOpportunities(filters);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'closing-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="grant">Grant</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closing-soon">Closing Soon</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={applyFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity) => (
            <Card
              key={opportunity.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedOpportunity(opportunity)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">{opportunity.type}</Badge>
                  <Badge className={getStatusColor(opportunity.status)}>{opportunity.status}</Badge>
                </div>
                <CardTitle className="mt-2">{opportunity.title}</CardTitle>
                <CardDescription>{opportunity.provider}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {opportunity.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {opportunity.amount}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {opportunity.duration}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {opportunities.length === 0 && !loading && (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Opportunities Found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}

      <Dialog open={!!selectedOpportunity} onOpenChange={() => setSelectedOpportunity(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOpportunity && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>{selectedOpportunity.title}</DialogTitle>
                  <Badge className={getStatusColor(selectedOpportunity.status)}>
                    {selectedOpportunity.status}
                  </Badge>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{selectedOpportunity.provider}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedOpportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Deadline: {new Date(selectedOpportunity.applicationDeadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedOpportunity.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedOpportunity.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Eligibility</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedOpportunity.eligibility.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Required Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.documents.map((doc, index) => (
                      <Badge key={index} variant="secondary">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span className="font-medium">Amount: {selectedOpportunity.amount}</span>
                    </div>
                    {selectedOpportunity.interestRate && (
                      <p className="text-sm text-muted-foreground">
                        Interest Rate: {selectedOpportunity.interestRate}
                      </p>
                    )}
                  </div>
                  <Button onClick={() => window.location.href = `mailto:${selectedOpportunity.contactEmail}`}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface LatestOpportunity {
  id: string;
  title: string;
  type: 'job' | 'skill' | 'microfinance';
  provider: string;
  description: string;
  deadline?: string;
  amount?: string;
  category: string;
  status?: string;
}

const GenderModule = () => {
  const module = modules.find(m => m.id === 'gender')!;
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [latestOpportunities, setLatestOpportunities] = useState<LatestOpportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

  useEffect(() => {
    fetchLatestOpportunities();
  }, []);

  const fetchLatestOpportunities = async () => {
    setLoadingOpportunities(true);
    try {
      // Fetch from all services
      const [jobs, skills, microfinance] = await Promise.all([
        jobService.getJobs(),
        skillService.getSkills(),
        microfinanceService.getOpportunities()
      ]);

      // Transform and combine the data
      const transformedJobs = jobs.slice(0, 2).map(job => ({
        id: job.id,
        title: job.title,
        type: 'job' as const,
        provider: job.company,
        description: job.description,
        deadline: job.deadline,
        category: job.category
      }));

      const transformedSkills = skills.slice(0, 2).map(skill => ({
        id: skill.id,
        title: skill.name,
        type: 'skill' as const,
        provider: skill.instructor,
        description: skill.description,
        deadline: skill.startDate,
        category: skill.category
      }));

      const transformedMicrofinance = microfinance.slice(0, 2).map(opp => ({
        id: opp.id,
        title: opp.title,
        type: 'microfinance' as const,
        provider: opp.provider,
        description: opp.description,
        deadline: opp.applicationDeadline,
        amount: opp.amount,
        category: opp.category,
        status: opp.status
      }));

      // Combine and shuffle
      const combined = [...transformedJobs, ...transformedSkills, ...transformedMicrofinance]
        .sort(() => Math.random() - 0.5);

      setLatestOpportunities(combined);
    } catch (error) {
      console.error('Error fetching latest opportunities:', error);
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="h-5 w-5" />;
      case 'skill':
        return <GraduationCap className="h-5 w-5" />;
      case 'microfinance':
        return <IndianRupee className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getOpportunityTypeLabel = (type: string) => {
    switch (type) {
      case 'job':
        return 'Job Opening';
      case 'skill':
        return 'Training Program';
      case 'microfinance':
        return 'Financial Opportunity';
      default:
        return type;
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start gap-4"
        >
          <AnimatedIcon
            icon={<module.icon className="h-6 w-6" />}
            color={module.color}
            size="lg"
            animation="float"
          />
          
          <div>
            <h1 className={`h3 text-${module.color}-dark dark:text-${module.color}-light`}>{module.name}</h1>
            <p className="text-muted-foreground">{module.description}</p>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {module.stats?.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
            className="glass p-6 rounded-xl"
          >
            <h3 className="text-sm text-muted-foreground">{stat.label}</h3>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Features</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {module.features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
            className={`glass p-6 rounded-xl border-l-4 border-${module.color} hover-lift cursor-pointer`}
            onClick={() => setSelectedFeature(feature.title)}
          >
            <div className="flex items-start gap-4">
              <AnimatedIcon
                icon={<feature.icon className="h-5 w-5" />}
                color={module.color}
                size="sm"
              />
              
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedFeature === 'Job Finder' && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl">Job Finder</DialogTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedFeature(null)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </DialogHeader>
              <JobFinder />
            </>
          )}

          {selectedFeature === 'Skill Development' && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl">Skill Development</DialogTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedFeature(null)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </DialogHeader>
              <SkillDevelopment />
            </>
          )}

          {selectedFeature === 'Microfinance' && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl">Microfinance</DialogTitle>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedFeature(null)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </DialogHeader>
              <Microfinance />
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {!selectedFeature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 space-y-6"
        >
          <div className="glass rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Latest Opportunities</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Explore job opportunities and skill development programs in your area.
                </p>
              </div>
            </div>
          </div>

          {loadingOpportunities ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestOpportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedFeature(
                    opportunity.type === 'job' ? 'Job Finder' :
                    opportunity.type === 'skill' ? 'Skill Development' : 'Microfinance'
                  )}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getOpportunityIcon(opportunity.type)}
                        {getOpportunityTypeLabel(opportunity.type)}
                      </Badge>
                      {opportunity.status && (
                        <Badge>{opportunity.status}</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2">{opportunity.title}</CardTitle>
                    <CardDescription>{opportunity.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {opportunity.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        {opportunity.amount && (
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            {opportunity.amount}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'Open'}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {opportunity.category}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loadingOpportunities && latestOpportunities.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Opportunities Found</h3>
              <p className="text-muted-foreground">Check back later for new opportunities</p>
            </div>
          )}
        </motion.div>
      )}
    </AppLayout>
  );
};

export default GenderModule;
