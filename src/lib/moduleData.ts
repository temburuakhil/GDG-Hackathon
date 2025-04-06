import { 
  Droplet, 
  Tractor, 
  GraduationCap, 
  HeartPulse, 
  Trees, 
  CloudSun, 
  Users,
  AlertCircle,
  AreaChart,
  Calendar,
  Clock,
  Handshake,
  FileText,
  Share2,
  BookOpen,
  BarChart3,
  ShieldCheck,
  SquareStack,
  Microscope,
  Sprout,
  Thermometer,
  Upload,
  Eye,
  Zap,
  Building,
  BadgeCheck,
  BarChart,
  Briefcase,
  GraduationCap as GraduationCapIcon,
  School,
  LineChart,
  Book,
  Music,
  UserCheck,
  Leaf,
  Waypoints,
  PenTool,
  Sparkles,
  Network,
  Palette,
  Award,
  Stethoscope,
  Hospital,
  Pill,
  HeartPulse as HeartIcon,
  MapPin,
  Leaf as LeafIcon,
  BarChart2,
  TreePine,
  Recycle,
  CloudRain,
  Sun,
  Wind,
  CloudSnow
} from 'lucide-react';

export interface ModuleFeature {
  title: string;
  description: string;
  icon: typeof Droplet;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: typeof Droplet;
  color: string;
  features: ModuleFeature[];
  stats?: {
    label: string;
    value: string;
  }[];
}

export const modules: Module[] = [
  {
    id: 'water',
    name: 'Clean Water Access',
    description: 'Track water quality, report leaks, and access purification guides.',
    icon: Droplet,
    color: 'water',
    features: [
      {
        title: 'Water Quality Monitoring',
        description: 'Real-time water quality data from local sources.',
        icon: AlertCircle
      },
      {
        title: 'Leak Reporting',
        description: 'Report water leaks with photos for quick resolution.',
        icon: Upload
      },
      {
        title: 'Purification Guides',
        description: 'Step-by-step water purification techniques.',
        icon: FileText
      }
    ],
    stats: [
      { label: 'Quality Reports', value: '243' },
      { label: 'Leaks Fixed', value: '58' },
      { label: 'Villages Covered', value: '17' }
    ]
  },
  {
    id: 'farmer',
    name: 'Farmer Livelihoods',
    description: 'Get crop recommendations, market prices, and farming techniques.',
    icon: Tractor,
    color: 'farmer',
    features: [
      {
        title: 'AI Crop Advisor',
        description: 'Get personalized recommendations for your soil type.',
        icon: Sprout
      },
      {
        title: 'Market Prices',
        description: 'Daily updates on crop prices from local markets.',
        icon: BarChart
      },
      {
        title: 'Weather Alerts',
        description: 'Timely weather alerts for farming activities.',
        icon: CloudSun
      }
    ],
    stats: [
      { label: 'Farmers Registered', value: '1,243' },
      { label: 'Market Updates', value: 'Daily' },
      { label: 'Crop Varieties', value: '37' }
    ]
  },
  {
    id: 'education',
    name: 'Girl Child Education',
    description: 'Access educational resources, virtual classrooms, and learning tools.',
    icon: GraduationCap,
    color: 'education',
    features: [
      {
        title: 'Offline STEM Lessons',
        description: 'Educational content that works without internet.',
        icon: BookOpen
      },
      {
        title: 'Virtual Classrooms',
        description: 'Connect with teachers remotely for lessons.',
        icon: Users
      },
      {
        title: 'Attendance Tracking',
        description: 'Track and improve school attendance.',
        icon: Calendar
      }
    ],
    stats: [
      { label: 'Students Enrolled', value: '876' },
      { label: 'Courses Available', value: '24' },
      { label: 'Completion Rate', value: '92%' }
    ]
  },
  {
    id: 'health',
    name: 'Health Crisis Prevention',
    description: 'Check symptoms, find healthcare services, and access health information.',
    icon: HeartPulse,
    color: 'health',
    features: [
      {
        title: 'Symptom Checker',
        description: 'Identify possible health issues with our AI tool.',
        icon: Microscope
      },
      {
        title: 'Healthcare Locator',
        description: 'Find nearest healthcare facilities and services.',
        icon: Building
      },
      {
        title: 'Telemedicine',
        description: 'Connect with healthcare professionals remotely.',
        icon: Handshake
      }
    ],
    stats: [
      { label: 'Health Checks', value: '2,345' },
      { label: 'Medical Camps', value: '18' },
      { label: 'Telehealth Sessions', value: '432' }
    ]
  },
  {
    id: 'resource',
    name: 'Natural Resource Management',
    description: 'Monitor deforestation, track soil health, and manage resources sustainably.',
    icon: Trees,
    color: 'resource',
    features: [
      {
        title: 'Deforestation Alerts',
        description: 'Get alerts about forest cover changes in your area.',
        icon: Eye
      },
      {
        title: 'Soil Health Dashboard',
        description: 'Monitor and improve your soil quality.',
        icon: BarChart3
      },
      {
        title: 'Resource Maps',
        description: 'Visual maps of local natural resources.',
        icon: SquareStack
      }
    ],
    stats: [
      { label: 'Areas Monitored', value: '42' },
      { label: 'Resource Maps', value: '16' },
      { label: 'Alert Accuracy', value: '94%' }
    ]
  },
  {
    id: 'climate',
    name: 'Climate Action',
    description: 'Track carbon footprint, get climate insights, and find sustainable practices.',
    icon: CloudSun,
    color: 'climate',
    features: [
      {
        title: 'Carbon Footprint',
        description: 'Measure and reduce your household carbon emissions.',
        icon: Thermometer
      },
      {
        title: 'Climate Insights',
        description: 'Understand climate patterns affecting your region.',
        icon: AreaChart
      },
      {
        title: 'Sustainable Practices',
        description: 'Learn eco-friendly techniques for daily life.',
        icon: Zap
      }
    ],
    stats: [
      { label: 'Carbon Tracked', value: '1,280 kg' },
      { label: 'Climate Reports', value: '38' },
      { label: 'Sustainable Tips', value: '145' }
    ]
  },
  {
    id: 'gender',
    name: 'Gender Equality in Jobs',
    description: 'Find job opportunities, skill-building resources, and support for women.',
    icon: Users,
    color: 'gender',
    features: [
      {
        title: 'Job Finder',
        description: 'Discover local employment opportunities.',
        icon: Briefcase
      },
      {
        title: 'Skill Development',
        description: 'Access training for in-demand skills.',
        icon: BadgeCheck
      },
      {
        title: 'Microfinance',
        description: 'Connect with microfinance opportunities.',
        icon: Share2
      }
    ],
    stats: [
      { label: 'Jobs Posted', value: '342' },
      { label: 'Skills Courses', value: '27' },
      { label: 'Women Employed', value: '186' }
    ]
  }
];
