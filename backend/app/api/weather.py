from fastapi import APIRouter

from app.services.weather_service import get_current_weather, get_forecast

router = APIRouter()

@router.get("/weather/current")
def current_weather(city: str):
    return get_current_weather(city)

@router.get("/weather/forecast")
def forecast(city: str):
    return get_forecast(city)