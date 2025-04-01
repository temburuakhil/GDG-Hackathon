import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, Users, Tag } from 'lucide-react';
import CourseDetail from './CourseDetail';

export interface Course {
  id: string;
  title: string;
  subject: 'mathematics' | 'science' | 'language';
  description: string;
  duration: string;
  students: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Basic Mathematics',
    subject: 'mathematics',
    description: 'Fundamental concepts of arithmetic and basic algebra',
    duration: '8 weeks',
    students: 25,
    level: 'beginner'
  },
  {
    id: '2',
    title: 'Introduction to Physics',
    subject: 'science',
    description: 'Basic principles of mechanics and energy',
    duration: '12 weeks',
    students: 20,
    level: 'intermediate'
  },
  {
    id: '3',
    title: 'English Grammar',
    subject: 'language',
    description: 'Essential English grammar and writing skills',
    duration: '10 weeks',
    students: 30,
    level: 'beginner'
  },
  {
    id: '4',
    title: 'Advanced Calculus',
    subject: 'mathematics',
    description: 'Complex mathematical concepts and problem solving',
    duration: '16 weeks',
    students: 15,
    level: 'advanced'
  }
];

const AvailableCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = sampleCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const subjectColors = {
    mathematics: 'blue',
    science: 'green',
    language: 'purple'
  };

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Available Courses</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-md border bg-background w-full md:w-[200px]"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-md border bg-background"
          >
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="language">Language</option>
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-md border bg-background"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-${subjectColors[course.subject]}-100 dark:bg-${subjectColors[course.subject]}-900/20`}>
                <BookOpen className={`h-6 w-6 text-${subjectColors[course.subject]}-500`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                <div className="flex flex-wrap gap-4 mt-4">
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
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AvailableCourses; 