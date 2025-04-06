
import React from 'react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Briefcase, Award } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenderData } from '@/types/gender';
import { Users } from 'lucide-react';

interface GenderOverviewTabProps {
  genderData: GenderData | null;
}

const GenderOverviewTab: React.FC<GenderOverviewTabProps> = ({ genderData }) => {
  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Briefcase className="h-5 w-5" />}
              color="gender"
              size="sm"
            />
            <CardTitle>Employment Ratio</CardTitle>
          </div>
          <CardDescription>
            Gender distribution in employment across sectors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {genderData && genderData.employmentRatio ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Male Employment</span>
                    <span className="text-sm">{genderData.employmentRatio.male}%</span>
                  </div>
                  <Progress value={genderData.employmentRatio.male} className="h-2 bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Female Employment</span>
                    <span className="text-sm">{genderData.employmentRatio.female}%</span>
                  </div>
                  <Progress value={genderData.employmentRatio.female} className="h-2 bg-muted" />
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gender/5 border border-gender/20">
                <h4 className="text-sm font-medium mb-2">Employment Gap Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Current employment gap between genders is <span className="font-medium">{genderData.employmentRatio.gap}%</span>. 
                  {genderData.employmentRatio.trend === 'decreasing' 
                    ? ' This gap has been decreasing over the past year.'
                    : genderData.employmentRatio.trend === 'increasing'
                      ? ' This gap has been increasing over the past year.'
                      : ' This gap has remained stable over the past year.'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Wage Gap</h4>
                <p className="text-sm text-muted-foreground">
                  Women earn on average <span className="font-medium">{genderData.wageGap}%</span> less than men for similar roles.
                </p>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gender h-full" 
                    style={{ width: `${100 - genderData.wageGap}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Users className="h-10 w-10 text-gender/30 mb-3" />
              <p className="text-muted-foreground">No employment data available</p>
              <p className="text-xs text-muted-foreground mt-1">Refresh to load data</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<Award className="h-5 w-5" />}
              color="gender"
              size="sm"
            />
            <CardTitle>Leadership Positions</CardTitle>
          </div>
          <CardDescription>
            Gender distribution in leadership and management roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {genderData && genderData.leadershipPositions ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium">Leadership</span>
                  </div>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#e2e8f0" 
                      strokeWidth="15" 
                    />
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="15" 
                      strokeDasharray={`${genderData.leadershipPositions.female * 2.51} ${251 - (genderData.leadershipPositions.female * 2.51)}`}
                      strokeDashoffset="62.75"
                      className="text-gender"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-gender"></span>
                    <span className="text-sm">Female: {genderData.leadershipPositions.female}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-muted"></span>
                    <span className="text-sm">Male: {genderData.leadershipPositions.male}%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gender/5 border border-gender/20">
                <h4 className="text-sm font-medium mb-2">Leadership Gap Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {genderData.leadershipPositions.female < 30 
                    ? 'Women are significantly underrepresented in leadership positions.'
                    : genderData.leadershipPositions.female < 45
                      ? 'Women are still underrepresented in leadership positions, but the gap is narrowing.'
                      : 'Leadership positions are approaching gender parity.'}
                </p>
                {genderData.leadershipPositions.initiatives && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium">Current Initiatives:</h5>
                    <ul className="mt-1 space-y-1">
                      {genderData.leadershipPositions.initiatives.map((initiative, index) => (
                        <li key={index} className="text-xs flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-gender"></span>
                          {initiative}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <Award className="h-10 w-10 text-gender/30 mb-3" />
              <p className="text-muted-foreground">No leadership data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenderOverviewTab;
