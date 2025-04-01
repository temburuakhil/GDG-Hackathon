import React from 'react';
import { Trees, TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ForestData {
  totalArea: number;
  coveredArea: number;
  changeRate: number;
  status: 'stable' | 'increasing' | 'decreasing';
  lastUpdated: string;
  regions: {
    name: string;
    coverage: number;
    change: number;
  }[];
}

const mockForestData: ForestData = {
  totalArea: 12500,
  coveredArea: 8750,
  changeRate: 0.2,
  status: 'stable',
  lastUpdated: '2 days ago',
  regions: [
    { name: 'Koraput North', coverage: 85, change: 0.5 },
    { name: 'Koraput South', coverage: 78, change: -0.3 },
    { name: 'Nayagarh East', coverage: 92, change: 1.2 },
    { name: 'Nayagarh West', coverage: 88, change: 0.1 }
  ]
};

export const ForestCoverStatus = () => {
  const coveragePercentage = (mockForestData.coveredArea / mockForestData.totalArea) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'text-green-500';
      case 'increasing':
        return 'text-emerald-500';
      case 'decreasing':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trees className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Forest Cover Status</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          Real-time Updates
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Overall Coverage</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Forest Area</span>
                    <span>{mockForestData.totalArea.toLocaleString()} hectares</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Covered Area</span>
                    <span>{mockForestData.coveredArea.toLocaleString()} hectares</span>
                  </div>
                  <Progress value={coveragePercentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage</span>
                    <span className="font-medium">{coveragePercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(mockForestData.status)}>
                    {mockForestData.status}
                  </Badge>
                  {mockForestData.changeRate !== 0 && (
                    <span className="text-sm text-muted-foreground">
                      {mockForestData.changeRate > 0 ? '+' : ''}{mockForestData.changeRate}% change
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Regional Distribution</h3>
            <div className="space-y-4">
              {mockForestData.regions.map((region) => (
                <div key={region.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{region.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{region.coverage}%</span>
                      {getChangeIcon(region.change)}
                    </div>
                  </div>
                  <Progress value={region.coverage} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Current Status</h3>
                <p className="text-sm text-muted-foreground">
                  Forest cover in your district is stable with no significant deforestation alerts. 
                  Regular monitoring and conservation efforts are maintaining the forest health.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Last updated: {mockForestData.lastUpdated}
      </div>
    </div>
  );
}; 