from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, FarmerCrop
from backend.app.schemas.schemas import FarmerCropCreate, FarmerCropUpdate, FarmerCropResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/crops", tags=["Crop Management"])

@router.get("", response_model=List[FarmerCropResponse])
def get_user_crops(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(FarmerCrop).filter(FarmerCrop.user_id == current_user.id).all()

@router.post("", response_model=FarmerCropResponse)
def add_user_crop(
    crop_in: FarmerCropCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crop = FarmerCrop(
        user_id=current_user.id,
        crop_name=crop_in.crop_name,
        variety=crop_in.variety,
        farming_type=crop_in.farming_type,
        farm_area_acres=crop_in.farm_area_acres,
        sowing_date=crop_in.sowing_date,
        stage=crop_in.stage,
        notes=crop_in.notes
    )
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop

@router.put("/{crop_id}", response_model=FarmerCropResponse)
def update_user_crop(
    crop_id: int,
    crop_in: FarmerCropUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crop = db.query(FarmerCrop).filter(
        FarmerCrop.id == crop_id,
        FarmerCrop.user_id == current_user.id
    ).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found in your farm profile.")

    if crop_in.crop_name is not None:
        crop.crop_name = crop_in.crop_name
    if crop_in.variety is not None:
        crop.variety = crop_in.variety
    if crop_in.farming_type is not None:
        crop.farming_type = crop_in.farming_type
    if crop_in.farm_area_acres is not None:
        crop.farm_area_acres = crop_in.farm_area_acres
    if crop_in.sowing_date is not None:
        crop.sowing_date = crop_in.sowing_date
    if crop_in.stage is not None:
        crop.stage = crop_in.stage
    if crop_in.notes is not None:
        crop.notes = crop_in.notes

    db.commit()
    db.refresh(crop)
    return crop

@router.delete("/{crop_id}")
def delete_user_crop(
    crop_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crop = db.query(FarmerCrop).filter(
        FarmerCrop.id == crop_id,
        FarmerCrop.user_id == current_user.id
    ).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found in your farm profile.")

    db.delete(crop)
    db.commit()
    return {"status": "success", "message": "Crop removed from your profile."}
