
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Upload, MapPin, Trash2, ImageIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';

export interface WaterLeakReport {
  id: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  hasPhoto: boolean;
  dateReported: string;
  status: 'pending' | 'investigating' | 'resolved';
}

interface LeakReportingProps {
  reports: WaterLeakReport[];
  onAddReport: (report: WaterLeakReport) => void;
  onDeleteReport: (id: string) => void;
}

const LeakReporting: React.FC<LeakReportingProps> = ({ reports, onAddReport, onDeleteReport }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      location: '',
      description: '',
      severity: 'medium' as 'low' | 'medium' | 'high'
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: { location: string; description: string; severity: 'low' | 'medium' | 'high' }) => {
    const newReport: WaterLeakReport = {
      id: Date.now().toString(),
      location: data.location,
      description: data.description,
      severity: data.severity,
      hasPhoto: !!imagePreview,
      dateReported: new Date().toISOString(),
      status: 'pending'
    };
    
    onAddReport(newReport);
    toast({
      title: "Report submitted",
      description: "Your water leak report has been received."
    });
    
    // Reset the form
    form.reset();
    setImagePreview(null);
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch(severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };
  
  const getStatusBadge = (status: 'pending' | 'investigating' | 'resolved') => {
    switch(status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AnimatedIcon
            icon={<Upload className="h-5 w-5" />}
            color="water"
            size="sm"
          />
          <CardTitle>Leak Reporting</CardTitle>
        </div>
        <CardDescription>
          Report water leaks with photos for quick resolution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Enter location details" {...field} required />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the water leak" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="low">Low - Slow drip</option>
                      <option value="medium">Medium - Steady flow</option>
                      <option value="high">High - Major leak</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel htmlFor="photo">Photo (optional)</FormLabel>
              <div className="mt-1 border-2 border-dashed border-water/30 rounded-md p-4 text-center">
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto h-32 object-cover rounded-md" 
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={() => setImagePreview(null)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="photo" className="cursor-pointer block">
                    <ImageIcon className="mx-auto h-8 w-8 text-water/60 mb-2" />
                    <p className="text-sm text-muted-foreground">Click to add a photo</p>
                  </label>
                )}
              </div>
            </div>
            
            <Button type="submit" className="bg-water text-white hover:bg-water/90 w-full">
              Submit Report
            </Button>
          </form>
        </Form>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Recent Reports ({reports.length})</h4>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reports yet. Be the first to report a water leak.</p>
            ) : (
              reports.map((report, index) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-water/5 rounded-md p-3 flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{report.location}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>
                        {new Date(report.dateReported).toLocaleDateString()} - 
                        {report.hasPhoto ? ' Photo attached' : ' No photo'}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteReport(report.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeakReporting;
