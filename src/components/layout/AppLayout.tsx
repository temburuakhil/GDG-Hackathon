
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageTransition } from '@/components/ui/PageTransition';
import { cn } from '@/lib/utils';
import { Leaf, MicIcon, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage and system preference for dark mode
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Set initial theme based on state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Sound enabled" : "Sound muted",
    });
  };

  const toggleVoiceRecognition = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice recognition disabled" : "Voice recognition enabled",
      description: isListening ? "Voice commands deactivated" : "Please speak your command",
    });
  };

  // Check if we're on a special page type
  const isLandingPage = location.pathname === '/';
  const isModulePage = location.pathname.startsWith('/water') || 
                       location.pathname.startsWith('/farmer') || 
                       location.pathname.startsWith('/education') || 
                       location.pathname.startsWith('/health') || 
                       location.pathname.startsWith('/resource') || 
                       location.pathname.startsWith('/climate') || 
                       location.pathname.startsWith('/gender');
  const isNotFoundPage = location.pathname === '*';

  // For 404 page, return children directly without layout
  if (isNotFoundPage) {
    return children;
  }

  return (
    <div className={cn(
      "min-h-screen w-full bg-background text-foreground flex flex-col font-body rural-bg-pattern",
      isDarkMode ? 'dark' : ''
    )}>
      {/* Background gradient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-rural-green/10 dark:bg-rural-green/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-rural-brown/10 dark:bg-rural-brown/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-rural-accent/10 dark:bg-rural-accent/5 rounded-full blur-3xl" />
      </div>
      
      {/* Header - Now showing on all pages except landing page */}
      {!isLandingPage && (
        <header className="w-full px-6 py-4 flex items-center justify-between glass sticky top-0 z-10 border-b border-rural-brown/10 dark:border-rural-green/10">
          <Link 
            to="/dashboard"
            className="flex items-center space-x-2 text-xl font-display"
          >
            <span className="bg-rural-green text-white h-8 w-8 rounded-full flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </span>
            <span>GramSeva AI</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full glass glass-hover"
              onClick={toggleVoiceRecognition}
            >
              <MicIcon className={cn(
                "h-5 w-5",
                isListening ? "text-rural-green animate-pulse" : "text-muted-foreground"
              )} />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full glass glass-hover"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full glass glass-hover"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-rural-brown" />
              )}
            </motion.button>
          </div>
        </header>
      )}
      
      {/* Main content */}
      <main className={cn(
        "flex-1",
        !isLandingPage && !isModulePage && "container max-w-7xl mx-auto px-4 py-6"
      )}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      {/* Footer only on non-landing non-module pages */}
      {!isLandingPage && !isModulePage && (
        <footer className="w-full py-6 px-4 border-t border-rural-brown/10 dark:border-rural-green/10 mt-auto">
          <div className="container max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2025 GramSeva AI. All rights reserved.</p>
            <p className="mt-1">Designed for rural empowerment.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
