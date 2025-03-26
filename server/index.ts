import express, { Request, Response } from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import https from 'https';
import { exec, spawn } from 'child_process';

// Interface definitions
interface WaterLeakReport {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

// Real-time data storage
interface RealTimeData {
  marketPrices: any[];
  weatherAlerts: any[];
  cropRecommendations: any[];
  marketTrends: any[];
  farmerStats: any;
}

// Health module interfaces
interface HealthStats {
  healthChecks: number;
  medicalCamps: number;
}

interface HealthAdvisory {
  id: string;
  type: 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  affectedAreas?: string[];
}

interface HealthcareFacility {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  operatingHours: string;
  rating: number;
  specialties: string[];
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SymptomCheckResult {
  possibleConditions: {
    name: string;
    probability: number;
    description: string;
    recommendations: string[];
  }[];
  severity: 'low' | 'medium' | 'high';
  nextSteps: string[];
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// File path for water complaints
const complaintsFilePath = path.join(__dirname, 'data', 'waterComplaints.txt');

// Ensure the data directory exists
try {
  if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
    console.log('Created data directory:', path.join(__dirname, 'data'));
  }
} catch (error) {
  console.error('Error creating data directory:', error);
}

// Create complaints file if it doesn't exist
try {
  if (!fs.existsSync(complaintsFilePath)) {
    fs.writeFileSync(complaintsFilePath, 'Water Complaints Log\n===================\nFormat: ID | Location | Description | Status | Date Reported | Last Updated\n\n');
    console.log('Created complaints file:', complaintsFilePath);
  }
} catch (error) {
  console.error('Error creating complaints file:', error);
}

// Function to read complaints from file
const readComplaints = (): WaterLeakReport[] => {
  try {
    const content = fs.readFileSync(complaintsFilePath, 'utf-8');
    const lines = content.split('\n').slice(4); // Skip header lines
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, location, description, status, createdAt, updatedAt] = line.split('|').map(s => s.trim());
        // Validate status is one of the allowed values
        const validStatus = status === 'pending' || status === 'in_progress' || status === 'resolved' 
          ? status as 'pending' | 'in_progress' | 'resolved'
          : 'pending';
        return { 
          id, 
          location, 
          description, 
          status: validStatus,
          createdAt, 
          updatedAt 
        };
      });
  } catch (error) {
    console.error('Error reading complaints:', error);
    return [];
  }
};

// Function to write complaints to file
const writeComplaint = (complaint: WaterLeakReport) => {
  try {
    // Format the complaint data
    const line = `${complaint.id}|${complaint.location}|${complaint.description}|${complaint.status}|${complaint.createdAt}|${complaint.createdAt}\n`;
    
    // Ensure the file exists before writing
    if (!fs.existsSync(complaintsFilePath)) {
      fs.writeFileSync(complaintsFilePath, 'Water Complaints Log\n===================\nFormat: ID | Location | Description | Status | Date Reported | Last Updated\n\n');
    }
    
    // Append the complaint
    fs.appendFileSync(complaintsFilePath, line);
    console.log('Successfully wrote complaint to file:', complaint.id);
    return true;
  } catch (error) {
    console.error('Error writing complaint to file:', error);
    return false;
  }
};

// Mock data
const generateWaterQualityData = () => ({
  ph: faker.number.float({ min: 6.5, max: 8.5, precision: 0.1 }),
  turbidity: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
  dissolvedOxygen: faker.number.float({ min: 5, max: 10, precision: 0.1 }),
  temperature: faker.number.float({ min: 20, max: 30, precision: 0.1 }),
  timestamp: new Date().toISOString()
});

