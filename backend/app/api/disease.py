from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, DiseasePrediction
from backend.app.schemas.schemas import DiseasePredictionResponse
from backend.app.services.disease_service import validate_and_save_image, analyze_crop_image
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/disease", tags=["AI Crop Disease Detection"])

@router.post("/analyze", response_model=DiseasePredictionResponse)
async def analyze_disease(
    crop_name: str = Form(...),
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not crop_name.strip():
        raise HTTPException(status_code=400, detail="Crop name is required.")

    # 1. Validate and save image file locally
    saved_filename = validate_and_save_image(file)

    # 2. Analyze disease symptoms and generate diagnosis
    result = analyze_crop_image(crop_name=crop_name, filename=saved_filename)

    # 3. Persist record to database
    prediction = DiseasePrediction(
        user_id=current_user.id if current_user else None,
        crop_name=result["crop_name"],
        disease_name=result["disease_name"],
        scientific_name=result["scientific_name"],
        confidence=result["confidence"],
        severity=result["severity"],
        symptoms=result["symptoms"],
        causes=result["causes"],
        chemical_treatment=result["chemical_treatment"],
        organic_treatment=result["organic_treatment"],
        preventive_measures=result["preventive_measures"],
        advisory_link=result["advisory_link"],
        image_filename=saved_filename,
        is_demo_mode=result["is_demo_mode"]
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)

    return prediction

@router.get("/history", response_model=List[DiseasePredictionResponse])
def get_prediction_history(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(DiseasePrediction)
    if current_user:
        query = query.filter((DiseasePrediction.user_id == current_user.id) | (DiseasePrediction.user_id == None))
    return query.order_by(DiseasePrediction.created_at.desc()).limit(20).all()
