import React, { useEffect, useState } from 'react';
import { Droplets, Thermometer, Leaf, Activity, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { soilHealthService, SoilHealthData } from '@/services/soilHealthService';
import { motion, AnimatePresence } from 'framer-motion';

export const SoilHealthDashboard = () => {
  const [data, setData] = useState<SoilHealthData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SoilHealthData | null>(null);

  useEffect(() => {
    // Initial load
    soilHealthService.getSoilHealthData().then(setData);

    // Subscribe to real-time updates
    const unsubscribe = soilHealthService.subscribe(setData);

    return () => unsubscribe();
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatValue = (value: number) => {
    return value.toFixed(2);
  };

  const getMetricColor = (metric: string, value: number) => {
    const thresholds: Record<string, { warning: [number, number]; critical: [number, number] }> = {
      moisture: { warning: [40, 70], critical: [30, 80] },
      pH: { warning: [6.0, 7.0], critical: [5.5, 7.5] },
      nitrogen: { warning: [35, 50], critical: [30, 60] },
      phosphorus: { warning: [20, 30], critical: [15, 40] },
      potassium: { warning: [140, 200], critical: [120, 250] }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'text-gray-500';

    if (value < threshold.critical[0] || value > threshold.critical[1]) {
      return 'text-red-500';
    }
    if (value < threshold.warning[0] || value > threshold.warning[1]) {
      return 'text-yellow-500';
    }
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Soil Health Dashboard</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          Real-time Updates
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <AnimatePresence>
            {data.map((location) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedLocation?.id === location.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{location.location.name}</CardTitle>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={soilHealthService.getStatusColor(location.status)}
                      >
                        {location.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Droplets className="h-4 w-4" />
                            Moisture
                          </span>
                          <span className={getMetricColor('moisture', location.metrics.moisture)}>
                            {formatValue(location.metrics.moisture)}%
                          </span>
                        </div>
                        <Progress 
                          value={location.metrics.moisture} 
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4" />
                            Temperature
                          </span>
                          <span className={getMetricColor('temperature', location.metrics.temperature)}>
                            {formatValue(location.metrics.temperature)}°C
                          </span>
                        </div>
                        <Progress 
                          value={(location.metrics.temperature / 40) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTimeAgo(location.timestamp)}
                        </div>
                        {location.lastRainfall && (
                          <div className="flex items-center gap-1">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            {location.lastRainfall.amount}mm rain
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {selectedLocation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detailed Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Soil Nutrients</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Nitrogen (N)</span>
                        <span className={getMetricColor('nitrogen', selectedLocation.metrics.nitrogen)}>
                          {formatValue(selectedLocation.metrics.nitrogen)} mg/kg
                        </span>
                      </div>
                      <Progress 
                        value={(selectedLocation.metrics.nitrogen / 60) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Phosphorus (P)</span>
                        <span className={getMetricColor('phosphorus', selectedLocation.metrics.phosphorus)}>
                          {formatValue(selectedLocation.metrics.phosphorus)} mg/kg
                        </span>
                      </div>
                      <Progress 
                        value={(selectedLocation.metrics.phosphorus / 40) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Potassium (K)</span>
                        <span className={getMetricColor('potassium', selectedLocation.metrics.potassium)}>
                          {formatValue(selectedLocation.metrics.potassium)} mg/kg
                        </span>
                      </div>
                      <Progress 
                        value={(selectedLocation.metrics.potassium / 250) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Soil Properties</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>pH Level</span>
                      <span className={getMetricColor('pH', selectedLocation.metrics.pH)}>
                        {formatValue(selectedLocation.metrics.pH)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Organic Matter</span>
                      <span>{formatValue(selectedLocation.metrics.organicMatter)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedLocation.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedLocation.cropHistory && selectedLocation.cropHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Crop History</h4>
                    <div className="space-y-2">
                      {selectedLocation.cropHistory.map((crop, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{crop.crop}</div>
                          <div className="text-muted-foreground">
                            Planted: {formatTimeAgo(crop.plantedDate)}
                            {crop.yield && ` • Yield: ${crop.yield} tons/hectare`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Leaf className="h-8 w-8 mx-auto mb-2" />
                <p>Select a location to view detailed analysis</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 