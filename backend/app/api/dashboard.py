from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User, FarmerCrop, FarmingActivity, DiseasePrediction, Notification
from backend.app.services.weather_service import fetch_weather_advisory
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Farmer Dashboard"])

@router.get("")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Farmer Crops
    crops = db.query(FarmerCrop).filter(FarmerCrop.user_id == current_user.id).all()
    total_area = sum(c.farm_area_acres for c in crops) if crops else 0.0

    # 2. Farming Activities Summary
    activities = db.query(FarmingActivity).filter(
        FarmingActivity.user_id == current_user.id
    ).order_by(FarmingActivity.activity_date.desc()).all()

    organic_count = sum(1 for a in activities if a.is_organic)
    chemical_count = sum(1 for a in activities if not a.is_organic)
    total_cost = sum(a.cost for a in activities)

    # Upcoming Reminders
    reminders = [
        {
            "id": a.id,
            "crop": a.crop_name,
            "treatment": a.product_used or a.activity_type,
            "date": a.follow_up_date,
            "status": a.status
        }
        for a in activities if a.follow_up_date and a.status == "Pending"
    ]

    # 3. Recent Disease Detections
    predictions = db.query(DiseasePrediction).filter(
        (DiseasePrediction.user_id == current_user.id) | (DiseasePrediction.user_id == None)
    ).order_by(DiseasePrediction.created_at.desc()).limit(3).all()

    # 4. Unread Notifications
    unread_notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).order_by(Notification.created_at.desc()).limit(5).all()

    # 5. Weather Snapshot for farmer's district
    weather_data = await fetch_weather_advisory(district_name=current_user.district)

    return {
        "farmer": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "mobile": current_user.mobile,
            "state": current_user.state,
            "district": current_user.district,
            "language": current_user.preferred_language
        },
        "stats": {
            "total_crops": len(crops),
            "total_acres": round(total_area, 2),
            "total_activities": len(activities),
            "organic_treatments": organic_count,
            "chemical_treatments": chemical_count,
            "total_expenditure": round(total_cost, 2),
            "unread_alerts": len(unread_notifs)
        },
        "crops": [
            {
                "id": c.id,
                "crop_name": c.crop_name,
                "variety": c.variety,
                "farming_type": c.farming_type,
                "farm_area_acres": c.farm_area_acres,
                "stage": c.stage,
                "sowing_date": c.sowing_date
            }
            for c in crops
        ],
        "recent_activities": [
            {
                "id": a.id,
                "crop_name": a.crop_name,
                "activity_date": a.activity_date,
                "activity_type": a.activity_type,
                "product_used": a.product_used,
                "is_organic": a.is_organic,
                "cost": a.cost,
                "status": a.status
            }
            for a in activities[:5]
        ],
        "reminders": reminders,
        "recent_diagnoses": [
            {
                "id": p.id,
                "crop_name": p.crop_name,
                "disease_name": p.disease_name,
                "confidence": p.confidence,
                "severity": p.severity,
                "created_at": p.created_at.strftime("%d-%b-%Y") if p.created_at else None
            }
            for p in predictions
        ],
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "category": n.category,
                "created_at": n.created_at.strftime("%d-%b") if n.created_at else None
            }
            for n in unread_notifs
        ],
        "weather": {
            "district": weather_data["district"],
            "state": weather_data["state"],
            "current": weather_data["current"],
            "spraying_advisory": weather_data["spraying_advisory"]
        }
    }
