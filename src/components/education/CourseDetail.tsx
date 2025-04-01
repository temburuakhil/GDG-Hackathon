import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Tag, 
  Calendar, 
  GraduationCap,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';

interface CourseDetailProps {
  course: {
    id: string;
    title: string;
    subject: 'mathematics' | 'science' | 'language';
    description: string;
    duration: string;
    students: number;
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  onBack: () => void;
}

const CourseDetail = ({ course, onBack }: CourseDetailProps) => {
  const subjectColors = {
    mathematics: 'blue',
    science: 'green',
    language: 'purple'
  };

  const subjectColor = subjectColors[course.subject];

  // Mock course content sections
  const courseSections = [
    {
      id: '1',
      title: 'Introduction',
      duration: '1 week',
      topics: [
        'Course overview',
        'Basic principles',
        'Learning methodology'
      ]
    },
    {
      id: '2',
      title: 'Core Concepts',
      duration: '3 weeks',
      topics: [
        'Fundamental theories',
        'Key terminology',
        'Primary applications'
      ]
    },
    {
      id: '3',
      title: 'Advanced Topics',
      duration: '2 weeks',
      topics: [
        'Advanced techniques',
        'Problem solving',
        'Real-world examples'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button 
          onClick={onBack} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Courses
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className={`p-4 rounded-lg bg-${subjectColor}-100 dark:bg-${subjectColor}-900/20 hidden md:block`}>
          <BookOpen className={`h-8 w-8 text-${subjectColor}-500`} />
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{course.title}</h2>
          <p className="text-muted-foreground mt-2">{course.description}</p>
          
          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.students} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Starts: June 15, 2023</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-semibold">{course.students}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-2xl font-semibold">{course.duration}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="text-2xl font-semibold capitalize">{course.level}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Course Content</h3>
        <div className="space-y-4">
          {courseSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-background/50 border"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{section.title}</h4>
                <span className="text-sm text-muted-foreground">{section.duration}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {section.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 