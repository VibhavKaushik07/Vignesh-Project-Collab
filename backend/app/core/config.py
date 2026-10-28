import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
UPLOADS_DIR = PROJECT_ROOT / "uploads"

# Ensure data and uploads directories exist inside PROJECT_ROOT
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "KrishiRakshak"
    TAGLINE: str = "Protecting Crops. Empowering Farmers. Preserving Nature."
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'krishirakshak.db'}")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "krishirakshak-secret-key-2026-vignesh-ai-agriculture")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    UPLOADS_DIR: Path = UPLOADS_DIR
    DATA_DIR: Path = DATA_DIR
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")

settings = Settings()
