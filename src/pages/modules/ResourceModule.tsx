import React, { useState, useEffect } from 'react';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, Trees, RefreshCw, Eye, MapPin, BarChart3, SquareStack } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchResourceData, ResourceData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataChart from '@/components/ui/DataChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResourceModule = () => {
  const module = modules.find(m => m.id === 'resource')!;
  const [loading, setLoading] = useState(false);
  const [resourceData, setResourceData] = useLocalStorage<ResourceData | null>('resource-data', null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchResourceData();
      
      // Round all decimal values to 2 decimal places
      const roundedData = {
        ...data,
        forestCoverage: {
          ...data.forestCoverage,
          current: Number(data.forestCoverage.current.toFixed(2)),
          change: Number(data.forestCoverage.change.toFixed(2))
        },
        soilQuality: data.soilQuality.map(item => ({
          ...item,
          quality: Number(item.quality.toFixed(2))
        })),
        reservoirLevels: data.reservoirLevels ? data.reservoirLevels.map(item => ({
          ...item,
          currentLevel: Number(item.currentLevel.toFixed(2)),
          change: Number(item.change.toFixed(2))
        })) : []
      };
      
      setResourceData(roundedData);
      
      const trendMessage = roundedData.forestCoverage.trend === 'stable' 
        ? 'Forest coverage is stable.' 
        : `Forest coverage is ${roundedData.forestCoverage.trend} by ${Math.abs(roundedData.forestCoverage.change).toFixed(2)}%.`;
      
      toast({
        title: "Resource data updated",
        description: trendMessage
      });
    } catch (error) {
      console.error("Failed to fetch resource data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!resourceData) {
      fetchData();
    } else if (resourceData.soilQuality && resourceData.soilQuality.length > 0 && !selectedRegion) {
      // Set the first region as selected by default
      setSelectedRegion(resourceData.soilQuality[0].region);
    }
  }, [resourceData]);
  
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
              icon={<Eye className="h-5 w-5" />}
              color="resource"
              size="sm"
            />
            <CardTitle>Deforestation Alerts</CardTitle>
          </div>
          <CardDescription>
            Get alerts about forest cover changes in your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resourceData?.deforestationAlerts ? (
            <div className="space-y-4">
              {resourceData.deforestationAlerts.length > 0 ? (
                resourceData.deforestationAlerts.map((alert, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      alert.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                      alert.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' :
                      'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> {alert.location}
                        </h4>
                        <p className="text-sm mt-1">{alert.description || `Alert for ${alert.location} area`}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white/50 dark:bg-black/20 rounded-full">
                        {alert.date}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="font-medium">No Deforestation Alerts</h4>
                  <p className="text-sm mt-1">No significant forest cover changes detected in your region.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No deforestation data available. Please refresh to load data.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {resourceData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Water Resources Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass p-4 rounded-lg text-center">
              <h4 className="text-md font-medium text-blue-500">Healthy Water Bodies</h4>
              <p className="text-3xl font-semibold mt-2">{resourceData.waterBodies.healthy}</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <h4 className="text-md font-medium text-amber-500">Polluted Water Bodies</h4>
              <p className="text-3xl font-semibold mt-2">{resourceData.waterBodies.polluted}</p>
            </div>
            <div className="glass p-4 rounded-lg text-center">
              <h4 className="text-md font-medium text-red-500">Dry Water Bodies</h4>
              <p className="text-3xl font-semibold mt-2">{resourceData.waterBodies.dry}</p>
            </div>
          </div>
          
          {resourceData.reservoirLevels && resourceData.reservoirLevels.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Reservoir Water Levels</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {resourceData.reservoirLevels.map((reservoir, index) => (
                  <div key={index} className="glass p-3 rounded-lg">
                    <h5 className="font-medium">{reservoir.name}</h5>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                      <div 
                        className={`h-4 rounded-full ${
                          reservoir.currentLevel > 70 ? 'bg-blue-500' : 
                          reservoir.currentLevel > 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${reservoir.currentLevel}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                      <span>{reservoir.currentLevel}% full</span>
                      <span className={reservoir.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {reservoir.change >= 0 ? '+' : ''}{reservoir.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<BarChart3 className="h-5 w-5" />}
              color="resource"
              size="sm"
            />
            <CardTitle>Soil Health Dashboard</CardTitle>
          </div>
          <CardDescription>
            Monitor and improve your soil quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resourceData?.soilQuality ? (
            <div className="space-y-5">
              {resourceData.soilQuality.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {resourceData.soilQuality.map((item) => (
                    <span 
                      key={item.region} 
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                        selectedRegion === item.region 
                        ? 'bg-resource text-white' 
                        : 'bg-resource/10 text-resource-dark dark:text-resource-light hover:bg-resource/20'
                      }`}
                      onClick={() => setSelectedRegion(item.region)}
                    >
                      {item.region}
                    </span>
                  ))}
                </div>
              )}
              
              {selectedRegion && resourceData.soilQuality.find(item => item.region === selectedRegion) && (
                <div className="p-4 rounded-lg border border-resource/20">
                  <h4 className="text-md font-medium mb-2">
                    Soil Quality: {selectedRegion}
                  </h4>
                  
                  {resourceData.soilQuality
                    .find(item => item.region === selectedRegion)?.details && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {Object.entries(
                        resourceData.soilQuality.find(item => item.region === selectedRegion)?.details || {}
                      ).map(([key, value]) => (
                        <div key={key} className="bg-resource/5 p-3 rounded-lg">
                          <p className="text-xs text-muted-foreground capitalize">{key}</p>
                          <p className="text-lg font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {resourceData.soilQuality.find(item => item.region === selectedRegion)?.recommendations && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Recommendations</h5>
                      <ul className="space-y-1">
                        {resourceData.soilQuality
                          .find(item => item.region === selectedRegion)?.recommendations?.map((rec, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-resource"></span>
                              {rec}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-muted-foreground">No soil data available. Please refresh to load data.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<SquareStack className="h-5 w-5" />}
              color="resource"
              size="sm"
            />
            <CardTitle>Resource Maps</CardTitle>
          </div>
          <CardDescription>
            Visual maps of local natural resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resourceData?.resourceMaps ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resourceData.resourceMaps.map((map, index) => (
                <div key={index} className="glass p-3 rounded-lg">
                  <div className="aspect-[4/3] bg-resource/5 rounded border border-resource/20 flex items-center justify-center mb-2">
                    <div className="text-center">
                      <MapPin className="h-8 w-8 mx-auto text-resource/40 mb-2" />
                      <p className="text-sm text-muted-foreground">{map.description}</p>
                    </div>
                  </div>
                  <h4 className="font-medium">{map.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Last updated: {map.lastUpdated}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <MapPin className="h-10 w-10 text-resource/30 mb-3" />
              <p className="text-muted-foreground">No resource maps available</p>
              <p className="text-xs text-muted-foreground mt-1">Maps will be available once synced</p>
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
            <h3 className="text-lg font-semibold">Forest Cover Status</h3>
            {resourceData ? (
              <div className="space-y-4 mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Forest Coverage:</span>
                  <span className="font-medium">{resourceData.forestCoverage.current}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Change in Last Year:</span>
                  <span className={`font-medium ${resourceData.forestCoverage.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {resourceData.forestCoverage.change >= 0 ? '+' : ''}{resourceData.forestCoverage.change}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current Trend:</span>
                  <span className={`font-medium ${
                    resourceData.forestCoverage.trend === 'increasing' ? 'text-green-500' : 
                    resourceData.forestCoverage.trend === 'decreasing' ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {resourceData.forestCoverage.trend.charAt(0).toUpperCase() + resourceData.forestCoverage.trend.slice(1)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Forest cover in your district is stable. No deforestation alerts.
              </p>
            )}
          </div>
          
          <div className="h-60 w-full md:w-1/2 flex items-center justify-center bg-resource/5 rounded-lg border border-resource/20">
            {!resourceData ? (
              <div className="flex items-center justify-center flex-col">
                <Trees className="h-6 w-6 text-resource opacity-60 mb-2" />
                <p className="text-sm text-muted-foreground">Loading forest cover data...</p>
              </div>
            ) : (
              <DataChart 
                type="pie" 
                data={[
                  { name: 'Forest', value: resourceData.forestCoverage.current, color: '#4CAF50' },
                  { name: 'Non-Forest', value: 100 - resourceData.forestCoverage.current, color: '#9E9E9E' }
                ]}
              />
            )}
          </div>
        </div>
      </motion.div>
      
      {resourceData && resourceData.soilQuality && resourceData.soilQuality.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Soil Quality by Region</h3>
          <div className="h-60">
            <DataChart 
              type="bar" 
              data={resourceData.soilQuality.map(item => ({
                name: item.region,
                value: item.quality
              }))}
              dataKeys={['value']}
              colors={['#8B5CF6']}
              xAxisKey="name"
            />
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Resource data synced weekly. Last updated: {resourceData ? new Date().toLocaleString() : 'Not yet'}
        </p>
      </motion.div>
    </div>
  );
};

export default ResourceModule;
