import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import predictionService, { PredictionInput, PredictionResult, DiseaseRisk } from '@/services/predictionService';

export default function PredictionForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiseaseRisk[]>([]);
  const [formData, setFormData] = useState<PredictionInput>({
    age: 0,
    gender: 'male',
    bmi: 0,
    bloodPressure: '',
    cholesterol: 0,
    smoking: 'none',
    diabetes: 'no',
    alcohol: 'none'
  });

  const handleInputChange = (field: keyof PredictionInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (formData.age <= 0 || formData.age > 120) {
        throw new Error('Age must be between 1 and 120');
      }
      if (formData.bmi <= 0 || formData.bmi > 100) {
        throw new Error('BMI must be between 0 and 100');
      }
      if (!formData.bloodPressure.match(/^\d+$/)) {
        throw new Error('Blood pressure must be a valid number');
      }
      const bp = parseInt(formData.bloodPressure.split('/')[0]);
      if (bp <= 0 || bp > 300) {
        throw new Error('Blood pressure must be between 1 and 300');
      }
      if (formData.cholesterol <= 0 || formData.cholesterol > 1000) {
        throw new Error('Cholesterol must be between 1 and 1000');
      }

      // First check if prediction server is running
      const isServerReady = await predictionService.checkServerStatus();
      
      if (!isServerReady) {
        toast({
          title: 'Starting Prediction Service',
          description: 'Please wait while we initialize the service...',
          duration: 5000,
        });

        await predictionService.startPredictionServer();
      }

      const result = await predictionService.predict(formData);
      setResults(result.risks);
      
      toast({
        title: 'Prediction Complete',
        description: 'Your health prediction results are ready.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get prediction results',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Risk Prediction</CardTitle>
          <CardDescription>
            Enter your health information to predict potential health risks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure (e.g., 120/80)</Label>
                <Input
                  id="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cholesterol">Cholesterol Level</Label>
                <Input
                  id="cholesterol"
                  type="number"
                  value={formData.cholesterol}
                  onChange={(e) => handleInputChange('cholesterol', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smoking">Smoking Habits</Label>
                <Select
                  value={formData.smoking}
                  onValueChange={(value) => handleInputChange('smoking', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select smoking habits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diabetes">Diabetes</Label>
                <Select
                  value={formData.diabetes}
                  onValueChange={(value) => handleInputChange('diabetes', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select diabetes status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcohol">Alcohol Consumption</Label>
                <Select
                  value={formData.alcohol}
                  onValueChange={(value) => handleInputChange('alcohol', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alcohol consumption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Predict Health Risks'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Your health risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.map((risk, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{risk.disease}</h3>
                    <span className="text-lg font-bold">{risk.riskPercentage}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold">Preventive Measures</h4>
                      <p>{risk.preventiveMeasures}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Recommended Diet</h4>
                      <p>{risk.diet}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Exercise Recommendations</h4>
                      <p>{risk.exercises}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Suggested Lab Tests</h4>
                      <p>{risk.labTests}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 