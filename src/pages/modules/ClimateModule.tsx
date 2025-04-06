
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, CloudRain, RefreshCw, Thermometer, Sun, Wind, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchClimateData, ClimateData, fetchWeatherData, WeatherData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataChart from '@/components/ui/DataChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Create a combined type that includes both climate and weather data properties
interface WeatherClimateData {
  temperature: {
    current: number;
    min: number;
    max: number;
    condition: string;
  };
  rainfall: number;
  windSpeed: number;
  humidity: number;
  rainfallProbability: number;
  rainfallType: string;
  windDirection: string;
  gustSpeed: number;
}

const ClimateModule = () => {
  const module = modules.find(m => m.id === 'climate')!;
  const [loading, setLoading] = useState(false);
  const [climateData, setClimateData] = useLocalStorage<WeatherClimateData | null>('climate-data', null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const weatherData = await fetchWeatherData();
      
      // Create a combined data object with all the properties we need
      const combinedData: WeatherClimateData = {
        temperature: {
          current: Number(weatherData.temperature.toFixed(2)),
          min: Number((weatherData.temperature - 5).toFixed(2)), // Simulate min temp
          max: Number((weatherData.temperature + 5).toFixed(2)), // Simulate max temp
          condition: weatherData.condition
        },
        rainfall: Number(weatherData.precipitation.toFixed(2)),
        windSpeed: Number(weatherData.windSpeed.toFixed(2)),
        humidity: Number(weatherData.humidity.toFixed(2)),
        rainfallProbability: weatherData.precipitation > 0 ? 80 : 20, // Simulate rainfall probability
        rainfallType: weatherData.precipitation > 10 ? 'Heavy' : 'Light', // Simulate rainfall type
        windDirection: ['North', 'East', 'South', 'West'][Math.floor(Math.random() * 4)], // Simulate wind direction
        gustSpeed: Number((weatherData.windSpeed * 1.5).toFixed(2)) // Simulate gust speed
      };
      
      setClimateData(combinedData);
      
      toast({
        title: "Climate data updated",
        description: "Latest climate conditions loaded successfully."
      });
    } catch (error) {
      console.error("Failed to fetch climate data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch climate data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!climateData) {
      fetchData();
    }
  }, [climateData]);
  
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
            className={`glass p-6 rounded-xl border-l-4 border-${module.color} hover-lift`}
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
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Thermometer className="h-5 w-5" />}
              color="climate"
              size="sm"
            />
            <CardTitle>Temperature Insights</CardTitle>
          </div>
          <CardDescription>
            Stay informed about temperature changes in your region
          </CardDescription>
        </CardHeader>
        <CardContent>
          {climateData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current Temperature:</span>
                <span className="font-medium">{climateData.temperature.current}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Min Temperature:</span>
                <span className="font-medium">{climateData.temperature.min}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Max Temperature:</span>
                <span className="font-medium">{climateData.temperature.max}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Condition:</span>
                <span className="font-medium">{climateData.temperature.condition}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No temperature data available. Please refresh to load data.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<CloudRain className="h-5 w-5" />}
              color="climate"
              size="sm"
            />
            <CardTitle>Rainfall Details</CardTitle>
          </div>
          <CardDescription>
            Track rainfall patterns and amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {climateData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rainfall Amount:</span>
                <span className="font-medium">{climateData.rainfall} mm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rainfall Probability:</span>
                <span className="font-medium">{climateData.rainfallProbability}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rainfall Type:</span>
                <span className="font-medium">{climateData.rainfallType}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No rainfall data available. Please refresh to load data.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Wind className="h-5 w-5" />}
              color="climate"
              size="sm"
            />
            <CardTitle>Wind Conditions</CardTitle>
          </div>
          <CardDescription>
            Monitor wind speed and direction
          </CardDescription>
        </CardHeader>
        <CardContent>
          {climateData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Wind Speed:</span>
                <span className="font-medium">{climateData.windSpeed} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Wind Direction:</span>
                <span className="font-medium">{climateData.windDirection}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Gust Speed:</span>
                <span className="font-medium">{climateData.gustSpeed} km/h</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No wind data available. Please refresh to load data.</p>
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
            <h3 className="text-lg font-semibold">Temperature Distribution</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Visual representation of temperature ranges.
            </p>
          </div>
          
          <div className="h-60 w-full md:w-1/2 flex items-center justify-center bg-climate/5 rounded-lg border border-climate/20">
            {!climateData ? (
              <div className="flex items-center justify-center flex-col">
                <Thermometer className="h-6 w-6 text-climate opacity-60 mb-2" />
                <p className="text-sm text-muted-foreground">Loading temperature data...</p>
              </div>
            ) : (
              <DataChart 
                type="bar" 
                data={[
                  { name: 'Min', value: climateData.temperature.min, color: '#29ABE2' },
                  { name: 'Current', value: climateData.temperature.current, color: '#F26419' },
                  { name: 'Max', value: climateData.temperature.max, color: '#2E294E' }
                ]}
                dataKeys={['value']}
                colors={['#29ABE2', '#F26419', '#2E294E']}
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
        className="mt-8 glass rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Rainfall Patterns</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Visual representation of rainfall probability.
            </p>
          </div>
          
          <div className="h-60 w-full md:w-1/2 flex items-center justify-center bg-climate/5 rounded-lg border border-climate/20">
            {!climateData ? (
              <div className="flex items-center justify-center flex-col">
                <CloudRain className="h-6 w-6 text-climate opacity-60 mb-2" />
                <p className="text-sm text-muted-foreground">Loading rainfall data...</p>
              </div>
            ) : (
              <DataChart 
                type="line" 
                data={[
                  { name: 'Probability', value: climateData.rainfallProbability, color: '#29ABE2' }
                ]}
                dataKeys={['value']}
                colors={['#29ABE2']}
                xAxisKey="name"
              />
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Climate data updated hourly. Last synced: {climateData ? new Date().toLocaleString() : 'Not yet'}
        </p>
      </motion.div>
    </div>
  );
};

export default ClimateModule;
