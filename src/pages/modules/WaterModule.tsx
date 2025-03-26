import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, Droplet, Upload, FileText, AlertCircle, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { waterService } from '@/services/waterService';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const WaterModule = () => {
  const module = modules.find(m => m.id === 'water')!;
  const [leakReport, setLeakReport] = useState({ location: '', description: '' });
  
  // Fetch water quality data
  const { data: waterQuality, isLoading: isLoadingQuality } = useQuery({
    queryKey: ['waterQuality'],
    queryFn: waterService.getWaterQuality,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch water quality trends
  const { data: waterTrends } = useQuery({
    queryKey: ['waterTrends'],
    queryFn: waterService.getWaterQualityTrends,
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch water statistics
  const { data: stats } = useQuery({
    queryKey: ['waterStats'],
    queryFn: waterService.getStats,
  });

  // Fetch purification guides
  const { data: guides } = useQuery({
    queryKey: ['purificationGuides'],
    queryFn: waterService.getPurificationGuides,
  });

  const handleLeakReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await waterService.reportLeak(leakReport);
      setLeakReport({ location: '', description: '' });
      alert('Leak report submitted successfully!');
    } catch (error) {
      console.error('Error submitting leak report:', error);
      alert('Failed to submit leak report. Please try again.');
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
            icon={<Droplet className="h-6 w-6" />}
            color="water"
            size="lg"
            animation="float"
          />
          
          <div>
            <h1 className="h3 text-water-dark dark:text-water-light">{module.name}</h1>
            <p className="text-muted-foreground">{module.description}</p>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats && [
          { label: 'Quality Reports', value: stats.qualityReports },
          { label: 'Leaks Fixed', value: stats.leaksFixed },
          { label: 'Villages Covered', value: stats.villagesCovered }
        ].map((stat, index) => (
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Water Quality Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Water Quality</h2>
          {isLoadingQuality ? (
            <p>Loading water quality data...</p>
          ) : waterQuality && waterQuality[0] ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>pH Level</span>
                <span className="font-semibold">{waterQuality[0].ph.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Turbidity</span>
                <span className="font-semibold">{waterQuality[0].turbidity.toFixed(1)} NTU</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Dissolved Oxygen</span>
                <span className="font-semibold">{waterQuality[0].dissolvedOxygen.toFixed(1)} mg/L</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Temperature</span>
                <span className="font-semibold">{waterQuality[0].temperature.toFixed(1)}°C</span>
              </div>
            </div>
          ) : (
            <p>No water quality data available</p>
          )}
        </Card>

        {/* Report Leak Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Report Water Leak</h2>
          <form onSubmit={handleLeakReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                value={leakReport.location}
                onChange={(e) => setLeakReport(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter leak location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={leakReport.description}
                onChange={(e) => setLeakReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the leak"
                required
              />
            </div>
            <Button type="submit" className="w-full">Submit Report</Button>
          </form>
        </Card>
      </div>

      {/* Water Quality Trends */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Water Quality Trends</h2>
        <div className="h-[300px]">
          {waterTrends && waterTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'MMM d, HH:mm')}
                />
                <Line 
                  type="monotone" 
                  dataKey="ph" 
                  stroke="#0EA5E9" 
                  name="pH Level"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="turbidity" 
                  stroke="#6366F1" 
                  name="Turbidity"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No trend data available</p>
            </div>
          )}
        </div>
      </Card>

      {/* Purification Guides */}
      {guides && guides.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Water Purification Guides</h2>
          <div className="space-y-6">
            {guides.map((guide, index) => (
              <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                <p className="text-muted-foreground mb-3">{guide.content}</p>
                <ol className="list-decimal list-inside space-y-1">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Card>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          {waterQuality && waterQuality[0] && 
            `Data last updated: ${format(new Date(waterQuality[0].timestamp), 'MMM d, h:mm a')}`
          }
        </p>
      </motion.div>
    </AppLayout>
  );
};

export default WaterModule;
