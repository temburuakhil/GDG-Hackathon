interface ClimateData {
  temperature: {
    current: number;
    trend: number; // positive for increasing, negative for decreasing
    average: number;
    min: number;
    max: number;
  };
  rainfall: {
    monthly: number;
    annual: number;
    trend: number;
    seasonalPattern: string;
  };
  humidity: {
    average: number;
    morning: number;
    evening: number;
  };
  airQuality: {
    index: number; // 0-500 AQI
    status: string;
    mainPollutant: string;
  };
  seasonalChanges: {
    season: string;
    characteristics: string[];
    recommendations: string[];
  }[];
}

interface HistoricalTrend {
  label: string;
  value: number;
  date: string;
}

class ClimateService {
  private mockClimateData: ClimateData = {
    temperature: {
      current: 32,
      trend: 0.8,
      average: 28,
      min: 22,
      max: 35
    },
    rainfall: {
      monthly: 85,
      annual: 1200,
      trend: -5,
      seasonalPattern: "Monsoon-influenced"
    },
    humidity: {
      average: 65,
      morning: 75,
      evening: 55
    },
    airQuality: {
      index: 85,
      status: "Moderate",
      mainPollutant: "PM2.5"
    },
    seasonalChanges: [
      {
        season: "Summer",
        characteristics: [
          "High temperatures",
          "Occasional heat waves",
          "Low rainfall"
        ],
        recommendations: [
          "Use drought-resistant crops",
          "Implement water conservation measures",
          "Plan outdoor activities for early morning or evening"
        ]
      },
      {
        season: "Monsoon",
        characteristics: [
          "Heavy rainfall",
          "High humidity",
          "Moderate temperatures"
        ],
        recommendations: [
          "Prepare for potential flooding",
          "Ensure proper drainage",
          "Monitor crop water levels"
        ]
      }
    ]
  };

  private mockHistoricalData: HistoricalTrend[] = [
    { label: "Temperature", value: 27, date: "2023-01" },
    { label: "Temperature", value: 28, date: "2023-02" },
    { label: "Temperature", value: 29, date: "2023-03" },
    { label: "Temperature", value: 30, date: "2023-04" },
    { label: "Temperature", value: 31, date: "2023-05" },
    { label: "Temperature", value: 32, date: "2023-06" }
  ];

  async getClimateData(): Promise<ClimateData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.mockClimateData;
  }

  async getHistoricalTrends(): Promise<HistoricalTrend[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.mockHistoricalData;
  }

  getAirQualityStatus(aqi: number): string {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  }

  getTemperatureTrendAnalysis(trend: number): string {
    if (trend > 1) return "Significant warming trend";
    if (trend > 0.5) return "Moderate warming trend";
    if (trend > 0) return "Slight warming trend";
    if (trend < -1) return "Significant cooling trend";
    if (trend < -0.5) return "Moderate cooling trend";
    if (trend < 0) return "Slight cooling trend";
    return "Stable temperature pattern";
  }
}

export const climateService = new ClimateService();
export type { ClimateData, HistoricalTrend }; 