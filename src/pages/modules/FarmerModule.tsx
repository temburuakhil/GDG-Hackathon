import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart, RefreshCw, ArrowUp, ArrowDown, Minus, Tractor, CloudLightning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchCropData, CropData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataChart from '@/components/ui/DataChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

const FarmerModule = () => {
  const module = modules.find(m => m.id === 'farmer')!;
  const [loading, setLoading] = useState(false);
  const [cropData, setCropData] = useLocalStorage<CropData | null>('crop-data', null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchCropData();
      
      const roundedData = {
        ...data,
        priceHistory: data.priceHistory.map(item => ({
          ...item,
          wheat: Number(item.wheat.toFixed(2)),
          rice: Number(item.rice.toFixed(2)), 
          pulses: Number(item.pulses.toFixed(2))
        })),
        marketPrices: data.marketPrices.map(item => ({
          ...item,
          price: Number(item.price.toFixed(2))
        })),
        soilData: data.soilData ? {
          ...data.soilData,
          nitrogen: Number(data.soilData.nitrogen.toFixed(2)),
          phosphorus: Number(data.soilData.phosphorus.toFixed(2)),
          potassium: Number(data.soilData.potassium.toFixed(2)),
          ph: Number(data.soilData.ph.toFixed(2))
        } : null
      };
      
      setCropData(roundedData);
      toast({
        title: "Crop data updated",
        description: `${roundedData.recommendedCrops.length} recommended crops available`
      });
    } catch (error) {
      console.error("Failed to fetch crop data:", error);
      toast({
        title: "Error updating data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cropData) {
      fetchData();
    }
  }, [cropData]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch(trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  const priceHistoryChart = cropData?.priceHistory.map(item => ({
    name: item.month,
    wheat: item.wheat,
    rice: item.rice,
    pulses: item.pulses
  })) || [];
  
  const toggleFeature = (title: string) => {
    setActiveFeature(activeFeature === title ? null : title);
  };

  const renderFeatureContent = (title: string) => {
    switch(title) {
      case 'Crop Advisories':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Crop Advisories</CardTitle>
              <CardDescription>Get personalized crop recommendations and tips</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Based on your soil type and local conditions, we recommend:</p>
              <div className="mt-4 space-y-3">
                {cropData?.recommendedCrops.slice(0, 3).map((crop, index) => (
                  <div key={index} className="bg-farmer/10 p-4 rounded-md">
                    <h4 className="font-medium">{crop}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Ideal for your soil type and current climate conditions.</p>
                    <p className="text-xs font-medium mt-2">Expected yield: Good</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      case 'Market Trends':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>View current market prices and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <DataChart 
                  type="line" 
                  data={priceHistoryChart}
                  dataKeys={["wheat", "rice", "pulses"]}
                  colors={["#F59E0B", "#10B981", "#8B5CF6"]}
                  xAxisKey="name"
                />
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Price Analysis</h4>
                <p className="text-sm">Market prices for wheat are showing an upward trend over the next month. Consider holding your harvest if possible.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'Equipment Management':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Equipment Management</CardTitle>
              <CardDescription>Track and maintain your farming equipment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Tractor</p>
                    <p className="text-xs text-muted-foreground">Last maintenance: 3 weeks ago</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">Good</div>
                </div>
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Irrigation System</p>
                    <p className="text-xs text-muted-foreground">Last maintenance: 2 months ago</p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">Needs Check</div>
                </div>
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Harvester</p>
                    <p className="text-xs text-muted-foreground">Last maintenance: 1 week ago</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">Good</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <div>
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
                onClick={fetchData}
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
            onClick={() => toggleFeature(feature.title)}
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

      {activeFeature && renderFeatureContent(activeFeature)}
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Tractor className="h-5 w-5" />}
              color="farmer"
              size="sm"
            />
            <CardTitle>AI Crop Advisor</CardTitle>
          </div>
          <CardDescription>
            Get personalized crop recommendations based on your soil type and local conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cropData?.soilData ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-farmer/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Soil pH</p>
                  <p className="text-lg font-semibold">{cropData.soilData.ph}</p>
                </div>
                <div className="bg-farmer/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Nitrogen</p>
                  <p className="text-lg font-semibold">{cropData.soilData.nitrogen}%</p>
                </div>
                <div className="bg-farmer/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Phosphorus</p>
                  <p className="text-lg font-semibold">{cropData.soilData.phosphorus}%</p>
                </div>
                <div className="bg-farmer/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Potassium</p>
                  <p className="text-lg font-semibold">{cropData.soilData.potassium}%</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Recommended Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {cropData.recommendedCrops.map(crop => (
                    <span key={crop} className="px-3 py-1 bg-farmer/10 text-farmer-dark dark:text-farmer-light rounded-full text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Soil Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Your soil is {cropData.soilData.type} with {cropData.soilData.ph < 7 ? 'acidic' : cropData.soilData.ph > 7 ? 'alkaline' : 'neutral'} pH. 
                  It's {cropData.soilData.fertility} in fertility and has {cropData.soilData.organicMatter} organic matter content.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No soil data available.</p>
              <Button className="mt-4" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" /> Load Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {cropData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Current Market Prices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cropData.marketPrices.map((item) => (
              <div key={item.crop} className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{item.crop}</h4>
                  {getTrendIcon(item.trend)}
                </div>
                <p className="text-xl font-semibold mt-2">₹{item.price}/quintal</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<CloudLightning className="h-5 w-5" />}
              color="farmer"
              size="sm"
            />
            <CardTitle>Weather Alerts</CardTitle>
          </div>
          <CardDescription>
            Timely weather alerts to help plan your farming activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cropData?.weatherAlerts ? (
            <div className="space-y-4">
              {cropData.weatherAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                  alert.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
                  'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{alert.title}</h4>
                    <span className="text-xs px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm mt-2">{alert.description}</p>
                  <div className="text-xs mt-3 text-muted-foreground">
                    Farming recommendation: {alert.recommendation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No weather alerts available.</p>
              <Button className="mt-4" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" /> Load Alerts
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 glass rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Market Price Trends</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Recent price trends for wheat, rice, and pulses in your area.
            </p>
          </div>
          
          <div className="h-60 w-full md:w-1/2 flex items-center justify-center bg-farmer/5 rounded-lg border border-farmer/20">
            {!cropData ? (
              <div className="flex items-center justify-center flex-col">
                <BarChart className="h-6 w-6 text-farmer opacity-60 mb-2" />
                <p className="text-sm text-muted-foreground">Loading chart data...</p>
                <Button className="mt-4" size="sm" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Load Data
                </Button>
              </div>
            ) : (
              <DataChart 
                type="line" 
                data={priceHistoryChart}
                dataKeys={["wheat", "rice", "pulses"]}
                colors={["#F59E0B", "#10B981", "#8B5CF6"]}
                xAxisKey="name"
              />
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Data is cached for offline use. Last updated: {cropData ? new Date().toLocaleString() : 'Not yet'}
        </p>
      </motion.div>
    </div>
  );
};

export default FarmerModule;
