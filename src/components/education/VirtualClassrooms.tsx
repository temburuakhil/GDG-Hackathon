import React, { useState } from 'react';
import { Users, Video, Calendar, Clock, BookOpen, Laptop, Play, AlertCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Class {
  id: string;
  title: string;
  subject: string;
  teacher: {
    name: string;
    qualification: string;
  };
  grade: number;
  time: string;
  date: string;
  duration: number;
  studentsEnrolled: number;
  maxStudents: number;
  description: string;
  isLive: boolean;
  topics: string[];
  materials: {
    name: string;
    type: 'pdf' | 'video' | 'quiz';
  }[];
}

const mockClasses: Class[] = [
  {
    id: '1',
    title: 'Mathematics: Algebra Fundamentals',
    subject: 'Mathematics',
    teacher: {
      name: 'Mrs. Sharma',
      qualification: 'M.Sc. Mathematics'
    },
    grade: 8,
    time: '10:00 AM',
    date: '2024-03-20',
    duration: 45,
    studentsEnrolled: 28,
    maxStudents: 30,
    description: 'Learn essential algebraic concepts with interactive problem-solving sessions.',
    isLive: true,
    topics: ['Variables', 'Expressions', 'Equations'],
    materials: [
      { name: 'Algebra Basics', type: 'pdf' },
      { name: 'Practice Problems', type: 'pdf' },
      { name: 'Concept Video', type: 'video' }
    ]
  },
  {
    id: '2',
    title: 'Science: Understanding Forces',
    subject: 'Science',
    teacher: {
      name: 'Dr. Patel',
      qualification: 'Ph.D. Physics'
    },
    grade: 9,
    time: '11:30 AM',
    date: '2024-03-20',
    duration: 60,
    studentsEnrolled: 25,
    maxStudents: 30,
    description: 'Interactive session on forces in nature with real-world examples.',
    isLive: false,
    topics: ['Newton\'s Laws', 'Gravity', 'Friction'],
    materials: [
      { name: 'Forces Handbook', type: 'pdf' },
      { name: 'Experiment Video', type: 'video' },
      { name: 'Chapter Quiz', type: 'quiz' }
    ]
  },
  {
    id: '3',
    title: 'Computer Science: Basic Programming',
    subject: 'Technology',
    teacher: {
      name: 'Mr. Kumar',
      qualification: 'M.Tech Computer Science'
    },
    grade: 8,
    time: '2:00 PM',
    date: '2024-03-20',
    duration: 50,
    studentsEnrolled: 20,
    maxStudents: 25,
    description: 'Introduction to programming concepts using visual programming tools.',
    isLive: false,
    topics: ['Algorithms', 'Variables', 'Loops'],
    materials: [
      { name: 'Programming Guide', type: 'pdf' },
      { name: 'Code Examples', type: 'pdf' },
      { name: 'Practice Quiz', type: 'quiz' }
    ]
  }
];

export const VirtualClassrooms = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState('live');

  const getLiveClasses = () => mockClasses.filter(c => c.isLive);
  const getScheduledClasses = () => mockClasses.filter(c => !c.isLive);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAvailabilityColor = (enrolled: number, max: number) => {
    const ratio = enrolled / max;
    if (ratio >= 0.9) return 'text-red-500 bg-red-500/10';
    if (ratio >= 0.7) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-education" />
          <h2 className="text-xl font-semibold">Virtual Classrooms</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          Live Classes Available
        </Badge>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Live Now
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {getLiveClasses().map((classItem) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedClass?.id === classItem.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedClass(classItem)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="destructive" className="mb-2">LIVE</Badge>
                      <CardTitle className="text-base">{classItem.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {classItem.teacher.name} • {classItem.teacher.qualification}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getAvailabilityColor(classItem.studentsEnrolled, classItem.maxStudents)}
                    >
                      {classItem.studentsEnrolled}/{classItem.maxStudents} Students
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{classItem.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {classItem.time} • {classItem.duration} mins
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Grade {classItem.grade}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {getScheduledClasses().map((classItem) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedClass?.id === classItem.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedClass(classItem)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{classItem.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {classItem.teacher.name} • {classItem.teacher.qualification}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getAvailabilityColor(classItem.studentsEnrolled, classItem.maxStudents)}
                    >
                      {classItem.studentsEnrolled}/{classItem.maxStudents} Students
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{classItem.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(classItem.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {classItem.time} • {classItem.duration} mins
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Grade {classItem.grade}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {selectedClass && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedClass.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedClass(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {selectedClass.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Teacher</span>
                <span>{selectedClass.teacher.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Qualification</span>
                <span>{selectedClass.teacher.qualification}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Grade Level</span>
                <span>Grade {selectedClass.grade}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span>{selectedClass.duration} minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Students Enrolled</span>
                <Badge variant="outline" className={getAvailabilityColor(selectedClass.studentsEnrolled, selectedClass.maxStudents)}>
                  {selectedClass.studentsEnrolled}/{selectedClass.maxStudents}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Class Materials</h4>
              <div className="space-y-2">
                {selectedClass.materials.map((material) => (
                  <div key={material.name} className="flex items-center justify-between text-sm">
                    <span>{material.name}</span>
                    <Badge variant="secondary">{material.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              className="w-full"
              variant={selectedClass.isLive ? "default" : "secondary"}
            >
              {selectedClass.isLive ? (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Join Live Class
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Enroll in Class
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 