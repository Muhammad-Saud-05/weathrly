from fastapi import FastAPI
from app.db.database import Base, engine
from app.api.users import router as user_router
from app.api.weather import router as weather_router
from dotenv import load_dotenv
from app.models import base
from app.api import favorites

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Weathrly API",
    version="1.0.0"
)

app.include_router(user_router)
app.include_router(weather_router)
app.include_router(favorites.router)

@app.get("/")
def root():
    return {"message": "Weathrly backend is running "}

@app.get("/health")
def health():
    return {"status": "ok"}