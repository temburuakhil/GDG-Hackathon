
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplet, Tractor, GraduationCap, HeartPulse, Trees, CloudSun, Users } from 'lucide-react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

const Index = () => {
  // Add a class to the body to handle specific styles for the landing page
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-purple-500/5 rounded-full blur-3xl transform translate-x-1/3" />
        <div className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-green-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center">
            G
          </span>
          <span>GramSeva AI</span>
        </div>
        
        <nav>
          <Link 
            to="/dashboard"
            className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>
      
      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10 max-w-7xl mx-auto -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h1 className="h1 max-w-4xl mx-auto">
            <span className="text-primary">Empowering Rural India</span> with One Unified Application
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
            A single platform for water, farming, health, education, jobs, and climate action, designed specifically for rural communities.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <AnimatedIcon icon={<Droplet className="h-6 w-6" />} color="water" animation="float" />
          <AnimatedIcon icon={<Tractor className="h-6 w-6" />} color="farmer" animation="float" />
          <AnimatedIcon icon={<GraduationCap className="h-6 w-6" />} color="education" animation="float" />
          <AnimatedIcon icon={<HeartPulse className="h-6 w-6" />} color="health" animation="float" />
          <AnimatedIcon icon={<Trees className="h-6 w-6" />} color="resource" animation="float" />
          <AnimatedIcon icon={<CloudSun className="h-6 w-6" />} color="climate" animation="float" />
          <AnimatedIcon icon={<Users className="h-6 w-6" />} color="gender" animation="float" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link 
            to="/dashboard"
            className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg flex items-center space-x-2 hover:bg-primary/90 transition-colors hover-lift"
          >
            <span>Explore Modules</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 px-4 text-center relative z-10 text-sm text-gray-500 mt-auto">
        <p>© 2023 GramSeva AI. All rights reserved.</p>
        <p className="mt-1">Designed for rural empowerment and accessibility.</p>
      </footer>
    </div>
  );
};

export default Index;
