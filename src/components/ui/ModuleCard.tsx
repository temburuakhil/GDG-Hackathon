
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { Module } from '@/lib/moduleData';
import { motion } from 'framer-motion';

interface ModuleCardProps {
  module: Module;
  className?: string;
  index?: number;
}

export function ModuleCard({ module, className, index = 0 }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1 + (index * 0.1),
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Link 
        to={`/${module.id}`}
        className={cn(
          "block p-6 rounded-2xl module-card hover-lift",
          `bg-${module.color}-light/20 dark:bg-${module.color}-dark/20 border border-${module.color}-light/30 dark:border-${module.color}-dark/30`,
          className
        )}
      >
        <div className="flex items-start gap-4">
          <AnimatedIcon 
            icon={<module.icon className="h-6 w-6" />}
            color={`${module.color}`}
            animation="float"
          />
          
          <div className="flex-1">
            <h3 className={`font-semibold text-xl text-${module.color}-dark dark:text-${module.color}-light`}>
              {module.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {module.description}
            </p>
            
            <div className="flex items-center gap-2 mt-4 text-sm">
              <span className={`text-${module.color}-dark dark:text-${module.color}-light font-medium`}>
                Explore
              </span>
              <ChevronRight className={`h-4 w-4 text-${module.color}-dark dark:text-${module.color}-light`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
