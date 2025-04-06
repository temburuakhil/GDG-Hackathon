
import React from 'react';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { GraduationCap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GenderData } from '@/types/gender';

interface GenderTrainingTabProps {
  genderData: GenderData | null;
}

const GenderTrainingTab: React.FC<GenderTrainingTabProps> = ({ genderData }) => {
  return (
    <div className="space-y-6">
      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AnimatedIcon
              icon={<GraduationCap className="h-5 w-5" />}
              color="gender"
              size="sm"
            />
            <CardTitle>Skill Training Programs</CardTitle>
          </div>
          <CardDescription>
            Gender participation in skill development initiatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          {genderData?.skillTraining ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Male Participation</span>
                    <span className="text-sm">{genderData.skillTraining.maleParticipation}%</span>
                  </div>
                  <Progress value={genderData.skillTraining.maleParticipation} className="h-2 bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Female Participation</span>
                    <span className="text-sm">{genderData.skillTraining.femaleParticipation}%</span>
                  </div>
                  <Progress value={genderData.skillTraining.femaleParticipation} className="h-2 bg-muted" />
                </div>
              </div>
              
              {genderData.skillTraining.programs && genderData.skillTraining.programs.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Available Training Programs</h4>
                  {genderData.skillTraining.programs.map((program, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gender/5 border border-gender/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-medium">{program.name}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{program.description}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          program.targetGender === 'female' 
                            ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' 
                            : program.targetGender === 'male'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                          {program.targetGender === 'female' 
                            ? 'Women Only' 
                            : program.targetGender === 'male'
                              ? 'Men Only'
                              : 'All Genders'}
                        </span>
                      </div>
                      {program.enrollmentStatus && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${
                            program.enrollmentStatus === 'open' ? 'bg-green-500' : 'bg-amber-500'
                          }`}></span>
                          <span className="text-xs">
                            {program.enrollmentStatus === 'open' ? 'Enrollment Open' : 'Coming Soon'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {genderData.skillTraining.recommendations && (
                <div className="p-4 rounded-lg bg-gender/5 border border-gender/20">
                  <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {genderData.skillTraining.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gender"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <GraduationCap className="h-10 w-10 text-gender/30 mb-3" />
              <p className="text-muted-foreground">No skill training data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenderTrainingTab;
