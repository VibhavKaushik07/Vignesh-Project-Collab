from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import RegionalAdvisory
from backend.app.schemas.schemas import RegionalAdvisoryResponse

router = APIRouter(prefix="/regional", tags=["Location-Based Agricultural Advisory"])

@router.get("", response_model=List[RegionalAdvisoryResponse])
def get_regional_advisories(
    state: Optional[str] = Query(None, description="State name"),
    district: Optional[str] = Query(None, description="District name"),
    season: Optional[str] = Query(None, description="Kharif, Rabi, Zaid, Annual"),
    crop: Optional[str] = Query(None, description="Crop name"),
    db: Session = Depends(get_db)
):
    query = db.query(RegionalAdvisory)

    if state and state.strip():
        query = query.filter(RegionalAdvisory.state.ilike(f"%{state.strip()}%"))

    if district and district.strip():
        query = query.filter(RegionalAdvisory.district.ilike(f"%{district.strip()}%"))

    if season and season.strip():
        query = query.filter(RegionalAdvisory.season.ilike(f"%{season.strip()}%"))

    if crop and crop.strip():
        query = query.filter(RegionalAdvisory.crop.ilike(f"%{crop.strip()}%"))

    return query.all()
