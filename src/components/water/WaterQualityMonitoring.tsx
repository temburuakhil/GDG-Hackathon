
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import DataChart from '@/components/ui/DataChart';
import { motion } from 'framer-motion';

export interface WaterQualityDataPoint {
  location: string;
  ph: number;
  turbidity: number;
  chlorine: number;
  bacteria: boolean;
  timestamp: string;
}

interface WaterQualityMonitoringProps {
  data: WaterQualityDataPoint[];
  onRefresh: () => Promise<void>;
  loading: boolean;
}

const WaterQualityMonitoring: React.FC<WaterQualityMonitoringProps> = ({
  data,
  onRefresh,
  loading
}) => {
  const chartData = data.map(point => ({
    name: point.location,
    ph: Number(point.ph.toFixed(2)),
    turbidity: Number(point.turbidity.toFixed(2)),
    chlorine: Number(point.chlorine.toFixed(2)),
  }));
  
  const handleRefresh = async () => {
    await onRefresh();
    toast({
      title: "Water quality data updated",
      description: "Latest measurements from all monitoring stations"
    });
  };

  const getWaterQualityStatus = () => {
    if (!data.length) return "Unknown";
    
    // Count potentially unsafe samples
    const unsafeSamples = data.filter(sample => 
      sample.ph < 6.5 || 
      sample.ph > 8.5 || 
      sample.turbidity > 5 || 
      sample.chlorine < 0.2 || 
      sample.chlorine > 4 ||
      sample.bacteria
    ).length;
    
    const percentage = unsafeSamples / data.length;
    
    if (percentage === 0) return "Excellent";
    if (percentage < 0.1) return "Good";
    if (percentage < 0.3) return "Fair";
    return "Poor";
  };

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<AlertCircle className="h-5 w-5" />}
              color="water"
              size="sm"
            />
            <CardTitle>Water Quality Monitoring</CardTitle>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={loading}
            size="sm"
            className="bg-water text-white hover:bg-water/90"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
        <CardDescription>
          Real-time water quality data from local sources.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-water/10 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Quality</div>
            <div className="text-lg font-semibold text-water-dark">{getWaterQualityStatus()}</div>
          </div>
          <div className="bg-water/10 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Locations</div>
            <div className="text-lg font-semibold text-water-dark">{data.length}</div>
          </div>
          <div className="bg-water/10 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Avg pH</div>
            <div className="text-lg font-semibold text-water-dark">
              {data.length ? (data.reduce((sum, item) => sum + item.ph, 0) / data.length).toFixed(2) : '-'}
            </div>
          </div>
          <div className="bg-water/10 p-3 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">Safe Samples</div>
            <div className="text-lg font-semibold text-water-dark">
              {data.length - data.filter(sample => sample.bacteria).length}/{data.length}
            </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          {!data.length ? (
            <div className="flex items-center justify-center h-full bg-water/5 rounded-lg border border-water/20">
              <p className="text-sm text-muted-foreground">No data available. Click refresh to load.</p>
            </div>
          ) : (
            <DataChart 
              type="bar" 
              data={chartData}
              dataKeys={['ph', 'turbidity', 'chlorine']}
              colors={['#33C3F0', '#9b87f5', '#F97316']}
              xAxisKey="name"
              height={256}
            />
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <p className="text-xs text-muted-foreground">
            Safe water quality parameters: pH between 6.5-8.5, turbidity below 5 NTU, 
            chlorine between 0.2-4 mg/L, and no harmful bacteria.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default WaterQualityMonitoring;
