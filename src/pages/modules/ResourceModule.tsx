import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, Trees, AlertCircle, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DeforestationAlerts } from '@/components/deforestation/DeforestationAlerts';
import { SoilHealthDashboard } from '@/components/soil/SoilHealthDashboard';
import { ResourceMaps } from '@/components/resource/ResourceMaps';
import { ForestCoverStatus } from '@/components/resource/ForestCoverStatus';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ResourceModule = () => {
  const module = modules.find(m => m.id === 'resource')!;
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [deforestationAlertsOpen, setDeforestationAlertsOpen] = useState(false);
  const [soilHealthOpen, setSoilHealthOpen] = useState(false);
  const [resourceMapsOpen, setResourceMapsOpen] = useState(false);
  
  const handleFeatureClick = (feature: any) => {
    console.log('Feature clicked:', feature.title);
    if (feature.title === 'Deforestation Alerts') {
      console.log('Opening Deforestation Alerts dialog');
      setDeforestationAlertsOpen(true);
    } else if (feature.title === 'Soil Health Dashboard') {
      console.log('Opening Soil Health Dashboard dialog');
      setSoilHealthOpen(true);
    } else if (feature.title === 'Resource Maps') {
      console.log('Opening Resource Maps dialog');
      setResourceMapsOpen(true);
    } else {
      setSelectedFeature(feature.title);
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
            icon={<module.icon className="h-6 w-6" />}
            color={module.color}
            size="lg"
            animation="float"
          />
          
          <div>
            <h1 className={`h3 text-${module.color}-dark dark:text-${module.color}-light`}>{module.name}</h1>
            <p className="text-muted-foreground">{module.description}</p>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {module.stats?.map((stat, index) => (
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
      
      <h2 className="text-xl font-semibold mb-4">Features</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {module.features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
            className={`glass p-6 rounded-xl border-l-4 border-${module.color} hover-lift cursor-pointer`}
            onClick={() => handleFeatureClick(feature)}
          >
            <div className="flex items-start gap-4">
              <AnimatedIcon
                icon={<feature.icon className="h-5 w-5" />}
                color={module.color}
                size="sm"
              />
              
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 glass rounded-xl p-6"
      >
        <ForestCoverStatus />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Resource data synced weekly. Last updated: 2 days ago
        </p>
      </motion.div>

      <Dialog open={deforestationAlertsOpen} onOpenChange={setDeforestationAlertsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DeforestationAlerts />
        </DialogContent>
      </Dialog>

      <Dialog open={soilHealthOpen} onOpenChange={setSoilHealthOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <SoilHealthDashboard />
        </DialogContent>
      </Dialog>

      <Dialog open={resourceMapsOpen} onOpenChange={setResourceMapsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <ResourceMaps />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ResourceModule;
