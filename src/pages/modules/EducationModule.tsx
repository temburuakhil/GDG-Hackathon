import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StemLessons } from '@/components/education/StemLessons';
import { VirtualClassrooms } from '@/components/education/VirtualClassrooms';
import AttendanceTracking from '@/components/education/AttendanceTracking';
import AvailableCourses, { sampleCourses } from '@/components/education/AvailableCourses';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const EducationModule = () => {
  const module = modules.find(m => m.id === 'education')!;
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [stemLessonsOpen, setStemLessonsOpen] = useState(false);
  const [virtualClassroomsOpen, setVirtualClassroomsOpen] = useState(false);
  const [attendanceTrackingOpen, setAttendanceTrackingOpen] = useState(false);
  const [availableCoursesOpen, setAvailableCoursesOpen] = useState(false);
  
  const handleFeatureClick = (feature: any) => {
    console.log('Feature clicked:', feature.title);
    if (feature.title === 'Offline STEM Lessons') {
      console.log('Opening STEM Lessons dialog');
      setStemLessonsOpen(true);
    } else if (feature.title === 'Virtual Classrooms') {
      console.log('Opening Virtual Classrooms dialog');
      setVirtualClassroomsOpen(true);
    } else if (feature.title === 'Attendance Tracking') {
      console.log('Opening Attendance Tracking dialog');
      setAttendanceTrackingOpen(true);
    } else if (feature.title === 'Available Courses') {
      console.log('Opening Available Courses dialog');
      setAvailableCoursesOpen(true);
    } else {
      setSelectedFeature(feature.title);
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
            onClick={() => handleFeatureClick(feature)}
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
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 glass rounded-xl p-6"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Available Courses</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Browse offline courses in mathematics, science, and language studies.
              </p>
            </div>
            
            <button
              onClick={() => setAvailableCoursesOpen(true)}
              className={`px-4 py-2 rounded-md bg-${module.color}/10 hover:bg-${module.color}/20 text-${module.color} text-sm font-medium transition-colors mt-2 md:mt-0`}
            >
              View All Courses
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preview of first two courses */}
            {sampleCourses.slice(0, 2).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg border bg-background/50"
              >
                <div className={`p-2 rounded-lg bg-${course.subject === 'mathematics' ? 'blue' : course.subject === 'science' ? 'green' : 'purple'}-100 dark:bg-${course.subject === 'mathematics' ? 'blue' : course.subject === 'science' ? 'green' : 'purple'}-900/20`}>
                  <BookOpen className={`h-5 w-5 text-${course.subject === 'mathematics' ? 'blue' : course.subject === 'science' ? 'green' : 'purple'}-500`} />
                </div>
                <div>
                  <h4 className="font-medium">{course.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{course.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Courses are available offline. New content syncs when connected.
        </p>
      </motion.div>

      <Dialog open={stemLessonsOpen} onOpenChange={setStemLessonsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <StemLessons />
        </DialogContent>
      </Dialog>

      <Dialog open={virtualClassroomsOpen} onOpenChange={setVirtualClassroomsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <VirtualClassrooms />
        </DialogContent>
      </Dialog>

      <Dialog open={attendanceTrackingOpen} onOpenChange={setAttendanceTrackingOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <AttendanceTracking />
        </DialogContent>
      </Dialog>

      <Dialog open={availableCoursesOpen} onOpenChange={setAvailableCoursesOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <AvailableCourses />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default EducationModule;
