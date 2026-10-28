from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# --- Auth & User Schemas ---
class UserCreate(BaseModel):
    full_name: str
    email: str
    mobile: Optional[str] = None
    password: str
    state: str = "Karnataka"
    district: str = "Bengaluru Rural"
    preferred_language: str = "en"

class ProfileCreate(BaseModel):
    full_name: str
    email: Optional[str] = None
    mobile: Optional[str] = None
    password: Optional[str] = "Kisan@2026"
    state: str = "Karnataka"
    district: str = "Bengaluru Rural"
    preferred_language: str = "en"

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    preferred_language: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    mobile: Optional[str] = None
    state: str
    district: str
    preferred_language: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Farmer Crop Schemas ---
class FarmerCropCreate(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    farming_type: str = "Conventional"
    farm_area_acres: float = 1.0
    sowing_date: Optional[str] = None
    stage: str = "Vegetative"
    notes: Optional[str] = None

class FarmerCropUpdate(BaseModel):
    crop_name: Optional[str] = None
    variety: Optional[str] = None
    farming_type: Optional[str] = None
    farm_area_acres: Optional[float] = None
    sowing_date: Optional[str] = None
    stage: Optional[str] = None
    notes: Optional[str] = None

class FarmerCropResponse(BaseModel):
    id: int
    user_id: int
    crop_name: str
    variety: Optional[str] = None
    farming_type: str
    farm_area_acres: float
    sowing_date: Optional[str] = None
    stage: str
    notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Disease Prediction Schemas ---
class DiseasePredictionResponse(BaseModel):
    id: int
    crop_name: str
    disease_name: str
    scientific_name: Optional[str] = None
    confidence: float
    severity: str
    symptoms: Optional[str] = None
    causes: Optional[str] = None
    chemical_treatment: Optional[str] = None
    organic_treatment: Optional[str] = None
    preventive_measures: Optional[str] = None
    advisory_link: Optional[str] = None
    image_filename: Optional[str] = None
    is_demo_mode: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Pesticide Schemas ---
class PesticideResponse(BaseModel):
    id: int
    brand_name: str
    technical_name: str
    chemical_family: Optional[str] = None
    category: str
    registered_crops: str
    target_pests: str
    label_dosage: str
    dilution_ratio: str
    application_guidance: str
    safety_precautions: str
    ppe_required: str
    pre_harvest_interval_days: int
    toxicity_band: str
    environmental_hazard: Optional[str] = None
    source_reference: str

    class Config:
        from_attributes = True

# --- Organic Alternative Schemas ---
class OrganicAlternativeResponse(BaseModel):
    id: int
    name: str
    category: str
    target_pests: str
    suitable_crops: str
    preparation_method: str
    application_method: str
    benefits: str
    limitations: str
    cost_level: str
    source_reference: str

    class Config:
        from_attributes = True

# --- Activity Schemas ---
class FarmingActivityCreate(BaseModel):
    crop_name: str
    activity_date: str
    activity_type: str
    pest_disease: Optional[str] = None
    product_used: Optional[str] = None
    quantity: Optional[str] = None
    is_organic: bool = False
    cost: float = 0.0
    notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    status: str = "Completed"

class FarmingActivityUpdate(BaseModel):
    crop_name: Optional[str] = None
    activity_date: Optional[str] = None
    activity_type: Optional[str] = None
    pest_disease: Optional[str] = None
    product_used: Optional[str] = None
    quantity: Optional[str] = None
    is_organic: Optional[bool] = None
    cost: Optional[float] = None
    notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    status: Optional[str] = None

class FarmingActivityResponse(BaseModel):
    id: int
    user_id: int
    crop_name: str
    activity_date: str
    activity_type: str
    pest_disease: Optional[str] = None
    product_used: Optional[str] = None
    quantity: Optional[str] = None
    is_organic: bool
    cost: float
    notes: Optional[str] = None
    follow_up_date: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Chat Assistant Schemas ---
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default-session"
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    language: str
    sources: Optional[List[str]] = []
    suggested_questions: Optional[List[str]] = []

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    category: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Educational Resource Schemas ---
class EducationalResourceResponse(BaseModel):
    id: int
    title: str
    category: str
    read_time: str
    summary: str
    content_markdown: str
    author: str
    tags: str
    source_url: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Regional Advisory Schemas ---
class RegionalAdvisoryResponse(BaseModel):
    id: int
    state: str
    district: str
    season: str
    crop: str
    recommendation: str
    pest_risks: str
    govt_resources: Optional[str] = None

    class Config:
        from_attributes = True
