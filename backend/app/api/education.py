from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import EducationalResource
from backend.app.schemas.schemas import EducationalResourceResponse

router = APIRouter(prefix="/education", tags=["Organic Farming Awareness Hub"])

@router.get("", response_model=List[EducationalResourceResponse])
def get_articles(
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Search term in title, summary or tags"),
    db: Session = Depends(get_db)
):
    query = db.query(EducationalResource)

    if category and category.strip() and category != "All":
        query = query.filter(EducationalResource.category.ilike(f"%{category.strip()}%"))

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (EducationalResource.title.ilike(term)) |
            (EducationalResource.summary.ilike(term)) |
            (EducationalResource.tags.ilike(term))
        )

    return query.all()

@router.get("/{id}", response_model=EducationalResourceResponse)
def get_article_detail(id: int, db: Session = Depends(get_db)):
    article = db.query(EducationalResource).filter(EducationalResource.id == id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Educational resource not found.")
    return article
