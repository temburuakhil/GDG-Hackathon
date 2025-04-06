
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, RefreshCw, Calendar, Star, Clock, CheckCircle, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchEducationData, EducationData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataChart from '@/components/ui/DataChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

const EducationModule = () => {
  const module = modules.find(m => m.id === 'education')!;
  const [loading, setLoading] = useState(false);
  const [educationData, setEducationData] = useLocalStorage<EducationData | null>('education-data', null);
  const [activeTab, setActiveTab] = useState<'courses' | 'attendance' | 'performance'>('courses');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchEducationData();
      
      // Round all decimal values to 2 places
      const roundedData = {
        ...data,
        attendanceStats: data.attendanceStats.map(stat => ({
          ...stat,
          attendance: Number(stat.attendance.toFixed(2))
        })),
        performanceMetrics: data.performanceMetrics ? data.performanceMetrics.map(metric => ({
          ...metric,
          score: Number(metric.score.toFixed(2))
        })) : [],
        availableCourses: data.availableCourses.map(course => ({
          ...course,
          completion: Number(course.completion ? course.completion.toFixed(2) : 0)
        }))
      };
      
      setEducationData(roundedData);
      toast({
        title: "Education data updated",
        description: `${roundedData.availableCourses.length} courses available`
      });
    } catch (error) {
      console.error("Failed to fetch education data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!educationData) {
      fetchData();
    }
  }, [educationData]);
  
  // When rendering charts, transform the data to match the expected format:
  
  // Example:
  // Transform attendanceStats to the format expected by DataChart
  const chartData = educationData?.attendanceStats.map(item => ({
    name: item.month,
    value: item.attendance
  })) || [];
  
  return (
    <div>
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
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className={`h3 text-${module.color}-dark dark:text-${module.color}-light`}>{module.name}</h1>
              <Button 
                onClick={fetchData}
                disabled={loading}
                size="sm"
                className={`bg-${module.color} text-white hover:bg-${module.color}/90`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Updating...' : 'Refresh Data'}
              </Button>
            </div>
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
            className={`glass p-6 rounded-xl border-l-4 border-${module.color} hover-lift`}
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
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<BookOpen className="h-5 w-5" />}
              color="education"
              size="sm"
            />
            <CardTitle>Offline STEM Lessons</CardTitle>
          </div>
          <CardDescription>
            Educational content that works without internet connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4 border-b pb-2">
            <Button 
              variant={activeTab === 'courses' ? 'default' : 'outline'}
              onClick={() => setActiveTab('courses')}
              size="sm"
              className={activeTab === 'courses' ? 'bg-education text-white' : ''}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Courses
            </Button>
            <Button 
              variant={activeTab === 'attendance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('attendance')}
              size="sm"
              className={activeTab === 'attendance' ? 'bg-education text-white' : ''}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Attendance
            </Button>
            <Button 
              variant={activeTab === 'performance' ? 'default' : 'outline'}
              onClick={() => setActiveTab('performance')}
              size="sm"
              className={activeTab === 'performance' ? 'bg-education text-white' : ''}
            >
              <Star className="h-4 w-4 mr-2" />
              Performance
            </Button>
          </div>
          
          {activeTab === 'courses' && (
            <div className="space-y-4">
              {educationData?.availableCourses.slice(0, 4).map((course) => (
                <div key={course.id} className="glass p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{course.title}</h4>
                    <span className="text-xs px-2 py-1 bg-education/10 text-education-dark dark:text-education-light rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Subject: {course.subject}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{course.students} students enrolled</p>
                    {course.completion !== undefined && (
                      <p className="text-xs text-muted-foreground">{course.completion}% completed</p>
                    )}
                  </div>
                  {course.completion !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                      <div className="bg-education h-1 rounded-full" style={{ width: `${course.completion}%` }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'attendance' && educationData?.attendanceStats && (
            <div className="h-64 mt-4">
              <DataChart 
                type="bar"
                data={chartData}
                dataKeys={["value"]}
                colors={["#0EA5E9"]}
                xAxisKey="name"
              />
            </div>
          )}
          
          {activeTab === 'performance' && educationData?.performanceMetrics && (
            <div className="space-y-3 mt-4">
              {educationData.performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-education h-2 rounded-full" 
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-muted-foreground">{metric.subject}</span>
                    <span className="text-sm font-medium">{metric.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Users className="h-5 w-5" />}
              color="education"
              size="sm"
            />
            <CardTitle>Virtual Classrooms</CardTitle>
          </div>
          <CardDescription>
            Connect with teachers remotely for interactive lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          {educationData?.upcomingClasses ? (
            <div className="space-y-4">
              <h4 className="text-md font-medium">Upcoming Classes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {educationData.upcomingClasses.map((classInfo, index) => (
                  <div key={index} className="glass p-3 rounded-lg border border-education/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">{classInfo.subject}</h5>
                        <p className="text-xs text-muted-foreground">{classInfo.teacher}</p>
                      </div>
                      <Button size="sm" className="bg-education text-white hover:bg-education/90">Join</Button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{classInfo.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Classes can be attended offline. Content will be saved for later access.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <GraduationCap className="h-10 w-10 text-education/30 mb-3" />
              <p className="text-muted-foreground">No upcoming classes scheduled</p>
              <p className="text-xs text-muted-foreground mt-1">Refresh to check latest schedule</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 glass rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Attendance Tracking</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and improve school attendance records
            </p>
            
            {educationData && educationData.attendanceStats && (
              <div className="mt-4 space-y-4">
                <h4 className="text-md font-medium">Monthly Attendance</h4>
                <div className="h-40">
                  <DataChart 
                    type="bar" 
                    data={chartData}
                    dataKeys={["value"]}
                    colors={["#0EA5E9"]}
                    height={160}
                    xAxisKey="name"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="h-80 w-full md:w-1/2 bg-education/5 rounded-lg border border-education/20 overflow-auto">
            {!educationData ? (
              <div className="flex items-center justify-center h-full flex-col">
                <BookOpen className="h-6 w-6 text-education opacity-60 mb-2" />
                <p className="text-sm text-muted-foreground">Loading course catalog...</p>
              </div>
            ) : (
              <div className="p-4">
                <h4 className="text-md font-medium mb-3">Course Catalog</h4>
                <div className="space-y-3">
                  {educationData.availableCourses.map(course => (
                    <div key={course.id} className="glass p-3 rounded-lg">
                      <div className="flex justify-between">
                        <h5 className="font-medium">{course.title}</h5>
                        <span className="text-xs px-2 py-1 bg-education/10 text-education-dark dark:text-education-light rounded-full">
                          {course.level}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Subject: {course.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{course.students} students enrolled</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
    </div>
  );
};

export default EducationModule;
