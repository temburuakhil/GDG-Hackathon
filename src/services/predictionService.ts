import axios from 'axios';

export interface PredictionInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  bmi: number;
  bloodPressure: string;
  cholesterol: number;
  smoking: 'none' | 'occasional' | 'regular';
  diabetes: 'yes' | 'no';
  alcohol: 'none' | 'occasional' | 'regular';
}

export interface DiseaseRisk {
  disease: string;
  riskPercentage: string;
  preventiveMeasures: string;
  diet: string;
  exercises: string;
  labTests: string;
}

export interface PredictionResult {
  risks: DiseaseRisk[];
  timestamp: string;
}

const predictionService = {
  async predict(input: PredictionInput): Promise<PredictionResult> {
    try {
      // First check if prediction server is running
      const isServerReady = await this.checkServerStatus();
      
      if (!isServerReady) {
        console.log('Server not ready, attempting to start...');
        await this.startPredictionServer();
      }

      console.log('Making prediction request with input:', input);
      const response = await axios.post<PredictionResult>('/api/health/predict', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      console.log('Prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error making prediction:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
        console.error('Request config:', error.config);
        throw new Error(error.response?.data?.details || error.response?.data?.error || error.message);
      }
      throw new Error('Failed to get prediction results');
    }
  },

  async checkServerStatus(): Promise<boolean> {
    try {
      console.log('Checking server status...');
      const response = await axios.get('/api/health/prediction-status', {
        timeout: 5000 // 5 second timeout
      });
      console.log('Server status response:', response.data);
      return response.data.status === 'ready';
    } catch (error) {
      console.error('Error checking server status:', error);
      return false;
    }
  },

  async startPredictionServer(): Promise<void> {
    try {
      console.log('Starting prediction server...');
      const response = await axios.get('/api/start-prediction-server', {
        timeout: 30000 // 30 second timeout for server start
      });
      console.log('Server start response:', response.data);
      
      // Wait for server to be ready
      let retries = 30; // Increase retries and timeout
      while (retries > 0) {
        console.log(`Checking if server is ready... (${retries} retries left)`);
        const isReady = await this.checkServerStatus();
        if (isReady) {
          console.log('Server is ready');
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increase wait time between retries
        retries--;
      }
      throw new Error('Server failed to start after multiple attempts');
    } catch (error) {
      console.error('Error starting prediction server:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
        console.error('Request config:', error.config);
        throw new Error(error.response?.data?.error || 'Failed to start prediction server');
      }
      throw new Error('Failed to start prediction server');
    }
  }
};

export default predictionService; 