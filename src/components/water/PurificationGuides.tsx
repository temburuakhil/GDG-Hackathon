
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, ChevronDown, ChevronUp, BookOpen, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';

export interface PurificationGuide {
  id: string;
  title: string;
  method: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  materials: string[];
  timeRequired: string;
}

interface PurificationGuidesProps {
  guides: PurificationGuide[];
}

const PurificationGuides: React.FC<PurificationGuidesProps> = ({ guides }) => {
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleExpand = (id: string) => {
    if (expandedGuideId === id) {
      setExpandedGuideId(null);
    } else {
      setExpandedGuideId(id);
    }
  };
  
  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch(difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return '';
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AnimatedIcon
            icon={<FileText className="h-5 w-5" />}
            color="water"
            size="sm"
          />
          <CardTitle>Purification Guides</CardTitle>
        </div>
        <CardDescription>
          Step-by-step water purification techniques.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purification methods..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {filteredGuides.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No purification guides found.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-water/20 rounded-lg overflow-hidden"
              >
                <div 
                  className="bg-water/10 p-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(guide.id)}
                >
                  <div>
                    <h4 className="text-sm font-medium">{guide.title}</h4>
                    <p className="text-xs text-muted-foreground">{guide.method}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                    <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                      {expandedGuideId === guide.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {expandedGuideId === guide.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3"
                  >
                    <div className="mb-3">
                      <h5 className="text-xs font-medium mb-1">Materials Needed:</h5>
                      <ul className="list-disc pl-5 text-xs text-muted-foreground">
                        {guide.materials.map((material, i) => (
                          <li key={i}>{material}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-2">
                      <h5 className="text-xs font-medium mb-1">Time Required: <span className="font-normal">{guide.timeRequired}</span></h5>
                    </div>
                    
                    <div>
                      <h5 className="text-xs font-medium mb-1">Steps:</h5>
                      <ol className="list-decimal pl-5 text-xs space-y-2">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="pb-1 border-b border-gray-100">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex justify-center">
          <Button variant="outline" size="sm" className="text-xs text-water">
            <BookOpen className="h-3 w-3 mr-1" />
            Access Full Library
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PurificationGuides;
