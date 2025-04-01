import React, { useState } from 'react';
import { BookOpen, Download, Play, CheckCircle, Clock, Star, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface Lesson {
  id: string;
  title: string;
  subject: 'mathematics' | 'science' | 'technology' | 'engineering';
  grade: number;
  duration: number;
  downloadSize: string;
  isDownloaded: boolean;
  progress: number;
  description: string;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to Algebra',
    subject: 'mathematics',
    grade: 8,
    duration: 45,
    downloadSize: '12MB',
    isDownloaded: true,
    progress: 75,
    description: 'Learn basic algebraic concepts including variables, expressions, and equations.',
    topics: ['Variables', 'Expressions', 'Simple Equations'],
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Basic Electronics',
    subject: 'technology',
    grade: 9,
    duration: 60,
    downloadSize: '25MB',
    isDownloaded: false,
    progress: 0,
    description: 'Explore fundamental electronics concepts with interactive simulations.',
    topics: ['Circuits', 'Components', 'Voltage & Current'],
    difficulty: 'intermediate'
  },
  {
    id: '3',
    title: 'Environmental Science',
    subject: 'science',
    grade: 7,
    duration: 40,
    downloadSize: '18MB',
    isDownloaded: true,
    progress: 100,
    description: 'Study ecosystems and environmental conservation through practical examples.',
    topics: ['Ecosystems', 'Conservation', 'Climate'],
    difficulty: 'beginner'
  },
  {
    id: '4',
    title: 'Bridge Design Basics',
    subject: 'engineering',
    grade: 9,
    duration: 55,
    downloadSize: '30MB',
    isDownloaded: false,
    progress: 0,
    description: 'Learn about basic structural engineering through bridge design principles.',
    topics: ['Forces', 'Materials', 'Design Process'],
    difficulty: 'advanced'
  }
];

export const StemLessons = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'mathematics':
        return 'text-blue-500 bg-blue-500/10';
      case 'science':
        return 'text-green-500 bg-green-500/10';
      case 'technology':
        return 'text-purple-500 bg-purple-500/10';
      case 'engineering':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-500 bg-green-500/10';
      case 'intermediate':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'advanced':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const filteredLessons = mockLessons.filter(lesson => {
    const matchesSubject = !selectedSubject || lesson.subject === selectedSubject;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-education" />
          <h2 className="text-xl font-semibold">Offline STEM Lessons</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Available Offline
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['mathematics', 'science', 'technology', 'engineering'].map(subject => (
            <Button
              key={subject}
              variant={selectedSubject === subject ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubject(subject === selectedSubject ? null : subject)}
              className="flex items-center gap-2"
            >
              <span className="capitalize">{subject}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedLesson?.id === lesson.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedLesson(lesson)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{lesson.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getSubjectColor(lesson.subject)}>
                          {lesson.subject}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(lesson.difficulty)}>
                          {lesson.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {lesson.isDownloaded && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {lesson.duration} mins
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        Grade {lesson.grade}
                      </div>
                    </div>
                    {lesson.isDownloaded && lesson.progress > 0 && (
                      <span className="text-muted-foreground">
                        Progress: {lesson.progress}%
                      </span>
                    )}
                  </div>
                  {lesson.isDownloaded && lesson.progress > 0 && (
                    <Progress value={lesson.progress} className="h-1 mt-2" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div>
          {selectedLesson ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedLesson.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLesson(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Grade Level</span>
                    <span>Grade {selectedLesson.grade}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{selectedLesson.duration} minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Download Size</span>
                    <span>{selectedLesson.downloadSize}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedLesson.description}
                  </p>
                </div>

                <Button 
                  className="w-full"
                  variant={selectedLesson.isDownloaded ? "secondary" : "default"}
                >
                  {selectedLesson.isDownloaded ? (
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Start Lesson
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Lesson
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <p>Select a lesson to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 