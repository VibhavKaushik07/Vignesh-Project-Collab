import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.core.config import settings
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.services.seed_data import seed_database

# Import routers
from backend.app.api.auth import router as auth_router
from backend.app.api.crops import router as crops_router
from backend.app.api.disease import router as disease_router
from backend.app.api.pesticides import router as pesticides_router
from backend.app.api.organic import router as organic_router
from backend.app.api.comparison import router as comparison_router
from backend.app.api.weather import router as weather_router
from backend.app.api.regional import router as regional_router
from backend.app.api.chat import router as chat_router
from backend.app.api.activities import router as activities_router
from backend.app.api.education import router as education_router
from backend.app.api.notifications import router as notifications_router
from backend.app.api.dashboard import router as dashboard_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    # Seed authentic agricultural dataset
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=f"{settings.PROJECT_NAME} API",
    description="AI-Powered Pesticide Advisory & Organic Farming Awareness Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads directory for crop diagnostic images
if not os.path.exists(settings.UPLOADS_DIR):
    os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOADS_DIR)), name="uploads")

# Include Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(crops_router, prefix="/api")
app.include_router(disease_router, prefix="/api")
app.include_router(pesticides_router, prefix="/api")
app.include_router(organic_router, prefix="/api")
app.include_router(comparison_router, prefix="/api")
app.include_router(weather_router, prefix="/api")
app.include_router(regional_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(activities_router, prefix="/api")
app.include_router(education_router, prefix="/api")
app.include_router(notifications_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "database": "SQLite (Project-Local)",
        "db_location": str(settings.DATABASE_URL)
    }
