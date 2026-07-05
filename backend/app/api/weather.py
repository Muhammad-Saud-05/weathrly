from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services.weather_service import get_current_weather, get_forecast
from app.db.database import SessionLocal
from app.models.search_history import SearchHistory
from app.dependencies import get_current_user

router = APIRouter(prefix="/weather", tags=["Weather"])


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CURRENT WEATHER
@router.get("/current")
def current_weather(
    city: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    result = get_current_weather(city)

    if "status_code" in result:
        return result

    history = SearchHistory(
        user_id=current_user.id,
        city_name=result["city"],
        country=result["country"]
    )

    db.add(history)
    db.commit()

    return result


# FORECAST
@router.get("/forecast")
def forecast(city: str):
    return get_forecast(city)