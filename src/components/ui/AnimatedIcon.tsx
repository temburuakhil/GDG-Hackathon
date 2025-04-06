
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  icon: React.ReactNode;
  color: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'pulse' | 'bounce' | 'float' | 'none';
  onClick?: () => void;
}

export function AnimatedIcon({
  icon,
  color,
  className,
  size = 'md',
  animation = 'none',
  onClick
}: AnimatedIconProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 p-2',
    md: 'w-14 h-14 p-3',
    lg: 'w-20 h-20 p-4',
    xl: 'w-24 h-24 p-5'
  };

  const animationVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity }
    },
    bounce: {
      y: [0, -5, 0],
      transition: { duration: 1.5, repeat: Infinity }
    },
    float: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    none: {}
  };

  return (
    <motion.div
      className={cn(
        'rounded-full flex items-center justify-center',
        `bg-${color}/10`,
        sizeClasses[size],
        animation !== 'none' && 'pulse-icon',
        onClick && 'cursor-pointer hover:bg-opacity-20 transition-all duration-300',
        className
      )}
      animate={animationVariants[animation]}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className={`text-${color}`}>
        {icon}
      </div>
    </motion.div>
  );
}
