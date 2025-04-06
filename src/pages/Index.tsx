
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplet, Tractor, GraduationCap, HeartPulse, Trees, CloudSun, Users, Moon, Sun } from 'lucide-react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage and system preference for dark mode
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  // Add a class to the body to handle specific styles for the landing page
  useEffect(() => {
    document.body.classList.add('landing-page');
    
    // Apply dark mode on initial load
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast({
        title: "Dark mode enabled",
        description: "The rural night theme has been activated.",
      });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast({
        title: "Light mode enabled",
        description: "The rural day theme has been activated.",
      });
    }
  };
  
  return (
    // Use a fragment instead of a div to avoid extra nesting
    <>
      {/* Gradient background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
        <div className="absolute top-0 left-0 w-2/3 h-1/2 bg-rural-green/5 rounded-full blur-3xl transform -translate-x-1/3" />
        <div className="absolute bottom-0 right-0 w-2/3 h-1/2 bg-purple-500/5 rounded-full blur-3xl transform translate-x-1/3" />
        <div className="absolute top-1/3 right-1/3 w-1/3 h-1/3 bg-green-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2 text-xl font-semibold">
          <span className="bg-rural-green text-white h-8 w-8 rounded-full flex items-center justify-center">
            G
          </span>
          <span className="text-white">GramSeva AI</span>
        </div>
        
        <nav className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-white" />
            )}
          </motion.button>
          
          <Link 
            to="/dashboard"
            className="px-5 py-2.5 rounded-full bg-rural-green text-white font-medium hover:bg-rural-green/90 transition-colors"
          >
            Get Started
          </Link>
        </nav>
      </header>
      
      {/* Hero section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10 py-16 min-h-[calc(100vh-200px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 mt-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight">
            <span className="text-rural-green">Empowering Rural India</span>
            <br />
            <span className="text-white">with One Unified</span>
            <br />
            <span className="text-white">Application</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mt-8 max-w-3xl mx-auto">
            A single platform for water, farming, health, education, jobs, and climate action, designed specifically for rural communities.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-8 my-12"
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
          className="mt-4"
        >
          <Link 
            to="/dashboard"
            className="px-8 py-4 rounded-full bg-rural-green text-white font-semibold text-lg flex items-center space-x-2 hover:bg-rural-green/90 transition-colors hover-lift"
          >
            <span>Explore Modules</span>
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center relative z-10 text-sm text-gray-400 mt-auto">
        <p>© 2025 GramSeva AI. All rights reserved.</p>
        <p className="mt-1">Designed for rural empowerment and accessibility.</p>
      </footer>
    </>
  );
};

export default Index;
