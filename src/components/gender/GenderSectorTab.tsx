
import React from 'react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DataChart from '@/components/ui/DataChart';
import { GenderData } from '@/types/gender';

interface GenderSectorTabProps {
  genderData: GenderData | null;
}

const GenderSectorTab: React.FC<GenderSectorTabProps> = ({ genderData }) => {
  // Transform sector distribution data for charts
  const sectorChart = genderData?.sectorDistribution?.map(item => ({
    name: item.sector,
    male: item.malePercentage,
    female: item.femalePercentage
  })) || [];
  
  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<TrendingUp className="h-5 w-5" />}
              color="gender"
              size="sm"
            />
            <CardTitle>Sector Distribution</CardTitle>
          </div>
          <CardDescription>
            Gender distribution across different employment sectors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {genderData?.sectorDistribution && genderData.sectorDistribution.length > 0 ? (
            <div className="space-y-6">
              <div className="h-60">
                <DataChart 
                  type="bar" 
                  data={sectorChart}
                  dataKeys={["male", "female"]}
                  colors={["#3B82F6", "#EC4899"]}
                  xAxisKey="name"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Sector Analysis</h4>
                {genderData.sectorDistribution.map((sector, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gender/5 border border-gender/20">
                    <h5 className="text-sm font-medium">{sector.sector}</h5>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Male</span>
                          <span className="text-xs">{sector.malePercentage}%</span>
                        </div>
                        <Progress value={sector.malePercentage} className="h-1.5 bg-muted" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Female</span>
                          <span className="text-xs">{sector.femalePercentage}%</span>
                        </div>
                        <Progress value={sector.femalePercentage} className="h-1.5 bg-muted" />
                      </div>
                    </div>
                    {sector.insights && (
                      <p className="text-xs text-muted-foreground mt-2">{sector.insights}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <TrendingUp className="h-10 w-10 text-gender/30 mb-3" />
              <p className="text-muted-foreground">No sector distribution data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenderSectorTab;
