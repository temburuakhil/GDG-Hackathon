import React, { useState } from 'react';
import { MapPin, Activity, Layers, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ResourceLocation {
  id: string;
  name: string;
  type: 'forest' | 'water' | 'agriculture' | 'mineral';
  status: 'abundant' | 'moderate' | 'scarce';
  coordinates: {
    lat: number;
    lng: number;
  };
  area: number;
  description: string;
  lastUpdated: Date;
}

const mockLocations: ResourceLocation[] = [
  {
    id: '1',
    name: 'Koraput Forest Reserve',
    type: 'forest',
    status: 'abundant',
    coordinates: { lat: 18.8156, lng: 82.7117 },
    area: 450.5,
    description: 'Dense forest area with diverse flora and fauna',
    lastUpdated: new Date('2024-03-15')
  },
  {
    id: '2',
    name: 'Nayagarh Water Reservoir',
    type: 'water',
    status: 'moderate',
    coordinates: { lat: 20.1287, lng: 85.0988 },
    area: 125.3,
    description: 'Major water source for irrigation and drinking',
    lastUpdated: new Date('2024-03-14')
  },
  {
    id: '3',
    name: 'Sustainable Agriculture Zone',
    type: 'agriculture',
    status: 'abundant',
    coordinates: { lat: 19.2345, lng: 83.4567 },
    area: 780.2,
    description: 'Organic farming area with crop rotation',
    lastUpdated: new Date('2024-03-15')
  },
  {
    id: '4',
    name: 'Mineral Resource Site',
    type: 'mineral',
    status: 'scarce',
    coordinates: { lat: 19.8765, lng: 84.3456 },
    area: 65.8,
    description: 'Protected mineral deposit area',
    lastUpdated: new Date('2024-03-13')
  }
];

export const ResourceMaps = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ResourceLocation | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abundant':
        return 'text-green-500 bg-green-500/10';
      case 'moderate':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'scarce':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'forest':
        return '🌳';
      case 'water':
        return '💧';
      case 'agriculture':
        return '🌾';
      case 'mineral':
        return '⛰️';
      default:
        return '📍';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const filteredLocations = selectedType
    ? mockLocations.filter(loc => loc.type === selectedType)
    : mockLocations;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-semibold">Resource Maps</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-4 w-4" />
          Real-time Updates
        </Badge>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['forest', 'water', 'agriculture', 'mineral'].map(type => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type === selectedType ? null : type)}
            className="flex items-center gap-2"
          >
            <span>{getTypeIcon(type)}</span>
            <span className="capitalize">{type}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {filteredLocations.map((location) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedLocation?.id === location.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedLocation(location)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(location.type)}</span>
                      <CardTitle className="text-base">{location.name}</CardTitle>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(location.status)}
                    >
                      {location.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{location.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                    <span className="text-muted-foreground">
                      Area: {location.area.toFixed(2)} ha
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div>
          {selectedLocation ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(selectedLocation.type)}</span>
                    {selectedLocation.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLocation(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Location Details</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Coordinates</span>
                      <span>{selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lng.toFixed(4)}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Area</span>
                      <span>{selectedLocation.area.toFixed(2)} hectares</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline" className={getStatusColor(selectedLocation.status)}>
                        {selectedLocation.status}
                      </Badge>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span>{formatDate(selectedLocation.lastUpdated)}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedLocation.description}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Interactive map view coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p>Select a location to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}; 