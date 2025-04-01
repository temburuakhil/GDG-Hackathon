import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules, type ModuleFeature } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CloudSun, 
  Zap, 
  Car, 
  Trash2, 
  Droplets, 
  Utensils,
  LineChart,
  AlertCircle,
  Thermometer,
  Umbrella,
  Wind,
  Activity,
  Calendar,
  TrendingUp,
  Info,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { carbonService, type CarbonInput, type CarbonSummary } from '@/services/carbonService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { climateService, type ClimateData, type HistoricalTrend } from '@/services/climateService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { climateImpactService, type ImpactSummary } from '@/services/climateImpactService';
import { sustainableService, type Practice, type Category } from '@/services/sustainableService';

const CarbonFootprint = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [summary, setSummary] = useState<CarbonSummary | null>(null);
  const [input, setInput] = useState<CarbonInput>({
    electricity: { monthlyUsage: 0 },
    transportation: { carDistance: 0, publicTransitDistance: 0 },
    waste: { monthlyWaste: 0, recyclingPercentage: 0 },
    water: { monthlyUsage: 0 },
    food: { meatConsumption: 'medium', localFoodPercentage: 0 }
  });

  // Sample data for a typical household
  const sampleInput: CarbonInput = {
    electricity: { monthlyUsage: 250 }, // 250 kWh per month
    transportation: {
      carDistance: 800, // 800 km per month
      publicTransitDistance: 100 // 100 km per month
    },
    waste: {
      monthlyWaste: 40, // 40 kg per month
      recyclingPercentage: 30 // 30% recycling rate
    },
    water: { monthlyUsage: 4000 }, // 4000 liters per month
    food: {
      meatConsumption: 'medium', // 2-3 times per week
      localFoodPercentage: 20 // 20% local food
    }
  };

  const handleLoadSample = () => {
    setInput(sampleInput);
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const result = await carbonService.calculateFootprint(input);
      setSummary(result);
    } catch (error) {
      console.error('Error calculating footprint:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const updateInput = (category: keyof CarbonInput, field: string, value: any) => {
    setInput(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carbon Footprint Calculator</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadSample}
              className="text-sm"
            >
              Load Sample Data
            </Button>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <h4 className="font-medium mb-2">Sample Values Guide</h4>
              <ul className="text-sm space-y-1">
                <li>• Electricity: Average household uses 200-300 kWh/month</li>
                <li>• Car Travel: Typical commuter drives 600-1000 km/month</li>
                <li>• Waste: Average household produces 30-50 kg/month</li>
                <li>• Water: Typical usage is 3000-5000 liters/month</li>
                <li>• Food: Consider your meat consumption frequency and local food choices</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Electricity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <h3 className="font-medium">Electricity Usage</h3>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Monthly Electricity Usage (kWh)</Label>
                <Input
                  type="number"
                  placeholder="Enter monthly usage"
                  value={input.electricity.monthlyUsage}
                  onChange={(e) => updateInput('electricity', 'monthlyUsage', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Transportation Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              <h3 className="font-medium">Transportation</h3>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Monthly Car Distance (km)</Label>
                <Input
                  type="number"
                  placeholder="Enter distance"
                  value={input.transportation.carDistance}
                  onChange={(e) => updateInput('transportation', 'carDistance', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Public Transit Distance (km)</Label>
                <Input
                  type="number"
                  placeholder="Enter distance"
                  value={input.transportation.publicTransitDistance}
                  onChange={(e) => updateInput('transportation', 'publicTransitDistance', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Waste Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              <h3 className="font-medium">Waste Management</h3>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Monthly Waste (kg)</Label>
                <Input
                  type="number"
                  placeholder="Enter waste amount"
                  value={input.waste.monthlyWaste}
                  onChange={(e) => updateInput('waste', 'monthlyWaste', Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Recycling Percentage (%)</Label>
                <Slider
                  value={[input.waste.recyclingPercentage]}
                  onValueChange={([value]) => updateInput('waste', 'recyclingPercentage', value)}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          {/* Water Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <h3 className="font-medium">Water Consumption</h3>
            </div>
            <div className="space-y-2">
              <Label>Monthly Water Usage (liters)</Label>
              <Input
                type="number"
                placeholder="Enter water usage"
                value={input.water.monthlyUsage}
                onChange={(e) => updateInput('water', 'monthlyUsage', Number(e.target.value))}
              />
            </div>
          </div>

          {/* Food Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              <h3 className="font-medium">Food Habits</h3>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Meat Consumption Level</Label>
                <Select
                  value={input.food.meatConsumption}
                  onValueChange={(value: any) => updateInput('food', 'meatConsumption', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (Daily)</SelectItem>
                    <SelectItem value="medium">Medium (2-3 times/week)</SelectItem>
                    <SelectItem value="low">Low (Once/week)</SelectItem>
                    <SelectItem value="none">None (Vegetarian/Vegan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Local Food Percentage (%)</Label>
                <Slider
                  value={[input.food.localFoodPercentage]}
                  onValueChange={([value]) => updateInput('food', 'localFoodPercentage', value)}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            className="w-full"
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Footprint'}
          </Button>

          {/* Results Section */}
          {summary ? (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Carbon Footprint Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{summary.totalEmissions.toFixed(1)} kg CO2</h3>
                  <p className="text-sm text-muted-foreground">Monthly Carbon Footprint</p>
                </div>

                <div className="space-y-2">
                  <Label>Comparison to Average</Label>
                  <div className="space-y-1">
                    <Progress value={50 + summary.comparisonToAverage} />
                    <p className="text-sm text-muted-foreground text-center">
                      {summary.comparisonToAverage > 0 
                        ? `${summary.comparisonToAverage.toFixed(1)}% higher than average`
                        : `${Math.abs(summary.comparisonToAverage).toFixed(1)}% lower than average`
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Breakdown by Category</h4>
                  {Object.entries(summary.breakdownByType).map(([type, value]) => (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{type}</span>
                        <span>{value.toFixed(1)} kg CO2</span>
                      </div>
                      <Progress value={(value / summary.totalEmissions) * 100} />
                    </div>
                  ))}
                </div>

                {summary.reductionTips.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <h4 className="font-medium mb-2">Reduction Tips</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.reductionTips.map((tip, index) => (
                          <li key={index} className="text-sm">{tip}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 border rounded-lg mt-6">
              <LineChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No Results Yet</h3>
              <p className="text-muted-foreground">Fill out the calculator and click Calculate to see your carbon footprint</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClimateInsights = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [historicalTrends, setHistoricalTrends] = useState<HistoricalTrend[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, trends] = await Promise.all([
          climateService.getClimateData(),
          climateService.getHistoricalTrends()
        ]);
        setClimateData(data);
        setHistoricalTrends(trends);
      } catch (error) {
        console.error('Error fetching climate data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading climate insights...</p>
        </div>
      </div>
    );
  }

  if (!climateData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Unable to Load Data</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Features
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateData.temperature.current}°C</div>
            <p className="text-xs text-muted-foreground mt-1">
              Range: {climateData.temperature.min}°C - {climateData.temperature.max}°C
            </p>
            <div className="mt-2 text-xs">
              <span className={climateData.temperature.trend > 0 ? "text-red-500" : "text-blue-500"}>
                {climateService.getTemperatureTrendAnalysis(climateData.temperature.trend)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rainfall Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Umbrella className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-medium">Rainfall</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateData.rainfall.monthly}mm</div>
            <p className="text-xs text-muted-foreground mt-1">
              Annual: {climateData.rainfall.annual}mm
            </p>
            <div className="mt-2 text-xs">
              Pattern: {climateData.rainfall.seasonalPattern}
            </div>
          </CardContent>
        </Card>

        {/* Humidity Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-teal-500" />
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateData.humidity.average}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Morning: {climateData.humidity.morning}% | Evening: {climateData.humidity.evening}%
            </p>
          </CardContent>
        </Card>

        {/* Air Quality Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{climateData.airQuality.index}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Status: {climateData.airQuality.status}
            </p>
            <div className="mt-2 text-xs">
              Main Pollutant: {climateData.airQuality.mainPollutant}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <CardTitle>Historical Trends</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {/* Add your preferred charting library here */}
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Temperature trend visualization will appear here
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Changes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <CardTitle>Seasonal Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {climateData.seasonalChanges.map((season, index) => (
              <div key={season.season} className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <span>{season.season}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Characteristics</h5>
                    <ul className="text-sm space-y-1">
                      {season.characteristics.map((char, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Info className="h-3 w-3" />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Recommendations</h5>
                    <ul className="text-sm space-y-1">
                      {season.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Info className="h-3 w-3" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ClimateImpact = ({ onBack }: { onBack: () => void }) => {
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState<ImpactSummary | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await climateImpactService.getImpactData();
        setImpactData(data);
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading climate impact data...</p>
        </div>
      </div>
    );
  }

  if (!impactData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Unable to Load Data</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Features
        </Button>
      </div>

      {/* Overall Impact Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <CardTitle>Overall Climate Impact</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{impactData.totalScore}</div>
            <div className="text-sm text-muted-foreground mb-4">
              {climateImpactService.getImpactStatus(impactData.totalScore)}
            </div>
            <div className="flex items-center justify-center gap-2">
              {getTrendIcon(impactData.overallTrend)}
              <span className="text-sm">
                {climateImpactService.getTrendAnalysis(impactData.overallTrend)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {impactData.categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{category.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Impact Score</span>
                  <span className="text-sm font-medium">{category.impactScore}</span>
                </div>
                <Progress value={category.impactScore} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getTrendIcon(category.trend)}
                  <span className="text-sm">
                    {climateImpactService.getTrendAnalysis(category.trend)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Metrics</h4>
                <div className="space-y-1">
                  {category.dataPoints.map((point, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{point.label}</span>
                      <span>{point.value} {point.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations</h4>
                <ul className="text-sm space-y-1">
                  {category.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="h-3 w-3 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Top Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactData.topRecommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SustainablePractices = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  console.log('SustainablePractices component rendering'); // Debug log
  
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('SustainablePractices useEffect running'); // Debug log
    const fetchData = async () => {
      try {
        const [categoriesData, practicesData] = await Promise.all([
          sustainableService.getCategories(),
          sustainableService.getPractices()
        ]);
        console.log('Data fetched:', { categoriesData, practicesData }); // Debug log
        setCategories(categoriesData);
        setPractices(practicesData);
      } catch (error) {
        console.error('Error fetching sustainable practices data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPractices = practices.filter(practice => {
    const matchesCategory = !selectedCategory || practice.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      practice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      practice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading sustainable practices...</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sustainable Practices</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {selectedPractice ? (
            <div className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPractice(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Practices
              </Button>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedPractice.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPractice.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${sustainableService.getDifficultyColor(selectedPractice.difficulty)}`}>
                        {selectedPractice.difficulty.charAt(0).toUpperCase() + selectedPractice.difficulty.slice(1)}
                      </span>
                      <span className={`text-sm ${sustainableService.getImpactColor(selectedPractice.impact)}`}>
                        {selectedPractice.impact.charAt(0).toUpperCase() + selectedPractice.impact.slice(1)} Impact
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Steps */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Implementation Steps</h3>
                    <div className="space-y-3">
                      {selectedPractice.steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Benefits</h3>
                    <ul className="space-y-2">
                      {selectedPractice.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                          <span className="text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Savings Estimate */}
                  {selectedPractice.savingsEstimate && (
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Potential Savings</h3>
                      <p className="text-sm">
                        Save up to {selectedPractice.savingsEstimate.amount} {selectedPractice.savingsEstimate.unit} {selectedPractice.savingsEstimate.period}
                      </p>
                    </div>
                  )}

                  {/* Resources */}
                  {selectedPractice.resources.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium">Additional Resources</h3>
                      <div className="space-y-2">
                        {selectedPractice.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {resource.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search practices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={selectedCategory || ''}
                  onValueChange={(value) => setSelectedCategory(value || null)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Practices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPractices.map((practice) => (
                  <Card
                    key={practice.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedPractice(practice)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{practice.title}</CardTitle>
                        <span className={`text-xs ${sustainableService.getImpactColor(practice.impact)}`}>
                          {practice.impact.charAt(0).toUpperCase() + practice.impact.slice(1)} Impact
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{practice.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${sustainableService.getDifficultyColor(practice.difficulty)}`}>
                          {practice.difficulty.charAt(0).toUpperCase() + practice.difficulty.slice(1)}
                        </span>
                        {practice.savingsEstimate && (
                          <span className="text-xs text-muted-foreground">
                            Save {practice.savingsEstimate.amount} {practice.savingsEstimate.unit}/{practice.savingsEstimate.period}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ClimateModule = () => {
  const module = modules.find(m => m.id === 'climate')!;
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [carbonFootprintOpen, setCarbonFootprintOpen] = useState(false);
  const [sustainablePracticesOpen, setSustainablePracticesOpen] = useState(false);
  
  console.log('Current selected feature:', selectedFeature); // Debug log

  const handleFeatureClick = (feature: ModuleFeature) => {
    console.log('Feature clicked:', feature.title); // Debug log
    if (feature.title === 'Carbon Footprint') {
      setCarbonFootprintOpen(true);
    } else if (feature.title === 'Sustainable Practices') {
      setSustainablePracticesOpen(true);
    } else {
      console.log('Setting selected feature to:', feature.title); // Debug log
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
      
      {!selectedFeature && (
        <>
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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Weather Forecast</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Clear skies today with a high of 32°C. No precipitation expected.
                </p>
              </div>
              
              <div className={`h-40 w-full md:w-1/2 flex items-center justify-center bg-${module.color}/5 rounded-lg border border-${module.color}/20`}>
                <CloudSun className={`h-6 w-6 text-${module.color} opacity-60`} />
                <p className="text-sm text-muted-foreground ml-2">Weather forecast will appear here</p>
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
              Weather data updated when online. Last sync: Today, 09:15 AM
            </p>
          </motion.div>
        </>
      )}

      <CarbonFootprint 
        open={carbonFootprintOpen} 
        onOpenChange={setCarbonFootprintOpen} 
      />

      <SustainablePractices
        open={sustainablePracticesOpen}
        onOpenChange={setSustainablePracticesOpen}
      />

      {selectedFeature === 'Climate Insights' && (
        <ClimateInsights onBack={() => setSelectedFeature(null)} />
      )}

      {selectedFeature === 'Climate Impact' && (
        <ClimateImpact onBack={() => setSelectedFeature(null)} />
      )}
    </AppLayout>
  );
};

export default ClimateModule;
