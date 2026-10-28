export interface User {
  id: number;
  full_name: str;
  email: str;
  mobile?: string;
  state: string;
  district: string;
  preferred_language: string;
  created_at?: string;
}

export type str = string;

export interface FarmerCrop {
  id: number;
  user_id: number;
  crop_name: string;
  variety?: string;
  farming_type: string;
  farm_area_acres: number;
  sowing_date?: string;
  stage: string;
  notes?: string;
  created_at?: string;
}

export interface DiseasePrediction {
  id: number;
  crop_name: string;
  disease_name: string;
  scientific_name?: string;
  confidence: number;
  severity: string;
  symptoms?: string;
  causes?: string;
  chemical_treatment?: string;
  organic_treatment?: string;
  preventive_measures?: string;
  advisory_link?: string;
  image_filename?: string;
  is_demo_mode: boolean;
  created_at?: string;
}

export interface Pesticide {
  id: number;
  brand_name: string;
  technical_name: string;
  chemical_family?: string;
  category: string;
  registered_crops: string;
  target_pests: string;
  label_dosage: string;
  dilution_ratio: string;
  application_guidance: string;
  safety_precautions: string;
  ppe_required: string;
  pre_harvest_interval_days: number;
  toxicity_band: 'Green' | 'Blue' | 'Yellow' | 'Red' | string;
  environmental_hazard?: string;
  source_reference: string;
}

export interface OrganicAlternative {
  id: number;
  name: string;
  category: string;
  target_pests: string;
  suitable_crops: string;
  preparation_method: string;
  application_method: string;
  benefits: string;
  limitations: string;
  cost_level: string;
  source_reference: string;
}

export interface ComparisonItem {
  id: string;
  crop: string;
  pest_disease: string;
  scenario: string;
  chemical: {
    title: string;
    cost: string;
    effectiveness: string;
    safety_precautions: string;
    environmental_considerations: string;
    availability: string;
    application_complexity: string;
    pre_harvest_interval: string;
    suitability: string;
  };
  organic: {
    title: string;
    cost: string;
    effectiveness: string;
    safety_precautions: string;
    environmental_considerations: string;
    availability: string;
    application_complexity: string;
    pre_harvest_interval: string;
    suitability: string;
  };
}

export interface WeatherData {
  district: string;
  state: string;
  coordinates: { latitude: number; longitude: number };
  source: string;
  updated_at: string;
  current: {
    temperature: number;
    humidity: number;
    wind_speed: number;
    precipitation: number;
    condition: string;
  };
  spraying_advisory: {
    status: 'Optimal' | 'Moderate' | 'Unsuitable';
    badge_color: 'emerald' | 'amber' | 'rose';
    alerts: string[];
  };
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation_sum: number;
    wind_max: number;
    condition: string;
  }>;
}

export interface RegionalAdvisory {
  id: number;
  state: string;
  district: string;
  season: string;
  crop: string;
  recommendation: string;
  pest_risks: string;
  govt_resources?: string;
}

export interface FarmingActivity {
  id: number;
  user_id: number;
  crop_name: string;
  activity_date: string;
  activity_type: string;
  pest_disease?: string;
  product_used?: string;
  quantity?: string;
  is_organic: boolean;
  cost: number;
  notes?: string;
  follow_up_date?: string;
  status: string;
  created_at?: string;
}

export interface EducationalResource {
  id: number;
  title: string;
  category: string;
  read_time: string;
  summary: string;
  content_markdown: string;
  author: string;
  tags: string;
  source_url: string;
  created_at?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  created_at?: string;
}

export interface DashboardData {
  farmer: User;
  stats: {
    total_crops: number;
    total_acres: number;
    total_activities: number;
    organic_treatments: number;
    chemical_treatments: number;
    total_expenditure: number;
    unread_alerts: number;
  };
  crops: FarmerCrop[];
  recent_activities: FarmingActivity[];
  reminders: Array<{
    id: number;
    crop: string;
    treatment: string;
    date: string;
    status: string;
  }>;
  recent_diagnoses: Array<{
    id: number;
    crop_name: string;
    disease_name: string;
    confidence: number;
    severity: string;
    created_at?: string;
  }>;
  notifications: Array<{
    id: number;
    title: string;
    message: string;
    category: string;
    created_at?: string;
  }>;
  weather: {
    district: string;
    state: string;
    current: {
      temperature: number;
      humidity: number;
      wind_speed: number;
      precipitation: number;
      condition: string;
    };
    spraying_advisory: {
      status: 'Optimal' | 'Moderate' | 'Unsuitable';
      badge_color: 'emerald' | 'amber' | 'rose';
      alerts: string[];
    };
  };
}
