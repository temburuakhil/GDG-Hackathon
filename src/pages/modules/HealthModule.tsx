import React, { useState, useEffect } from 'react';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, HeartPulse, RefreshCw, MapPin, Phone, Microscope, Stethoscope, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchHealthData, HealthData } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataChart from '@/components/ui/DataChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HealthModule = () => {
  const module = modules.find(m => m.id === 'health')!;
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useLocalStorage<HealthData | null>('health-data', null);
  const [symptomInput, setSymptomInput] = useState('');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchHealthData();
      
      // Round all decimal values to 2 decimal places
      const roundedData = {
        ...data,
        diseasePrevalence: data.diseasePrevalence.map(item => ({
          ...item,
          cases: Number(item.cases.toFixed(2))
        })),
        facilities: data.facilities.map(facility => ({
          ...facility,
          distance: Number(facility.distance.toFixed(2))
        })),
        vitals: {
          ...data.vitals,
          temperature: {
            ...data.vitals.temperature,
            celsius: Number(data.vitals.temperature.celsius.toFixed(2))
          },
          bloodPressure: {
            ...data.vitals.bloodPressure,
            systolic: Number(data.vitals.bloodPressure.systolic.toFixed(2)),
            diastolic: Number(data.vitals.bloodPressure.diastolic.toFixed(2))
          },
          oxygenLevel: {
            ...data.vitals.oxygenLevel,
            percentage: Number(data.vitals.oxygenLevel.percentage.toFixed(2))
          },
          heartRate: {
            ...data.vitals.heartRate,
            bpm: Number(data.vitals.heartRate.bpm.toFixed(2))
          }
        }
      };
      
      setHealthData(roundedData);
      
      if (roundedData.activeAlerts.length > 0) {
        toast({
          title: "Health Alert!",
          description: roundedData.activeAlerts[0],
          variant: "destructive"
        });
      } else {
        toast({
          title: "Health data updated",
          description: "No active health alerts in your area"
        });
      }
    } catch (error) {
      console.error("Failed to fetch health data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch health data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!healthData) {
      fetchData();
    }
  }, [healthData]);

  const handleSymptomCheck = () => {
    if (!symptomInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter your symptoms first.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate symptom checking
    const symptomResponse = getSymptomSuggestion(symptomInput);
    
    toast({
      title: "Symptoms Analyzed",
      description: symptomResponse,
    });
  };
  
  // Function to provide contextual responses based on symptoms
  const getSymptomSuggestion = (symptoms: string) => {
    const lowerSymptoms = symptoms.toLowerCase();
    
    if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('temperature')) {
      return `For fever symptoms, stay hydrated and consider taking a fever reducer. If temperature exceeds 102°F (39°C), seek medical attention.`;
    } else if (lowerSymptoms.includes('cough') || lowerSymptoms.includes('cold')) {
      return `For cough and cold symptoms, get plenty of rest and fluids. If symptoms persist for more than a week, consult a doctor.`;
    } else if (lowerSymptoms.includes('headache')) {
      return `For headaches, rest in a quiet, dark room and try over-the-counter pain relievers. If severe or recurring, consult a healthcare provider.`;
    } else if (lowerSymptoms.includes('stomach') || lowerSymptoms.includes('nausea')) {
      return `For stomach issues, try drinking clear fluids and eating bland foods. Avoid dairy and spicy foods until you feel better.`;
    } else {
      return `Based on your symptoms "${symptoms}", we recommend consulting with a healthcare provider for proper diagnosis and treatment.`;
    }
  };
  
  // Transform disease prevalence data for charts:
  const diseaseChart = healthData?.diseasePrevalence.map(item => ({
    name: item.disease,
    value: item.cases
  })) || [];

  const toggleFeature = (title: string) => {
    setActiveFeature(activeFeature === title ? null : title);
  };
  
  // Feature content components
  const renderFeatureContent = (title: string) => {
    switch(title) {
      case 'Health Tracking':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Health Tracking</CardTitle>
              <CardDescription>Monitor your health metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This feature allows you to track your vital health metrics like blood pressure, weight, and activity levels over time.</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm font-medium">Last Week's Steps</p>
                  <p className="text-2xl font-bold mt-2">48,362</p>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm font-medium">Average Sleep</p>
                  <p className="text-2xl font-bold mt-2">7.2 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'First Aid Guides':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>First Aid Guides</CardTitle>
              <CardDescription>Quick guides for emergency situations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access step-by-step guides for common first aid emergencies:</p>
              <ul className="mt-4 space-y-2">
                <li className="bg-muted p-3 rounded-md">Burns: Cool with running water for 10-15 minutes</li>
                <li className="bg-muted p-3 rounded-md">Cuts: Apply pressure with clean cloth to stop bleeding</li>
                <li className="bg-muted p-3 rounded-md">Choking: Perform back blows followed by abdominal thrusts</li>
                <li className="bg-muted p-3 rounded-md">CPR: 30 compressions followed by 2 rescue breaths</li>
              </ul>
            </CardContent>
          </Card>
        );
      case 'Health Records':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>Store and access your medical history</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Safely store your medical records for offline access:</p>
              <div className="mt-4 space-y-3">
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <span>Vaccination Record</span>
                  <Button size="sm">View</Button>
                </div>
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <span>Medical History</span>
                  <Button size="sm">View</Button>
                </div>
                <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                  <span>Prescription History</span>
                  <Button size="sm">View</Button>
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
              icon={<Microscope className="h-5 w-5" />}
              color="health"
              size="sm"
            />
            <CardTitle>Symptom Checker</CardTitle>
          </div>
          <CardDescription>
            Identify possible health issues with our AI-powered symptom checker
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-health"
              placeholder="Enter symptoms (e.g., fever, headache, cough)"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSymptomCheck()}
            />
            <Button 
              className="bg-health text-white hover:bg-health/90"
              onClick={handleSymptomCheck}
            >
              Check
            </Button>
          </div>
          
          {healthData?.commonSymptoms && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Common Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {healthData.commonSymptoms.map((symptom, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-health/10 text-health-dark dark:text-health-light rounded-full text-xs cursor-pointer hover:bg-health/20"
                    onClick={() => setSymptomInput(symptom)}
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {healthData?.vitals && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Your Latest Health Vitals</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-health/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="text-lg font-semibold">{healthData.vitals.temperature.celsius}°C</p>
                  <p className="text-xs">{healthData.vitals.temperature.status}</p>
                </div>
                <div className="bg-health/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Blood Pressure</p>
                  <p className="text-lg font-semibold">{healthData.vitals.bloodPressure.systolic}/{healthData.vitals.bloodPressure.diastolic}</p>
                  <p className="text-xs">{healthData.vitals.bloodPressure.status}</p>
                </div>
                <div className="bg-health/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Oxygen Level</p>
                  <p className="text-lg font-semibold">{healthData.vitals.oxygenLevel.percentage}%</p>
                  <p className="text-xs">{healthData.vitals.oxygenLevel.status}</p>
                </div>
                <div className="bg-health/10 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Heart Rate</p>
                  <p className="text-lg font-semibold">{healthData.vitals.heartRate.bpm} BPM</p>
                  <p className="text-xs">{healthData.vitals.heartRate.status}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {healthData && healthData.activeAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 p-4 glass rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center gap-3">
            <AnimatedIcon
              icon={<HeartPulse className="h-5 w-5" />}
              color="destructive"
              size="sm"
              animation="pulse"
            />
            <div>
              <h3 className="font-medium text-red-700 dark:text-red-300">Health Alert</h3>
              <p className="text-sm text-red-600 dark:text-red-400">{healthData.activeAlerts[0]}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <Card className="mt-8 hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Stethoscope className="h-5 w-5" />}
              color="health"
              size="sm"
            />
            <CardTitle>Telemedicine</CardTitle>
          </div>
          <CardDescription>
            Connect with healthcare professionals remotely
          </CardDescription>
        </CardHeader>
        <CardContent>
          {healthData?.availableDoctors ? (
            <div className="space-y-4">
              <h4 className="text-md font-medium">Available Doctors</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthData.availableDoctors.map((doctor, index) => (
                  <div key={index} className="glass p-3 rounded-lg border border-health/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">{doctor.name}</h5>
                        <p className="text-xs text-muted-foreground">{doctor.speciality}</p>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{doctor.distance} km away</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">{doctor.availability}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                Consultations can be saved for offline viewing. Video calls require internet connection.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <HeartPulse className="h-10 w-10 text-health/30 mb-3" />
              <p className="text-muted-foreground">No doctors available at the moment</p>
              <p className="text-xs text-muted-foreground mt-1">Refresh to check latest availability</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {healthData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Nearby Healthcare Facilities</h3>
          <div className="space-y-3">
            {healthData.facilities.map((facility, index) => (
              <div key={index} className="glass p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{facility.name}</h4>
                    <p className="text-sm text-muted-foreground">{facility.type}</p>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{facility.distance} km away</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>Call</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 glass rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Health Advisories</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {healthData?.activeAlerts.length 
                ? healthData.activeAlerts[0] 
                : "No active health alerts in your area. Stay hydrated during hot weather."}
            </p>
            
            {healthData && (
              <div className="mt-4 space-y-1">
                {healthData.advisories.map((advisory, index) => (
                  <p key={index} className="text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-health"></span>
                    {advisory}
                  </p>
                ))}
              </div>
            )}
          </div>
          
          <div className="h-60 w-full md:w-1/2 bg-health/5 rounded-lg border border-health/20">
            {!healthData ? (
              <div className="flex items-center justify-center h-full flex-col">
                <HeartPulse className="h-6 w-6 text-health opacity-60 mb-2" />
                <p className="text-sm text-muted-foreground">Loading health information...</p>
              </div>
            ) : (
              <DataChart 
                type="bar" 
                data={diseaseChart}
                dataKeys={["value"]}
                colors={["#F87171"]}
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
          Health information updated daily. Last sync: {healthData ? new Date().toLocaleString() : 'Not yet'}
        </p>
      </motion.div>
    </div>
  );
};

export default HealthModule;
