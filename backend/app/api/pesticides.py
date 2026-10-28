from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import Pesticide
from backend.app.schemas.schemas import PesticideResponse

router = APIRouter(prefix="/pesticides", tags=["Smart Pesticide Advisory"])

@router.get("", response_model=List[PesticideResponse])
def get_pesticides(
    crop: Optional[str] = Query(None, description="Filter by registered crop"),
    pest: Optional[str] = Query(None, description="Filter by target pest or disease"),
    category: Optional[str] = Query(None, description="Insecticide, Fungicide, Herbicide"),
    toxicity: Optional[str] = Query(None, description="Green, Blue, Yellow, Red"),
    search: Optional[str] = Query(None, description="General search keyword"),
    db: Session = Depends(get_db)
):
    query = db.query(Pesticide)

    if crop and crop.strip():
        query = query.filter(Pesticide.registered_crops.ilike(f"%{crop.strip()}%"))

    if pest and pest.strip():
        query = query.filter(Pesticide.target_pests.ilike(f"%{pest.strip()}%"))

    if category and category.strip():
        query = query.filter(Pesticide.category.ilike(f"%{category.strip()}%"))

    if toxicity and toxicity.strip():
        query = query.filter(Pesticide.toxicity_band.ilike(f"%{toxicity.strip()}%"))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (Pesticide.brand_name.ilike(term)) |
            (Pesticide.technical_name.ilike(term)) |
            (Pesticide.target_pests.ilike(term)) |
            (Pesticide.registered_crops.ilike(term))
        )

    return query.all()

@router.get("/{pesticide_id}", response_model=PesticideResponse)
def get_pesticide_by_id(pesticide_id: int, db: Session = Depends(get_db)):
    pesticide = db.query(Pesticide).filter(Pesticide.id == pesticide_id).first()
    if not pesticide:
        raise HTTPException(status_code=404, detail="Pesticide label not found in CIBRC registry.")
    return pesticide
