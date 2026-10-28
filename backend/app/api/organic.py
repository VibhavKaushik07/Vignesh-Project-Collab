from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import OrganicAlternative
from backend.app.schemas.schemas import OrganicAlternativeResponse

router = APIRouter(prefix="/organic", tags=["Organic Alternatives"])

@router.get("", response_model=List[OrganicAlternativeResponse])
def get_organic_alternatives(
    crop: Optional[str] = Query(None, description="Filter by crop"),
    pest: Optional[str] = Query(None, description="Filter by target pest"),
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Search keyword"),
    db: Session = Depends(get_db)
):
    query = db.query(OrganicAlternative)

    if crop and crop.strip():
        query = query.filter(OrganicAlternative.suitable_crops.ilike(f"%{crop.strip()}%"))

    if pest and pest.strip():
        query = query.filter(OrganicAlternative.target_pests.ilike(f"%{pest.strip()}%"))

    if category and category.strip():
        query = query.filter(OrganicAlternative.category.ilike(f"%{category.strip()}%"))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (OrganicAlternative.name.ilike(term)) |
            (OrganicAlternative.category.ilike(term)) |
            (OrganicAlternative.target_pests.ilike(term)) |
            (OrganicAlternative.suitable_crops.ilike(term))
        )

    return query.all()

@router.get("/{id}", response_model=OrganicAlternativeResponse)
def get_organic_detail(id: int, db: Session = Depends(get_db)):
    item = db.query(OrganicAlternative).filter(OrganicAlternative.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Organic method not found.")
    return item
