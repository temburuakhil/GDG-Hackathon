
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { fetchGenderJobsData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processGenderData } from '@/lib/genderDataProcessor';
import { GenderData } from '@/types/gender';

// Import our new components
import GenderModuleHeader from '@/components/gender/GenderModuleHeader';
import GenderModuleStats from '@/components/gender/GenderModuleStats';
import GenderOverviewTab from '@/components/gender/GenderOverviewTab';
import GenderSectorTab from '@/components/gender/GenderSectorTab';
import GenderTrainingTab from '@/components/gender/GenderTrainingTab';

const GenderModule = () => {
  const [loading, setLoading] = useState(false);
  const [genderData, setGenderData] = useLocalStorage<GenderData | null>('gender-data', null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const rawData = await fetchGenderJobsData();
      const processedData = processGenderData(rawData);
      
      setGenderData(processedData);
      
      toast({
        title: "Gender data updated",
        description: `Current employment gap: ${processedData.employmentRatio.gap}%`
      });
    } catch (error) {
      console.error("Failed to fetch gender data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch gender data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!genderData) {
      fetchData();
    }
  }, [genderData]);
  
  return (
    <div>
      {/* Header Component */}
      <GenderModuleHeader loading={loading} onRefresh={fetchData} />
      
      {/* Stats and Features Components */}
      <GenderModuleStats />
      
      {/* Tabs Component */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="training">Skill Training</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <GenderOverviewTab genderData={genderData} />
        </TabsContent>
        
        <TabsContent value="sectors">
          <GenderSectorTab genderData={genderData} />
        </TabsContent>
        
        <TabsContent value="training">
          <GenderTrainingTab genderData={genderData} />
        </TabsContent>
      </Tabs>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Gender equality data updated monthly. Last sync: {genderData ? new Date().toLocaleString() : 'Not yet'}
        </p>
      </motion.div>
    </div>
  );
};

export default GenderModule;
