
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageTransition } from '@/components/ui/PageTransition';
import { cn } from '@/lib/utils';
import { MicIcon, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVoiceRecognition = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop the voice recognition service
  };

  const isLandingPage = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className={cn(
      "min-h-screen w-full bg-background text-foreground flex flex-col font-sans relative",
      isDarkMode ? 'dark' : ''
    )}>
      {/* Background gradient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-blue-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-green-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      {!isLandingPage && (
        <header className="w-full px-6 py-4 flex items-center justify-between glass sticky top-0 z-10">
          <Link 
            to="/dashboard"
            className="flex items-center space-x-2 text-xl font-semibold"
          >
            <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center">
              G
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
                isListening ? "text-primary animate-pulse" : "text-muted-foreground"
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
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.button>
          </div>
        </header>
      )}
      
      {/* Main content */}
      <main className={cn(
        "flex-1",
        !isLandingPage && "container max-w-7xl mx-auto px-4 py-6"
      )}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      {/* Footer only on non-landing pages */}
      {!isLandingPage && (
        <footer className="w-full py-6 px-4 border-t border-border mt-auto">
          <div className="container max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2023 GramSeva AI. All rights reserved.</p>
            <p className="mt-1">Designed for rural empowerment.</p>
          </div>
        </footer>
      )}
    </div>
  );
}
