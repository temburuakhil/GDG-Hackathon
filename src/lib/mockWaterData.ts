
import { WaterQualityDataPoint } from '@/components/water/WaterQualityMonitoring';
import { WaterLeakReport } from '@/components/water/LeakReporting';
import { PurificationGuide } from '@/components/water/PurificationGuides';

// Generate random water quality data
export const generateWaterQualityData = (): WaterQualityDataPoint[] => {
  const locations = [
    'Village Well', 
    'Community Tap', 
    'River Source', 
    'School Supply', 
    'Health Center',
    'Main Reservoir'
  ];
  
  return locations.map(location => {
    // Generate random values and round to 2 decimal places
    const ph = Number((Math.random() * 3 + 6).toFixed(2)); // pH between 6 and 9
    const turbidity = Number((Math.random() * 8).toFixed(2)); // Turbidity between 0 and 8 NTU
    const chlorine = Number((Math.random() * 4.5).toFixed(2)); // Chlorine between 0 and 4.5 mg/L
    
    return {
      location,
      ph,
      turbidity,
      chlorine,
      bacteria: Math.random() > 0.8, // 20% chance of bacterial contamination
      timestamp: new Date().toISOString()
    };
  });
};

// Sample water leak reports
export const sampleLeakReports: WaterLeakReport[] = [
  {
    id: '1',
    location: 'Main Street Pipeline',
    description: 'Water leaking from underground pipe near the market',
    severity: 'high',
    hasPhoto: true,
    dateReported: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    status: 'investigating'
  },
  {
    id: '2',
    location: 'School Water Tank',
    description: 'Small leak from the base of the water tank',
    severity: 'medium',
    hasPhoto: false,
    dateReported: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'pending'
  },
  {
    id: '3',
    location: 'Community Tap #3',
    description: 'Tap doesn\'t shut off completely',
    severity: 'low',
    hasPhoto: true,
    dateReported: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    status: 'resolved'
  }
];

// Purification guides
export const purificationGuides: PurificationGuide[] = [
  {
    id: '1',
    title: 'Boiling Water Purification',
    method: 'Heat Treatment',
    difficulty: 'easy',
    timeRequired: '20-30 minutes',
    materials: [
      'Clean pot or kettle',
      'Heat source (stove, fire)',
      'Container for storing water'
    ],
    steps: [
      'Fill a clean pot with water.',
      'Heat the water until it reaches a rolling boil.',
      'Maintain the boil for at least 1-3 minutes (3 minutes at higher altitudes).',
      'Let the water cool naturally.',
      'Store in clean, covered containers for use.'
    ]
  },
  {
    id: '2',
    title: 'Solar Disinfection (SODIS)',
    method: 'UV Treatment',
    difficulty: 'easy',
    timeRequired: '6-48 hours',
    materials: [
      'Clear PET plastic bottles',
      'Clean water',
      'Sunny location'
    ],
    steps: [
      'Clean and rinse clear PET plastic bottles thoroughly.',
      'Fill bottles with water, making sure water is not too turbid.',
      'Seal the bottles tightly.',
      'Place bottles on a reflective surface in direct sunlight.',
      'Leave for at least 6 hours in sunny conditions or 2 days in cloudy conditions.',
      'Water is ready to drink after this period.'
    ]
  },
  {
    id: '3',
    title: 'Chlorination',
    method: 'Chemical Treatment',
    difficulty: 'medium',
    timeRequired: '30 minutes',
    materials: [
      'Liquid bleach (unscented, regular) or chlorine tablets',
      'Clean water',
      'Container for water',
      'Dropper or measuring spoon',
      'Timer or watch'
    ],
    steps: [
      'Fill a clean container with clear water.',
      'Add the appropriate amount of bleach (typically 2 drops of 5-6% bleach per liter of water).',
      'Stir thoroughly.',
      'Let stand for 30 minutes.',
      'Water should have a slight chlorine smell. If not, repeat with one more drop.',
      'If the chlorine taste is too strong, let the water stand exposed to air for a few hours.'
    ]
  },
  {
    id: '4',
    title: 'Biosand Filtration',
    method: 'Physical & Biological Filtration',
    difficulty: 'hard',
    timeRequired: 'Setup: Several hours; Operation: Minutes',
    materials: [
      'Container (concrete or plastic)',
      'Sand (fine and coarse)',
      'Gravel',
      'PVC pipe for outlet',
      'Tools for construction'
    ],
    steps: [
      'Construct or obtain a biosand filter container with an outlet pipe at the bottom.',
      'Layer materials in the container: gravel at the bottom, then coarse sand, then fine sand.',
      'Install the outlet pipe through the gravel layer.',
      'Run water through the filter several times to clean it.',
      'Allow the biological layer to develop for 1-3 weeks.',
      'To use, pour water into the top and collect filtered water from the outlet.',
      'Clean by stirring the top layer of sand when flow decreases.'
    ]
  },
  {
    id: '5',
    title: 'Coagulation-Flocculation',
    method: 'Physical-Chemical Treatment',
    difficulty: 'medium',
    timeRequired: '1-2 hours',
    materials: [
      'Alum (aluminum sulfate), moringa seeds, or other natural coagulants',
      'Clean containers for mixing and settling',
      'Stirring utensil',
      'Clean cloth for filtering'
    ],
    steps: [
      'Add the coagulant to turbid water (about 1/2 teaspoon of alum or powder from 2 moringa seeds per 20 liters).',
      'Stir rapidly for 1-2 minutes.',
      'Reduce stirring speed and continue for 5-10 minutes.',
      'Let the water stand undisturbed for 1-2 hours.',
      'When particles have settled to the bottom, carefully pour or siphon the clear water through a clean cloth.',
      'The filtered water can be further treated by chlorination or boiling for complete safety.'
    ]
  }
];

// Simulate fetching data with a delay
export const fetchWaterQualityDataAsync = async (): Promise<WaterQualityDataPoint[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateWaterQualityData());
    }, 1000);
  });
};
