
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';

interface GenderModuleHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

const GenderModuleHeader: React.FC<GenderModuleHeaderProps> = ({ loading, onRefresh }) => {
  const module = modules.find(m => m.id === 'gender')!;

  return (
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
              onClick={onRefresh}
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
  );
};

export default GenderModuleHeader;
