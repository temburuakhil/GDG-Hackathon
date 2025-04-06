import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Droplet, AlertTriangle, CheckCircle2, Gauge, Filter, MessageCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { fetchWaterData, WaterData, WaterLeakReport, WaterPurificationMethod } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataChart from '@/components/ui/DataChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

interface LeakReport {
  id: string;
  location: string;
  description: string;
  reportDate: string;
  resolved: boolean;
  severity: 'low' | 'medium' | 'high';
  reporter?: string;
  date?: string;
  status?: 'reported' | 'resolved';
}

interface PurificationGuide {
  id: string;
  method: string;
  description: string;
  steps: string[];
  effectiveness: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  materials?: string[];
  timeRequired?: string;
}

interface LeakReportingProps {
  reports: LeakReport[];
  onAddReport: (report: LeakReport) => void;
}

const LeakReporting: React.FC<LeakReportingProps> = ({ reports, onAddReport }) => {
  const [newReport, setNewReport] = useState<Partial<LeakReport>>({
    location: '',
    description: '',
    reporter: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReport({ ...newReport, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportToAdd: LeakReport = {
      id: Date.now().toString(),
      location: newReport.location || '',
      description: newReport.description || '',
      reportDate: new Date().toISOString(),
      resolved: false,
      severity: 'medium',
      reporter: newReport.reporter,
      date: newReport.date,
      status: 'reported',
    };
    onAddReport(reportToAdd);
    setNewReport({ location: '', description: '', reporter: '', date: new Date().toISOString().split('T')[0] });
    toast({
      title: "Leak Reported",
      description: `New leak reported at ${newReport.location} by ${newReport.reporter}.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Report Water Leaks</CardTitle>
        <CardDescription>Report any water leaks you find in your community.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={newReport.location} onChange={handleInputChange} className="border rounded px-3 py-2" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={newReport.description} onChange={handleInputChange} className="border rounded px-3 py-2" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="reporter">Your Name</label>
            <input type="text" id="reporter" name="reporter" value={newReport.reporter} onChange={handleInputChange} className="border rounded px-3 py-2" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="date">Date</label>
            <input type="date" id="date" name="date" value={newReport.date} onChange={handleInputChange} className="border rounded px-3 py-2" required />
          </div>
          <Button type="submit">Submit Report</Button>
        </form>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Reports</h3>
          {reports.length > 0 ? (
            <ul className="list-disc list-inside">
              {reports.map((report, index) => (
                <li key={index} className="mb-1">
                  {report.location} - {report.description} 
                  {report.reporter && `(Reported by ${report.reporter}`}
                  {report.date && ` on ${report.date})`}
                  {report.status && ` - Status: ${report.status}`}
                  {!report.reporter && !report.date && ` - Resolved: ${report.resolved ? 'Yes' : 'No'}`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reports have been submitted yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface PurificationGuidesProps {
  guides: PurificationGuide[];
}

const PurificationGuides: React.FC<PurificationGuidesProps> = ({ guides }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Water Purification Guides</CardTitle>
        <CardDescription>Learn about different methods to purify water.</CardDescription>
      </CardHeader>
      <CardContent>
        {guides.length > 0 ? (
          <ul className="grid gap-4">
            {guides.map((guide, index) => (
              <li key={index} className="border rounded p-4">
                <h4 className="font-semibold">{guide.method}</h4>
                <p>{guide.description}</p>
                <p>Effectiveness: {guide.effectiveness}</p>
                <ol className="list-decimal list-inside mt-2">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        ) : (
          <p>No purification guides available.</p>
        )}
      </CardContent>
    </Card>
  );
};

const WaterModule = () => {
  const module = modules.find(m => m.name === 'Water');
  const [waterData, setWaterData] = useLocalStorage<WaterData | null>('waterData', null);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<LeakReport[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (waterData) {
      const convertedReports: LeakReport[] = waterData.leakReports?.map(report => ({
        id: report.id,
        location: report.location,
        description: report.description,
        reportDate: report.reportDate,
        resolved: report.resolved,
        severity: report.severity,
        status: report.resolved ? 'resolved' : 'reported'
      })) || [];
      setReports(convertedReports);
    }
  }, [waterData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchWaterData();
      setWaterData(data);
      toast({
        title: "Water data updated",
        description: `Current water quality: ${data.qualityData.status}`
      });
    } catch (error) {
      console.error("Failed to fetch water data:", error);
      toast({
        title: "Error updating data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = (report: LeakReport) => {
    const updatedReports = [...reports, report];
    setReports(updatedReports);
    
    if (waterData) {
      const waterLeakReports: WaterLeakReport[] = updatedReports.map(r => ({
        id: r.id,
        location: r.location,
        description: r.description,
        reportDate: r.reportDate,
        resolved: r.resolved || false,
        severity: r.severity
      }));
      
      setWaterData({
        ...waterData,
        leakReports: waterLeakReports
      });
    }
  };

  const waterQualityIndicators = waterData?.qualityData?.indicators || [
    { name: 'pH Level', value: waterData?.qualityData.ph || 0, status: waterData?.qualityData.status || 'unknown' },
    { name: 'Turbidity', value: waterData?.qualityData.turbidity || 0, status: waterData?.qualityData.status || 'unknown' },
    { name: 'TDS', value: waterData?.qualityData.tds || 0, status: waterData?.qualityData.status || 'unknown' },
    { name: 'Chlorine', value: waterData?.qualityData.chlorine || 0, status: waterData?.qualityData.status || 'unknown' }
  ];
  
  const leakFixRate = waterData?.leakFixRate || (waterData ? 
    (waterData.villageStats.leaksFixed / Math.max(1, waterData.villageStats.leaksReported) * 100) : 0);
    
  const purificationEfficiency = waterData?.purificationEfficiency || 85.5;
  
  const convertToPurificationGuides = (methods: WaterPurificationMethod[] | undefined): PurificationGuide[] => {
    if (!methods) return [];
    return methods.map(method => ({
      id: method.id,
      method: method.name,
      description: method.description,
      steps: method.steps,
      effectiveness: method.difficulty,
      difficulty: method.difficulty,
      materials: method.resourcesNeeded
    }));
  };
  
  const purificationGuides = convertToPurificationGuides(waterData?.purificationMethods);
  
  const toggleFeature = (title: string) => {
    setActiveFeature(activeFeature === title ? null : title);
  };
  
  const renderFeatureContent = (title: string) => {
    switch(title) {
      case 'Water Quality Monitoring':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Water Quality Monitoring</CardTitle>
              <CardDescription>Real-time monitoring of water parameters</CardDescription>
            </CardHeader>
            <CardContent>
              {waterData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">pH Level</p>
                    <p className="text-2xl font-bold mt-2">{waterData.qualityData.ph}</p>
                    <p className="text-xs mt-1">
                      {waterData.qualityData.ph < 7 ? 'Acidic' : 
                       waterData.qualityData.ph > 7 ? 'Alkaline' : 'Neutral'}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Turbidity</p>
                    <p className="text-2xl font-bold mt-2">{waterData.qualityData.turbidity} NTU</p>
                    <p className="text-xs mt-1">
                      {waterData.qualityData.turbidity < 5 ? 'Excellent' : 
                       waterData.qualityData.turbidity < 10 ? 'Good' : 'Poor'}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">TDS</p>
                    <p className="text-2xl font-bold mt-2">{waterData.qualityData.tds} ppm</p>
                    <p className="text-xs mt-1">
                      {waterData.qualityData.tds < 300 ? 'Excellent' : 
                       waterData.qualityData.tds < 600 ? 'Good' : 'Poor'}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Chlorine</p>
                    <p className="text-2xl font-bold mt-2">{waterData.qualityData.chlorine} mg/L</p>
                    <p className="text-xs mt-1">
                      {waterData.qualityData.chlorine < 2 ? 'Safe' : 'High'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'Community Reporting':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Community Reporting</CardTitle>
              <CardDescription>Report water issues in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <LeakReporting 
                reports={reports}
                onAddReport={handleAddReport}
              />
            </CardContent>
          </Card>
        );
      case 'Water Conservation Tips':
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Water Conservation Tips</CardTitle>
              <CardDescription>Simple ways to save water daily</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex gap-3">
                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 dark:text-blue-300 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Fix Leaky Taps</h4>
                    <p className="text-sm text-muted-foreground">A single dripping tap can waste 20 gallons of water per day.</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex gap-3">
                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 dark:text-blue-300 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Shorter Showers</h4>
                    <p className="text-sm text-muted-foreground">Reducing shower time by 2 minutes saves up to 10 gallons.</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex gap-3">
                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 dark:text-blue-300 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Full Loads Only</h4>
                    <p className="text-sm text-muted-foreground">Only run washing machines and dishwashers with full loads.</p>
                  </div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-5 w-5" /> Back to Dashboard
        </Link>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          {loading ? 
            <AnimatedIcon icon={<RefreshCw className="h-4 w-4" />} color="primary" size="sm" /> : 
            <RefreshCw className="h-4 w-4 mr-2" />
          }
          {loading ? 'Updating...' : 'Update Data'}
        </Button>
      </div>

      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>Water Quality</CardTitle>
          <CardDescription>Current water quality indicators.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Village Stats</h3>
              <p>Access to Clean Water: {waterData?.villageStats.accessToCleanWater}%</p>
              <p>Leaks Reported: {waterData?.villageStats.leaksReported}</p>
              <p>Leaks Fixed: {waterData?.villageStats.leaksFixed}</p>
              <p>Leak Fix Rate: {leakFixRate.toFixed(2)}%</p>
              <p>Purification Efficiency: {purificationEfficiency.toFixed(2)}%</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quality Indicators</h3>
              <ul>
                {waterQualityIndicators.map((indicator, index) => (
                  <li key={index}>
                    {indicator.name}: {indicator.value} - Status: {indicator.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Features</h2>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {module?.features?.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
            className={`glass p-6 rounded-xl border-l-4 border-blue-500 hover-lift cursor-pointer`}
            onClick={() => toggleFeature(feature.title)}
          >
            <div className="flex items-start gap-4">
              <AnimatedIcon
                icon={<feature.icon className="h-5 w-5" />}
                color="primary"
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

      <LeakReporting reports={reports} onAddReport={handleAddReport} />

      <PurificationGuides guides={purificationGuides} />

      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Water Quality Chart</CardTitle>
          <CardDescription>Trends in water quality indicators over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataChart
            type="line"
            data={waterQualityIndicators.map(item => ({
              name: item.name,
              value: item.value
            }))}
            dataKeys={["value"]}
            colors={["#3B82F6"]}
            xAxisKey="name"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WaterModule;