const generateLeakReport = () => ({
  id: faker.string.uuid(),
  location: faker.location.streetAddress(),
  description: faker.lorem.sentence(),
  status: 'pending',
  createdAt: new Date().toISOString()
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Farmer data generators
const generateCropPrice = () => ({
  id: faker.string.uuid(),
  cropName: faker.helpers.arrayElement(['Wheat', 'Rice', 'Corn', 'Soybeans', 'Pulses']),
  price: faker.number.float({ min: 1000, max: 5000, precision: 0.01 }),
  unit: 'per quintal',
  market: faker.location.city(),
  timestamp: faker.date.recent().toISOString()
});

const generateWeatherAlert = () => ({
  id: faker.string.uuid(),
  type: faker.helpers.arrayElement(['rain', 'drought', 'frost', 'storm']),
  severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
  message: faker.lorem.sentence(),
  startDate: faker.date.soon().toISOString(),
  endDate: faker.date.future().toISOString()
});

const generateCropRecommendation = (soilType: string) => ({
  id: faker.string.uuid(),
  cropName: faker.helpers.arrayElement(['Wheat', 'Rice', 'Corn', 'Cotton', 'Sugarcane']),
  confidence: faker.number.float({ min: 0.6, max: 0.95, precision: 0.01 }),
  expectedYield: faker.number.float({ min: 20, max: 40, precision: 0.1 }),
  waterRequirement: faker.number.float({ min: 500, max: 2000, precision: 0.1 }),
  seasonality: faker.helpers.arrayElements(['Kharif', 'Rabi', 'Zaid'], { min: 1, max: 2 }),
  soilType: [soilType]
});

// Real-time data storage
const realTimeData: RealTimeData = {
  marketPrices: [],
  weatherAlerts: [],
  cropRecommendations: [],
  marketTrends: [],
  farmerStats: {
    farmersRegistered: 0,
    marketUpdates: 'Daily',
    cropVarieties: 0,
    totalArea: 0,
    activeMarkets: 0
  }
};

// WebSocket server setup
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  // Send initial data
  ws.send(JSON.stringify({
    type: 'initial',
    data: realTimeData
  }));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Function to broadcast updates to all connected clients
const broadcastUpdate = (type: keyof RealTimeData, data: any) => {
  const message = JSON.stringify({
    type,
    data
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Update real-time data periodically
const updateRealTimeData = () => {
  // Update market prices
  realTimeData.marketPrices = Array.from({ length: 5 }, generateCropPrice);
  broadcastUpdate('marketPrices', realTimeData.marketPrices);

  // Update weather alerts
  realTimeData.weatherAlerts = Array.from({ length: 3 }, generateWeatherAlert);
  broadcastUpdate('weatherAlerts', realTimeData.weatherAlerts);

  // Update market trends
  const crops = ['Wheat', 'Rice', 'Pulses'];
  realTimeData.marketTrends = crops.map(cropName => ({
    cropName,
    data: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      price: faker.number.float({ min: 1000, max: 5000, precision: 0.01 })
    }))
  }));
  broadcastUpdate('marketTrends', realTimeData.marketTrends);

  // Update farmer stats
  realTimeData.farmerStats = {
    farmersRegistered: faker.number.int({ min: 1000, max: 2000 }),
    marketUpdates: 'Daily',
    cropVarieties: faker.number.int({ min: 30, max: 50 }),
    totalArea: faker.number.int({ min: 5000, max: 10000 }),
    activeMarkets: faker.number.int({ min: 10, max: 20 })
  };
  broadcastUpdate('farmerStats', realTimeData.farmerStats);
};

// Start periodic updates
setInterval(updateRealTimeData, 30000); // Update every 30 seconds

// Routes
app.get('/', (req: Request, res: Response) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GramSeva Water Quality API</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .header {
          color: #2563eb;
          margin-bottom: 20px;
        }
        .endpoint {
          padding: 12px;
          border-radius: 6px;
          background: #f8fafc;
          margin-bottom: 12px;
        }
        .endpoint h3 {
          margin: 0 0 8px 0;
          color: #1e40af;
        }
        .endpoint p {
          margin: 0 0 8px 0;
          color: #4b5563;
        }
        .endpoint code {
          display: block;
          padding: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          margin-top: 8px;
          font-family: monospace;
        }
        .link {
          color: #2563eb;
          text-decoration: none;
        }
        .link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1 class="header">GramSeva Water Quality API</h1>
        <p>Welcome to the GramSeva Water Quality API. Below are the available endpoints:</p>
      </div>

      <div class="card">
        <div class="endpoint">
          <h3>Water Quality Data</h3>
          <p>Get current water quality metrics</p>
          <code>GET <a href="/api/water/quality" class="link">/api/water/quality</a></code>
        </div>

        <div class="endpoint">
          <h3>Water Quality Trends</h3>
          <p>Get historical water quality data</p>
          <code>GET <a href="/api/water/quality/trends" class="link">/api/water/quality/trends</a></code>
        </div>

        <div class="endpoint">
          <h3>Water Statistics</h3>
          <p>Get overall water quality statistics</p>
          <code>GET <a href="/api/water/stats" class="link">/api/water/stats</a></code>
        </div>

        <div class="endpoint">
          <h3>Water Leak Reports</h3>
          <p>View and submit water leak reports</p>
          <code>GET <a href="/api/water/leaks" class="link">/api/water/leaks</a></code>
          <code>POST /api/water/leaks</code>
        </div>

        <div class="endpoint">
          <h3>Purification Guides</h3>
          <p>Access water purification guides</p>
          <code>GET <a href="/api/water/purification-guides" class="link">/api/water/purification-guides</a></code>
        </div>
      </div>

      <div class="card">
        <p style="margin: 0; color: #4b5563;">
          <strong>Note:</strong> All data endpoints return JSON by default. The water quality endpoint also supports HTML format when accessed via browser.
        </p>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.get('/api/water/quality', (req: Request, res: Response) => {
  const data = [generateWaterQualityData()];
  
  // Check if the request accepts HTML
  if (req.accepts('html')) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Water Quality Data</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
          }
          .header {
            color: #2563eb;
            margin-bottom: 20px;
          }
          .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .metric:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 500;
            color: #4b5563;
          }
          .value {
            font-weight: 600;
            color: #1f2937;
          }
          .timestamp {
            color: #6b7280;
            font-size: 0.875rem;
            text-align: right;
            margin-top: 10px;
          }
          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;
          }
          .status.good {
            background-color: #dcfce7;
            color: #166534;
          }
          .status.warning {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status.alert {
            background-color: #fee2e2;
            color: #991b1b;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1 class="header">Water Quality Report</h1>
          
          <div class="metric">
            <span class="label">pH Level</span>
            <div>
              <span class="value">${data[0].ph}</span>
              <span class="status ${data[0].ph >= 6.5 && data[0].ph <= 8.5 ? 'good' : 'warning'}">
                ${data[0].ph >= 6.5 && data[0].ph <= 8.5 ? 'Normal' : 'Attention'}
              </span>
            </div>
          </div>
          
          <div class="metric">
            <span class="label">Turbidity (NTU)</span>
            <div>
              <span class="value">${data[0].turbidity}</span>
              <span class="status ${data[0].turbidity < 5 ? 'good' : 'alert'}">
                ${data[0].turbidity < 5 ? 'Clear' : 'High'}
              </span>
            </div>
          </div>
          
          <div class="metric">
            <span class="label">Dissolved Oxygen (mg/L)</span>
            <div>
              <span class="value">${data[0].dissolvedOxygen}</span>
              <span class="status ${data[0].dissolvedOxygen >= 5 ? 'good' : 'warning'}">
                ${data[0].dissolvedOxygen >= 5 ? 'Good' : 'Low'}
              </span>
            </div>
          </div>
          
          <div class="metric">
            <span class="label">Temperature (°C)</span>
            <div>
              <span class="value">${data[0].temperature}</span>
              <span class="status ${data[0].temperature >= 20 && data[0].temperature <= 25 ? 'good' : 'warning'}">
                ${data[0].temperature >= 20 && data[0].temperature <= 25 ? 'Optimal' : 'Note'}
              </span>
            </div>
          </div>
          
          <div class="timestamp">
            Last updated: ${new Date(data[0].timestamp).toLocaleString()}
          </div>
        </div>
        
        <div class="card">
          <p style="margin: 0; color: #4b5563;">
            <strong>Note:</strong> This data is refreshed every minute. For raw JSON data, 
            <a href="/api/water/quality" style="color: #2563eb;">click here</a> with the appropriate headers.
          </p>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } else {
    // Return JSON data
    res.json(data);
  }
});

app.get('/api/water/quality/trends', (req: Request, res: Response) => {
  const data = Array.from({ length: 24 }, () => ({
    ...generateWaterQualityData(),
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
  }));
  res.json(data);
});

app.get('/api/water/stats', (req: Request, res: Response) => {
  res.json({
    qualityReports: faker.number.int({ min: 200, max: 300 }),
    leaksFixed: faker.number.int({ min: 50, max: 70 }),
    villagesCovered: faker.number.int({ min: 15, max: 20 })
  });
});

app.get('/api/water/leaks', (req: Request, res: Response) => {
  const complaints = readComplaints();
  res.json(complaints);
});

app.post('/api/water/leaks', (req: Request, res: Response) => {
  try {
    const timestamp = new Date().toISOString();
    const newLeak = {
      id: faker.string.uuid(),
      location: req.body.location || '',
      description: req.body.description || '',
      status: 'pending' as const,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    console.log('Attempting to save complaint:', newLeak);
    
    if (writeComplaint(newLeak)) {
      console.log('Successfully saved complaint');
      res.status(201).json(newLeak);
    } else {
      console.error('Failed to save complaint');
      res.status(500).json({ error: 'Failed to save complaint' });
    }
  } catch (error) {
    console.error('Error in POST /api/water/leaks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/water/purification-guides', (req: Request, res: Response) => {
  const guides = [
    {
      title: 'Boiling Water',
      content: 'Boiling water is one of the most effective methods to kill harmful microorganisms.',
      steps: [
        'Fill a clean pot with water',
        'Bring water to a rolling boil',
        'Let it boil for at least 1 minute',
        'Cool the water before drinking'
      ]
    },
    {
      title: 'Chlorination',
      content: 'Using chlorine tablets or liquid chlorine to disinfect water.',
      steps: [
        'Add the recommended amount of chlorine',
        'Wait for 30 minutes',
        'Test the water quality',
        'Store in a clean container'
      ]
    },
    {
      title: 'Solar Disinfection',
      content: 'Using sunlight to kill harmful microorganisms in water.',
      steps: [
        'Fill a clear plastic bottle with water',
        'Place in direct sunlight for 6 hours',
        'Store in a clean container',
        'Use within 24 hours'
      ]
    }
  ];
  res.json(guides);
});

// Farmer Module Routes
app.get('/api/farmer/market-prices', (req: Request, res: Response) => {
  res.json(realTimeData.marketPrices);
});

app.get('/api/farmer/weather-alerts', (req: Request, res: Response) => {
  res.json(realTimeData.weatherAlerts);
});

app.get('/api/farmer/crop-recommendations', (req: Request, res: Response) => {
  const soilType = req.query.soilType as string || 'Black Soil';
  realTimeData.cropRecommendations = Array.from({ length: 3 }, () => generateCropRecommendation(soilType));
  res.json(realTimeData.cropRecommendations);
});

app.get('/api/farmer/market-trends', (req: Request, res: Response) => {
  res.json(realTimeData.marketTrends);
});

app.get('/api/farmer/stats', (req: Request, res: Response) => {
  res.json(realTimeData.farmerStats);
});

app.post('/api/farmer/soil-analysis', upload.single('sample'), (req: Request, res: Response) => {
  res.status(201).json({
    id: faker.string.uuid(),
    status: 'submitted'
  });
});

// Mock data generators
const generateHealthStats = (): HealthStats => ({
  healthChecks: faker.number.int({ min: 2000, max: 3000 }),
  medicalCamps: faker.number.int({ min: 15, max: 25 })
});

const generateHealthAdvisory = (): HealthAdvisory => {
  const types: ('alert' | 'warning' | 'info')[] = ['alert', 'warning', 'info'];
  const severities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const type = faker.helpers.arrayElement(types);
  const severity = faker.helpers.arrayElement(severities);
  
  return {
    id: faker.string.uuid(),
    type,
    title: faker.lorem.sentence(),
    message: faker.lorem.paragraph(),
    severity,
    timestamp: new Date().toISOString(),
    affectedAreas: faker.helpers.multiple(() => faker.location.city(), { count: { min: 1, max: 3 } })
  };
};

app.get('/api/health/stats', (req: Request, res: Response) => {
  res.json(generateHealthStats());
});

app.get('/api/health/advisories', (req: Request, res: Response) => {
  const advisories = faker.helpers.multiple(generateHealthAdvisory, { count: { min: 0, max: 3 } });
  res.json(advisories);
});

// Mock data generators for health module
const generateSymptomCheckResult = (symptoms: string[]): SymptomCheckResult => {
  const conditions = [
    {
      name: 'Common Cold',
      description: 'Viral infection of the nose and throat',
      recommendations: ['Rest', 'Stay hydrated', 'Take over-the-counter medications']
    },
    {
      name: 'Flu',
      description: 'Influenza virus infection',
      recommendations: ['Rest', 'Stay hydrated', 'Take antiviral medications if prescribed']
    },
    {
      name: 'COVID-19',
      description: 'Coronavirus disease',
      recommendations: ['Isolate', 'Get tested', 'Monitor symptoms']
    }
  ];

  return {
    possibleConditions: faker.helpers.arrayElements(conditions, { min: 1, max: 3 }).map(condition => ({
      ...condition,
      probability: faker.number.float({ min: 0.1, max: 0.9, precision: 0.1 })
    })),
    severity: faker.helpers.arrayElement(['low', 'medium', 'high']),
    nextSteps: [
      'Monitor symptoms',
      'Stay hydrated',
      'Get adequate rest',
      'Seek medical attention if symptoms worsen'
    ]
  };
};

// Type-safe city coordinates
const cities: Record<string, { lat: number; lng: number }> = {
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.6139, lng: 77.2090 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'current': { lat: 19.0760, lng: 72.8777 }
};

app.get('/api/health/facilities', (req: Request, res: Response) => {
  try {
    const { location, lat, lng } = req.query;
    const count = faker.number.int({ min: 5, max: 15 });
    
    // Generate coordinates based on search parameters
    const getBaseCoordinates = () => {
      if (lat && lng) {
        const parsedLat = parseFloat(lat as string);
        const parsedLng = parseFloat(lng as string);
        
        if (isNaN(parsedLat) || isNaN(parsedLng)) {
          throw new Error('Invalid coordinates format');
        }
        
        return {
          lat: parsedLat,
          lng: parsedLng
        };
      }
      
      const searchLocation = location ? location.toString().toLowerCase() : 'current';
      
      // If location is not in cities list, use Nominatim geocoding fallback
      if (!cities[searchLocation as keyof typeof cities]) {
        // For unknown cities, we'll use a default location in India
        // In a production environment, this would be replaced with actual geocoding
        return { lat: 20.5937, lng: 78.9629 }; // Center of India
      }
      
      return cities[searchLocation as keyof typeof cities];
    };

    const baseCoords = getBaseCoordinates();
    
    const facilities = Array.from({ length: count }, () => {
      // Generate random coordinates within ~5km radius of the base location
      const randomOffset = () => (Math.random() - 0.5) * 0.1; // ~5km radius
      const coordinates = {
        lat: baseCoords.lat + randomOffset(),
        lng: baseCoords.lng + randomOffset()
      };

      // Calculate a more realistic distance based on the offset
      const distance = Math.sqrt(
        Math.pow(randomOffset() * 111, 2) + 
        Math.pow(randomOffset() * 111 * Math.cos(baseCoords.lat * Math.PI / 180), 2)
      );

      return {
        id: faker.string.uuid(),
        name: faker.company.name() + ' ' + faker.helpers.arrayElement(['Hospital', 'Clinic', 'Medical Center']),
        type: faker.helpers.arrayElement(['Hospital', 'Clinic', 'Pharmacy', 'Diagnostic Center']),
        address: `${faker.location.streetAddress()}, ${location || faker.location.city()}`,
        phone: faker.phone.number('+91 ## #### ####'),
        operatingHours: '9:00 AM - 9:00 PM',
        rating: faker.number.float({ min: 3.5, max: 5, precision: 0.1 }),
        specialties: faker.helpers.arrayElements([
          'General Medicine', 'Emergency Care', 'Pediatrics', 'Cardiology',
          'Orthopedics', 'Neurology', 'Dental Care', 'Eye Care',
          'Physiotherapy', 'Mental Health'
        ], { min: 2, max: 5 }),
        distance: parseFloat(distance.toFixed(1)),
        coordinates
      };
    });

    res.json(facilities);
  } catch (error) {
    console.error('Error in /api/health/facilities:', error);
    res.status(500).json({ 
      error: 'Failed to search for healthcare facilities',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/health/symptom-check', (req: Request, res: Response) => {
  const { symptoms } = req.body;
  if (!Array.isArray(symptoms)) {
    return res.status(400).json({ error: 'Symptoms must be an array' });
  }
  res.json(generateSymptomCheckResult(symptoms));
});

// Add prediction endpoints
app.get('/api/health/prediction-status', (req: Request, res: Response) => {
  // Check if prediction server is running
  http.get('http://localhost:5000/health-check', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.json({ status: parsedData.status === 'ok' ? 'ready' : 'not_ready' });
      } catch (e) {
        res.json({ status: 'not_ready' });
      }
    });
  }).on('error', () => {
    res.json({ status: 'not_ready' });
  });
});

app.post('/api/health/predict', async (req: Request, res: Response) => {
  try {
    // Check if prediction server is running
    const serverCheck = await new Promise((resolve) => {
      http.get('http://localhost:5000/health-check', (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          try {
            JSON.parse(data);
            resolve(true);
          } catch (e) {
            resolve(false);
          }
        });
      }).on('error', () => resolve(false));
    });

    if (!serverCheck) {
      return res.status(503).json({ error: 'Prediction service is not ready' });
    }

    // Forward the prediction request to the Flask server
    const predictionResponse = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(req.body);
      const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/predict',  // Updated path to match Flask server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const request = http.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.error) {
              reject(new Error(parsedData.details || parsedData.error));
            } else {
              resolve(parsedData);
            }
          } catch (e) {
            reject(new Error('Invalid response from prediction server'));
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.write(postData);
      request.end();
    });

    res.json(predictionResponse);
  } catch (error) {
    console.error('Error in prediction endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to get prediction results',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Add endpoint to start prediction server
app.get('/api/start-prediction-server', (req: Request, res: Response) => {
  const predictionDir = path.join(__dirname, '..', 'Future Prediction');
  
  // First, try to check if the server is already running
  const healthCheck = http.get('http://localhost:5000/health-check', (response) => {
    let data = '';
    
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        // Try to parse as JSON
        JSON.parse(data);
        // If successful, server is running
        res.json({ message: 'Prediction server is already running' });
      } catch (e) {
        // If not JSON, start the server
        startServer();
      }
    });
  }).on('error', () => {
    // Server is not running, let's start it
    startServer();
  });

  function startServer() {
    // Kill any existing Python processes running on port 5000
    exec('netstat -ano | findstr :5000', (error, stdout, stderr) => {
      if (stdout) {
        const pidMatch = stdout.match(/\s+(\d+)\s*$/);
        if (pidMatch && pidMatch[1]) {
          exec(`taskkill /PID ${pidMatch[1]} /F`, () => {
            installAndStartServer();
          });
        } else {
          installAndStartServer();
        }
      } else {
        installAndStartServer();
      }
    });
  }

  function installAndStartServer() {
    console.log('Starting package installation...');
    
    // First check if Python is available
    const pythonCheck = spawn('python', ['--version'], { shell: true });
    
    pythonCheck.on('error', (error) => {
      console.error('Failed to start Python:', error);
      res.status(500).json({ error: 'Python is not installed or not accessible' });
      return;
    });

    pythonCheck.on('close', (code) => {
      if (code !== 0) {
        console.error('Python check failed with code:', code);
        res.status(500).json({ error: 'Python is not installed or not accessible' });
        return;
      }

      console.log('Python check passed, installing packages...');
      
      // Install packages one by one for better error handling
      const packages = ['flask', 'flask-cors', 'numpy', 'joblib', 'scikit-learn'];
      let currentPackage = 0;

      function installNextPackage() {
        if (currentPackage >= packages.length) {
          console.log('All packages installed successfully');
          startFlaskServer();
          return;
        }

        const pkg = packages[currentPackage];
        console.log(`Installing ${pkg}...`);
        
        const installProcess = spawn('python', [
          '-m',
          'pip',
          'install',
          '--no-cache-dir',
          pkg
        ], {
          cwd: predictionDir,
          shell: true
        });

        let installOutput = '';
        let errorOutput = '';

        installProcess.stdout.on('data', (data) => {
          installOutput += data.toString();
          console.log(`Installing ${pkg}:`, data.toString());
        });

        installProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
          console.error(`Error installing ${pkg}:`, data.toString());
        });

        installProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`Failed to install ${pkg}. Exit code:`, code);
            console.error('Error output:', errorOutput);
            res.status(500).json({ 
              error: `Failed to install ${pkg}. Please check if Python and pip are properly installed.`,
              details: errorOutput
            });
            return;
          }

          currentPackage++;
          installNextPackage();
        });
      }

      function startFlaskServer() {
        console.log('Starting Flask server...');
        
        // Change directory to prediction directory first
        process.chdir(predictionDir);
        
        const pythonProcess = spawn('python', ['app.py'], {
          cwd: predictionDir,
          shell: true,
          env: {
            ...process.env,
            PYTHONUNBUFFERED: '1'  // Ensure Python output is not buffered
          }
        });
        
        pythonProcess.stdout.on('data', (data) => {
          console.log('Flask server output:', data.toString());
        });

        pythonProcess.stderr.on('data', (data) => {
          console.error('Flask server error:', data.toString());
        });

        pythonProcess.on('error', (error) => {
          console.error('Failed to start Flask server:', error);
          res.status(500).json({ error: 'Failed to start prediction server' });
        });

        // Wait a bit to make sure the server starts
        setTimeout(() => {
          // Try to check if the server is actually running
          http.get('http://localhost:5000/health-check', (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
              data += chunk;
            });

            response.on('end', () => {
              try {
                // Try to parse as JSON
                JSON.parse(data);
                res.json({ message: 'Prediction server started successfully' });
              } catch (e) {
                res.status(500).json({ error: 'Server response is not valid JSON' });
              }
            });
          }).on('error', () => {
            res.status(500).json({ error: 'Failed to start prediction server' });
          });
        }, 5000);
      }

      // Start installing packages
      installNextPackage();
    });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`WebSocket server is ready for real-time updates`);
}); 