from fastapi import APIRouter, Query
from backend.app.services.weather_service import fetch_weather_advisory

router = APIRouter(prefix="/weather", tags=["Weather-Based Spraying Advisory"])

@router.get("")
async def get_weather(
    district: str = Query("Bengaluru Rural", description="District name for localized forecast")
):
    advisory = await fetch_weather_advisory(district_name=district)
    return advisory
