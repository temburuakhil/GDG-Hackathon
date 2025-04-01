import React, { useEffect, useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { modules } from '@/lib/moduleData';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { motion } from 'framer-motion';
import { ArrowLeft, HeartPulse, Microscope, Building, AlertCircle, Loader2, CheckCircle2, MapPin, Phone, Clock, Star, Crosshair, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { healthService, HealthStats, HealthAdvisory, HealthcareFacility, SymptomCheckResult } from '@/services/healthService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PredictionForm from '@/components/PredictionForm';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { StethoscopeIcon, MapPinIcon, ActivityIcon } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Add this CSS at the top of the file
const mapStyles = `
  .leaflet-container {
    height: 400px;
    width: 100%;
    border-radius: 0.5rem;
  }
`;

const HealthModule = () => {
  const module = modules.find(m => m.id === 'health')!;
  const { toast } = useToast();
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [advisories, setAdvisories] = useState<HealthAdvisory[]>([]);
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomCheckResult, setSymptomCheckResult] = useState<SymptomCheckResult | null>(null);
  const [isSymptomCheckOpen, setIsSymptomCheckOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isFacilityLocatorOpen, setIsFacilityLocatorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<HealthcareFacility[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showPredictionForm, setShowPredictionForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, advisoriesData, facilitiesData] = await Promise.all([
          healthService.getStats(),
          healthService.getHealthAdvisories(),
          healthService.findHealthcareFacilities('current')
        ]);

        setStats(statsData);
        setAdvisories(advisoriesData);
        setFacilities(facilitiesData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch health data. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [toast]);

  useEffect(() => {
    if (mapRef.current && !map) {
      // Add the styles
      const style = document.createElement('style');
      style.textContent = mapStyles;
      document.head.appendChild(style);

      // Initialize map
      const initialMap = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(initialMap);

      setMap(initialMap);

      // Trigger a resize event after a short delay to ensure proper rendering
      setTimeout(() => {
        initialMap.invalidateSize();
      }, 100);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [mapRef.current]);

  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Fatigue',
    'Sore Throat', 'Nausea', 'Vomiting', 'Diarrhea', 'Chest Pain',
    'Shortness of Breath', 'Dizziness', 'Loss of Appetite', 'Insomnia'
  ];

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSymptomCheck = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: 'No Symptoms Selected',
        description: 'Please select at least one symptom to check.',
        variant: 'destructive'
      });
      return;
    }

    setIsChecking(true);
    try {
      const result = await healthService.checkSymptoms(selectedSymptoms);
      setSymptomCheckResult(result);
      toast({
        title: 'Symptom Check Complete',
        description: `Severity: ${result.severity}. Please review the recommendations.`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform symptom check. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const updateMapMarkers = (facilities: HealthcareFacility[]) => {
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    
    // Create new markers
    const newMarkers = facilities.map(facility => {
      const marker = L.marker([facility.coordinates.lat, facility.coordinates.lng])
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-medium">${facility.name}</h3>
            <p class="text-sm">${facility.type}</p>
            <p class="text-sm mt-1">${facility.address}</p>
            <p class="text-sm mt-1">Rating: ${facility.rating}</p>
          </div>
        `);
      
      if (map) {
        marker.addTo(map);
      }
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    // Fit bounds if there are markers
    if (newMarkers.length > 0 && map) {
      const bounds = L.latLngBounds(newMarkers.map(marker => marker.getLatLng()));
      map.fitBounds(bounds);
    }
  };

  const handleFacilitySearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Search Query Required',
        description: 'Please enter a location to search for healthcare facilities.',
        variant: 'destructive'
      });
      return;
    }

    setSearching(true);
    try {
      // First, try to geocode the search query
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      );
      const geocodeData = await geocodeResponse.json();
      
      let coordinates;
      if (geocodeData && geocodeData[0]) {
        coordinates = {
          lat: parseFloat(geocodeData[0].lat),
          lng: parseFloat(geocodeData[0].lon)
        };
      }

      const results = await healthService.findHealthcareFacilities(searchQuery, coordinates);
      setSearchResults(results);
      updateMapMarkers(results);

      // Center map on search location if coordinates are available
      if (coordinates && map) {
        map.setView([coordinates.lat, coordinates.lng], 13);
      }

      toast({
        title: 'Search Complete',
        description: `Found ${results.length} healthcare facilities near ${searchQuery}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search for healthcare facilities. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive'
      });
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
          );
          const data = await response.json();
          
          // Extract city/town name from the response
          const location = data.address.city || data.address.town || data.address.village || 'Current Location';
          setSearchQuery(location);
          
          // Search for facilities near the location
          const results = await healthService.findHealthcareFacilities(location, coordinates);
          setSearchResults(results);
          updateMapMarkers(results);
          
          // Center map on user's location
          if (map) {
            map.setView([coordinates.lat, coordinates.lng], 13);
            // Add a marker for user's location
            const userMarker = L.marker([coordinates.lat, coordinates.lng], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div class="w-4 h-4 rounded-full bg-blue-500 animate-ping"></div>',
                iconSize: [16, 16]
              })
            }).addTo(map);
            userMarker.bindPopup('Your Location').openPopup();
          }

          toast({
            title: 'Location Found',
            description: `Found ${results.length} healthcare facilities near you`
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to get nearby facilities. Please try again.',
            variant: 'destructive'
          });
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        toast({
          title: 'Error',
          description: error.message || 'Failed to get your location. Please try again.',
          variant: 'destructive'
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Add styles for user location marker
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .user-location-marker {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .user-location-marker > div {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #3b82f6;
        box-shadow: 0 0 0 2px white;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update map when tab changes
  const handleTabChange = (value: string) => {
    if (value === 'map' && map) {
      setTimeout(() => {
        map.invalidateSize();
        // If there are markers, fit bounds
        if (markers.length > 0) {
          const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
          map.fitBounds(bounds);
        }
      }, 100);
    }
  };

  const handleOpenPrediction = () => {
    setShowPredictionForm(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats && Object.entries(stats).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + (index * 0.1), ease: [0.22, 1, 0.36, 1] }}
            className="glass p-6 rounded-xl"
          >
            <h3 className="text-sm text-muted-foreground">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            <p className="text-2xl font-semibold mt-1">{value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Health Crisis Prevention</h2>
        <p className="text-gray-500">Check symptoms, find healthcare services, and access health information.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Health Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.healthChecks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medical Camps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.medicalCamps}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsSymptomCheckOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StethoscopeIcon className="h-5 w-5" />
                Symptom Checker
              </CardTitle>
              <CardDescription>Identify possible health issues with our AI tool.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsFacilityLocatorOpen(true)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Healthcare Locator
              </CardTitle>
              <CardDescription>Find healthcare facilities near you.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleOpenPrediction}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Future Health Prediction
              </CardTitle>
              <CardDescription>Predict potential health risks using AI.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Health Advisories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {advisories.map((advisory) => (
            <Card key={advisory.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 ${
                      advisory.severity === 'high' 
                        ? 'text-red-500' 
                        : advisory.severity === 'medium' 
                        ? 'text-yellow-500' 
                        : 'text-blue-500'
                    }`} />
                    <CardTitle className="text-lg">{advisory.title}</CardTitle>
                  </div>
                  <Badge variant={
                    advisory.severity === 'high' 
                      ? 'destructive' 
                      : advisory.severity === 'medium' 
                      ? 'secondary' 
                      : 'default'
                  }>
                    {advisory.severity.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="mt-2">{advisory.message}</CardDescription>
                {advisory.affectedAreas && advisory.affectedAreas.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Affected Areas:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {advisory.affectedAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {new Date(advisory.timestamp).toLocaleString()}
                </p>
              </CardHeader>
            </Card>
          ))}
          {advisories.length === 0 && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle className="text-lg">No Active Advisories</CardTitle>
                <CardDescription>
                  There are currently no active health advisories in your area. Stay hydrated and maintain good health practices.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 p-4 glass rounded-xl text-center"
      >
        <p className="text-sm text-muted-foreground">
          Health information updated every 30 seconds. Last sync: {new Date().toLocaleTimeString()}
        </p>
      </motion.div>

      <Dialog open={isSymptomCheckOpen} onOpenChange={setIsSymptomCheckOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Symptom Checker</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Select Your Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(symptom => (
                  <Badge
                    key={symptom}
                    variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {symptomCheckResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-5 w-5 text-${symptomCheckResult.severity === 'high' ? 'red' : symptomCheckResult.severity === 'medium' ? 'yellow' : 'green'}`} />
                  <h3 className="font-medium">Analysis Results</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Severity Level:</span>{' '}
                    <span className={`text-${symptomCheckResult.severity === 'high' ? 'red' : symptomCheckResult.severity === 'medium' ? 'yellow' : 'green'}`}>
                      {symptomCheckResult.severity.toUpperCase()}
                    </span>
                  </p>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Possible Conditions:</h4>
                    <ScrollArea className="h-[200px] pr-4">
                      <div className="space-y-3">
                        {symptomCheckResult.possibleConditions.map((condition, index) => (
                          <div key={index} className="p-3 rounded-lg bg-muted/50">
                            <p className="font-medium">{condition.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">{condition.description}</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Recommendations:</p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                                {condition.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Next Steps:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {symptomCheckResult.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  onClick={handleSymptomCheck}
                  disabled={isChecking || selectedSymptoms.length === 0}
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Check Symptoms'
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFacilityLocatorOpen} onOpenChange={setIsFacilityLocatorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Find Healthcare Facilities</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="location"
                    placeholder="Enter city, area, or landmark"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFacilitySearch()}
                  />
                </div>
                <Button 
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Crosshair className="mr-2 h-4 w-4" />
                      Use My Location
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleFacilitySearch}
                  disabled={searching || (!searchQuery.trim() && !gettingLocation)}
                >
                  {searching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="list" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {searchResults.map((facility) => (
                      <div 
                        key={facility.id} 
                        className={`p-4 rounded-lg border bg-card cursor-pointer transition-colors ${
                          selectedFacility?.id === facility.id ? 'border-primary' : ''
                        }`}
                        onClick={() => setSelectedFacility(facility)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{facility.name}</h3>
                            <p className="text-sm text-muted-foreground">{facility.type}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{facility.rating}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{facility.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{facility.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{facility.operatingHours}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {facility.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (facility.coordinates) {
                                window.open(
                                  `https://www.openstreetmap.org/?mlat=${facility.coordinates.lat}&mlon=${facility.coordinates.lng}&zoom=15`,
                                  '_blank'
                                );
                              }
                            }}
                          >
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="map">
                <div ref={mapRef} className="h-[400px] w-full rounded-lg border overflow-hidden" />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPredictionForm} onOpenChange={setShowPredictionForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Health Risk Prediction</DialogTitle>
            <DialogDescription>
              Predict potential health risks based on your health information
            </DialogDescription>
          </DialogHeader>
          <PredictionForm />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default HealthModule;
