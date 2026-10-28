import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    mobile = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    state = Column(String(100), default="Karnataka")
    district = Column(String(100), default="Bengaluru Rural")
    preferred_language = Column(String(10), default="en") # en, kn, hi
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    crops = relationship("FarmerCrop", back_populates="farmer", cascade="all, delete-orphan")
    activities = relationship("FarmingActivity", back_populates="farmer", cascade="all, delete-orphan")
    predictions = relationship("DiseasePrediction", back_populates="farmer", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="farmer", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="farmer", cascade="all, delete-orphan")

class FarmerCrop(Base):
    __tablename__ = "farmer_crops"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String(100), nullable=False)
    variety = Column(String(100), nullable=True)
    farming_type = Column(String(50), default="Conventional") # Organic, Conventional, Natural, IPM
    farm_area_acres = Column(Float, default=1.0)
    sowing_date = Column(String(50), nullable=True)
    stage = Column(String(50), default="Vegetative") # Germination, Vegetative, Flowering, Fruiting, Harvesting
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="crops")

class DiseasePrediction(Base):
    __tablename__ = "disease_predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    crop_name = Column(String(100), nullable=False)
    disease_name = Column(String(150), nullable=False)
    scientific_name = Column(String(150), nullable=True)
    confidence = Column(Float, default=0.0)
    severity = Column(String(50), default="Moderate") # Low, Moderate, High, Severe
    symptoms = Column(Text, nullable=True)
    causes = Column(Text, nullable=True)
    chemical_treatment = Column(Text, nullable=True)
    organic_treatment = Column(Text, nullable=True)
    preventive_measures = Column(Text, nullable=True)
    advisory_link = Column(String(255), nullable=True)
    image_filename = Column(String(255), nullable=True)
    is_demo_mode = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="predictions")

class Pesticide(Base):
    __tablename__ = "pesticides"

    id = Column(Integer, primary_key=True, index=True)
    brand_name = Column(String(150), nullable=False)
    technical_name = Column(String(200), nullable=False)
    chemical_family = Column(String(100), nullable=True)
    category = Column(String(50), nullable=False) # Insecticide, Fungicide, Herbicide, Bio-pesticide
    registered_crops = Column(Text, nullable=False) # comma-separated or text
    target_pests = Column(Text, nullable=False)
    label_dosage = Column(String(150), nullable=False)
    dilution_ratio = Column(String(150), nullable=False)
    application_guidance = Column(Text, nullable=False)
    safety_precautions = Column(Text, nullable=False)
    ppe_required = Column(Text, nullable=False)
    pre_harvest_interval_days = Column(Integer, default=7)
    toxicity_band = Column(String(50), default="Blue") # Green (Slightly toxic), Blue (Moderately), Yellow (Highly), Red (Extremely)
    environmental_hazard = Column(Text, nullable=True)
    source_reference = Column(String(255), default="Central Insecticides Board & Registration Committee (CIBRC), Govt of India")

class OrganicAlternative(Base):
    __tablename__ = "organic_alternatives"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False) # Bio-pesticide, Botanical Extract, Cultural Practice, Beneficial Insect, Soil Health
    target_pests = Column(Text, nullable=False)
    suitable_crops = Column(Text, nullable=False)
    preparation_method = Column(Text, nullable=False)
    application_method = Column(Text, nullable=False)
    benefits = Column(Text, nullable=False)
    limitations = Column(Text, nullable=False)
    cost_level = Column(String(50), default="Low") # Very Low, Low, Moderate
    source_reference = Column(String(255), default="National Centre of Organic Farming (NCOF) & ICAR")

class FarmingActivity(Base):
    __tablename__ = "farming_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String(100), nullable=False)
    activity_date = Column(String(50), nullable=False)
    activity_type = Column(String(100), nullable=False) # Spraying, Fertilizing, Weeding, Sowing, Harvesting, Organic Treatment
    pest_disease = Column(String(150), nullable=True)
    product_used = Column(String(150), nullable=True)
    quantity = Column(String(100), nullable=True)
    is_organic = Column(Boolean, default=False)
    cost = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    follow_up_date = Column(String(50), nullable=True)
    status = Column(String(50), default="Completed") # Completed, Pending, Overdue
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="activities")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), index=True, nullable=False)
    sender = Column(String(20), nullable=False) # user or assistant
    message = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    sources = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="chat_messages")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), default="Weather") # Weather, PestAlert, ActivityReminder, Tip
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("User", back_populates="notifications")

class EducationalResource(Base):
    __tablename__ = "educational_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False) # Organic Basics, Composting, Vermicomposting, Bio-Pesticides, Soil Health, Crop Rotation, IPM
    read_time = Column(String(50), default="5 min read")
    summary = Column(Text, nullable=False)
    content_markdown = Column(Text, nullable=False)
    author = Column(String(100), default="KrishiRakshak Agronomy Team")
    tags = Column(String(200), default="Organic, Sustainable, Soil")
    source_url = Column(String(255), default="ICAR & National Centre of Organic and Natural Farming")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RegionalAdvisory(Base):
    __tablename__ = "regional_advisories"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    season = Column(String(50), nullable=False) # Kharif, Rabi, Zaid, Annual
    crop = Column(String(100), nullable=False)
    recommendation = Column(Text, nullable=False)
    pest_risks = Column(Text, nullable=False)
    govt_resources = Column(Text, nullable=True)
