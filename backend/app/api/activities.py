from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, FarmingActivity
from backend.app.schemas.schemas import FarmingActivityCreate, FarmingActivityUpdate, FarmingActivityResponse
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/activities", tags=["Farming Activity Tracker"])

@router.get("", response_model=List[FarmingActivityResponse])
def get_activities(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    is_organic: Optional[bool] = Query(None, description="Filter organic vs chemical"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(FarmingActivity).filter(FarmingActivity.user_id == current_user.id)
    if crop and crop.strip():
        query = query.filter(FarmingActivity.crop_name.ilike(f"%{crop.strip()}%"))
    if is_organic is not None:
        query = query.filter(FarmingActivity.is_organic == is_organic)
    return query.order_by(FarmingActivity.activity_date.desc()).all()

@router.post("", response_model=FarmingActivityResponse)
def log_activity(
    activity_in: FarmingActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity = FarmingActivity(
        user_id=current_user.id,
        crop_name=activity_in.crop_name,
        activity_date=activity_in.activity_date,
        activity_type=activity_in.activity_type,
        pest_disease=activity_in.pest_disease,
        product_used=activity_in.product_used,
        quantity=activity_in.quantity,
        is_organic=activity_in.is_organic,
        cost=activity_in.cost,
        notes=activity_in.notes,
        follow_up_date=activity_in.follow_up_date,
        status=activity_in.status
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

@router.put("/{id}", response_model=FarmingActivityResponse)
def update_activity(
    id: int,
    activity_in: FarmingActivityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity = db.query(FarmingActivity).filter(
        FarmingActivity.id == id,
        FarmingActivity.user_id == current_user.id
    ).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity entry not found.")

    if activity_in.crop_name is not None:
        activity.crop_name = activity_in.crop_name
    if activity_in.activity_date is not None:
        activity.activity_date = activity_in.activity_date
    if activity_in.activity_type is not None:
        activity.activity_type = activity_in.activity_type
    if activity_in.pest_disease is not None:
        activity.pest_disease = activity_in.pest_disease
    if activity_in.product_used is not None:
        activity.product_used = activity_in.product_used
    if activity_in.quantity is not None:
        activity.quantity = activity_in.quantity
    if activity_in.is_organic is not None:
        activity.is_organic = activity_in.is_organic
    if activity_in.cost is not None:
        activity.cost = activity_in.cost
    if activity_in.notes is not None:
        activity.notes = activity_in.notes
    if activity_in.follow_up_date is not None:
        activity.follow_up_date = activity_in.follow_up_date
    if activity_in.status is not None:
        activity.status = activity_in.status

    db.commit()
    db.refresh(activity)
    return activity

@router.delete("/{id}")
def delete_activity(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    activity = db.query(FarmingActivity).filter(
        FarmingActivity.id == id,
        FarmingActivity.user_id == current_user.id
    ).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity entry not found.")

    db.delete(activity)
    db.commit()
    return {"status": "success", "message": "Activity record removed."}
