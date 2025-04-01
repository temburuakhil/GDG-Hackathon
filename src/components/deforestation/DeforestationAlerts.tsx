import React, { useEffect, useState } from 'react';
import { AlertCircle, MapPin, Clock, Activity, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { deforestationService, DeforestationAlert } from '@/services/deforestationService';
import { motion, AnimatePresence } from 'framer-motion';

export const DeforestationAlerts = () => {
  const [alerts, setAlerts] = useState<DeforestationAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<DeforestationAlert | null>(null);

  useEffect(() => {
    // Initial load
    deforestationService.getAlerts().then(setAlerts);

    // Subscribe to real-time updates
    const unsubscribe = deforestationService.subscribe(setAlerts);

    return () => unsubscribe();
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold">Deforestation Alerts</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          Real-time Updates
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                    selectedAlert?.id === alert.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">{alert.location.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={deforestationService.getSeverityColor(alert.severity)}
                        >
                          {alert.severity}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={deforestationService.getStatusColor(alert.status)}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTimeAgo(alert.timestamp)}
                        </div>
                        <div>
                          Area: {alert.area} hectares
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-medium">{alert.confidence}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {selectedAlert ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Alert Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAlert(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlert.location.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Coordinates: {selectedAlert.location.coordinates.lat.toFixed(4)}, {selectedAlert.location.coordinates.lng.toFixed(4)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Affected Species</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlert.affectedSpecies?.map((species) => (
                      <Badge key={species} variant="secondary">
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Action Required</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlert.actionRequired}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Confidence Level</h4>
                  <Progress value={selectedAlert.confidence} className="h-2" />
                </div>

                {selectedAlert.satelliteImage && (
                  <div>
                    <h4 className="font-medium mb-2">Satellite Image</h4>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={selectedAlert.satelliteImage}
                        alt="Satellite view"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ChevronRight className="h-8 w-8 mx-auto mb-2" />
                <p>Select an alert to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 