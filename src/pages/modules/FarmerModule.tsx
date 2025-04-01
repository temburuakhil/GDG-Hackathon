import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart, CloudSun, Upload, Sprout, CloudRain, CloudLightning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { farmerService, type FarmerStats, type CropPrice, type WeatherAlert, type MarketTrend, type CropRecommendation } from '@/services/farmerService';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

const FarmerModule = () => {
  const module = modules.find(m => m.id === 'farmer')!;
  const { toast } = useToast();
  const [selectedSoilType, setSelectedSoilType] = useState('Black Soil');
  const [soilAnalysisFile, setSoilAnalysisFile] = useState<File | null>(null);
  
  // State for real-time data
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [marketPrices, setMarketPrices] = useState<CropPrice[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);

  // WebSocket subscriptions
  useEffect(() => {
    // Connect to WebSocket
    farmerService.connectWebSocket();

    // Subscribe to real-time updates
    const unsubscribeStats = farmerService.subscribeToUpdates('farmerStats', setStats);
    const unsubscribePrices = farmerService.subscribeToUpdates('marketPrices', setMarketPrices);
    const unsubscribeAlerts = farmerService.subscribeToUpdates('weatherAlerts', setWeatherAlerts);
    const unsubscribeTrends = farmerService.subscribeToUpdates('marketTrends', setMarketTrends);

    // Initial data fetch
    const fetchInitialData = async () => {
      try {
        const [statsData, pricesData, alertsData, trendsData] = await Promise.all([
          farmerService.getStats(),
          farmerService.getMarketPrices(),
          farmerService.getWeatherAlerts(),
          farmerService.getMarketTrends()
        ]);
        setStats(statsData);
        setMarketPrices(pricesData);
        setWeatherAlerts(alertsData);
        setMarketTrends(trendsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch initial data",
          variant: "destructive"
        });
      }
    };

    fetchInitialData();

    // Cleanup
    return () => {
      unsubscribeStats();
      unsubscribePrices();
      unsubscribeAlerts();
      unsubscribeTrends();
      farmerService.disconnectWebSocket();
    };
  }, []);

  // Update crop recommendations when soil type changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await farmerService.getCropRecommendations(selectedSoilType);
        setCropRecommendations(recommendations);
      } catch (error) {
        console.error('Error fetching crop recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch crop recommendations",
          variant: "destructive"
        });
      }
    };

    fetchRecommendations();
  }, [selectedSoilType]);

  const handleSoilAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soilAnalysisFile) {
      toast({
        title: "Error",
        description: "Please select a soil sample image to upload",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('sample', soilAnalysisFile);

    try {
      await farmerService.submitSoilAnalysis(formData);
      toast({
        title: "Success",
        description: "Soil analysis request submitted successfully",
      });
      setSoilAnalysisFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit soil analysis request",
        variant: "destructive"
      });
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
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats && [
          { label: 'Farmers Registered', value: stats.farmersRegistered },
          { label: 'Market Updates', value: stats.marketUpdates },
          { label: 'Crop Varieties', value: stats.cropVarieties },
          { label: 'Total Area (Hectares)', value: stats.totalArea },
          { label: 'Active Markets', value: stats.activeMarkets }
        ].map((stat, index) => (
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

      {/* Weather Alerts */}
      {weatherAlerts && weatherAlerts.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Weather Alerts</h2>
          <div className="space-y-3">
            {weatherAlerts.map(alert => (
              <Card
                key={alert.id}
                className={`border-2 ${
                  alert.severity === 'high' 
                    ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10'
                    : alert.severity === 'medium'
                    ? 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-900/10'
                    : 'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/10'
                } rounded-lg p-4`}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {alert.type.toLowerCase().includes('rain') ? (
                      <CloudRain className="h-5 w-5" />
                    ) : alert.type.toLowerCase().includes('storm') ? (
                      <CloudLightning className="h-5 w-5" />
                    ) : (
                      <CloudSun className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium">
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                      </h3>
                      <Badge variant={
                        alert.severity === 'high' 
                          ? 'destructive'
                          : alert.severity === 'medium'
                          ? 'secondary'
                          : 'default'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {format(new Date(alert.startDate), 'MMM d, yyyy')} - {format(new Date(alert.endDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Market Prices */}
      {marketPrices && marketPrices.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Market Prices</h2>
          <div className="space-y-4">
            {marketPrices.map(price => (
              <div key={price.id} className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                <div>
                  <h3 className="font-medium">{price.cropName}</h3>
                  <p className="text-sm text-muted-foreground">{price.market}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{price.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{price.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* AI Crop Advisor */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">AI Crop Advisor</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Soil Type</label>
            <Select value={selectedSoilType} onValueChange={setSelectedSoilType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Black Soil">Black Soil</SelectItem>
                <SelectItem value="Red Soil">Red Soil</SelectItem>
                <SelectItem value="Alluvial Soil">Alluvial Soil</SelectItem>
                <SelectItem value="Laterite Soil">Laterite Soil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cropRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropRecommendations.map(rec => (
                <div key={rec.id} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="h-4 w-4" />
                    <h3 className="font-medium">{rec.cropName}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>Confidence: {(rec.confidence * 100).toFixed(1)}%</p>
                    <p>Expected Yield: {rec.expectedYield} quintals/hectare</p>
                    <p>Water Requirement: {rec.waterRequirement} mm</p>
                    <p>Seasons: {rec.seasonality.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSoilAnalysisSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Soil Sample Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setSoilAnalysisFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button type="submit" disabled={!soilAnalysisFile}>
              Submit for Analysis
            </Button>
          </form>
        </div>
      </Card>

      {/* Market Trends */}
      {marketTrends && marketTrends.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Market Price Trends</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketTrends[0].data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), 'MMM d')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), 'PPP')}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
                />
                <Legend />
                {marketTrends.map((trend, index) => (
                  <Line
                    key={trend.cropName}
                    type="monotone"
                    data={trend.data}
                    dataKey="price"
                    name={trend.cropName}
                    stroke={index === 0 ? '#0EA5E9' : index === 1 ? '#6366F1' : '#10B981'}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Data last updated: {marketPrices && marketPrices[0] ? format(new Date(marketPrices[0].timestamp), 'PPP p') : 'Never'}
        </p>
      </motion.div>
    </AppLayout>
  );
};

export default FarmerModule;
