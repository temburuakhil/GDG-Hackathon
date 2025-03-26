import express, { Request, Response } from 'express';
import cors from 'cors';
import { faker } from '@faker-js/faker';
import path from 'path';
import fs from 'fs';

// Interface definitions
interface WaterLeakReport {
  id: string;
  location: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 