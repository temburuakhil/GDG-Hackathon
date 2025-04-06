
import React, { useState } from 'react';
import { ModuleCard } from '@/components/ui/ModuleCard';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { Bell, Eye, MicIcon, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dataLastUpdated, setDataLastUpdated] = useLocalStorage('dataLastUpdated', '');

  const refreshAllData = async () => {
    setLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last refreshed timestamp
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setDataLastUpdated(formattedDate);
      
      // Show success message
      toast({
        title: "Data refreshed successfully",
        description: "All modules have been updated with the latest data"
      });
    } catch (error) {
      toast({
        title: "Failed to refresh data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div>
          <span className="text-sm text-muted-foreground">Welcome back</span>
          <h1 className="h3 md:h2">GramSeva Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="glass p-2 rounded-full relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          </div>
          
          <div className="glass p-2 rounded-full">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="glass p-2 rounded-full cursor-pointer hover:bg-opacity-80 transition-all duration-300">
            <MicIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 glass rounded-2xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <AnimatedIcon
            icon={<Eye className="h-6 w-6" />}
            color="primary"
            size="lg"
            animation="pulse"
          />
          
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-semibold">Welcome to GramSeva AI</h3>
            <p className="text-muted-foreground text-sm mt-1">
              One app for water, farming, health, education, jobs, natural resources, and climate action.
            </p>
            {dataLastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">Last data refresh: {dataLastUpdated}</p>
            )}
          </div>
          
          <Button 
            onClick={refreshAllData}
            disabled={loading}
            className="bg-primary/80 hover:bg-primary text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh All Data'}
          </Button>
        </div>
      </motion.div>
      
      <h2 className="text-xl font-semibold mb-4 opacity-90 mt-8">Explore Modules</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {modules.map((module, index) => (
          <ModuleCard 
            key={module.id} 
            module={module} 
            index={index}
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          All modules work offline. Data will sync when internet connection is available.
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
