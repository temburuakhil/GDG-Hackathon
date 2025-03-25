
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ModuleCard } from '@/components/ui/ModuleCard';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { Bell, Eye, MicIcon, Search } from 'lucide-react';

const Dashboard = () => {
  return (
    <AppLayout>
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
            </div>
            
            <div className="glass py-2 px-4 rounded-full text-xs bg-primary/10 text-primary font-medium">
              Offline Mode Available
            </div>
          </div>
        </motion.div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4 opacity-90">Explore Modules</h2>
      
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
    </AppLayout>
  );
};

export default Dashboard;
