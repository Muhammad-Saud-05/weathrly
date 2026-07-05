from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.favorite_city import FavoriteCity
from app.schemas.favorite_city import FavoriteCityCreate, FavoriteCityResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/favorites", tags=["Favorites"])


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ADD FAVORITE
@router.post("/", response_model=FavoriteCityResponse)
def add_favorite(
    data: FavoriteCityCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # prevent duplicates
    existing = db.query(FavoriteCity).filter_by(
        user_id=current_user.id,
        city_name=data.city_name
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="City already in favorites")

    fav = FavoriteCity(
        user_id=current_user.id,
        city_name=data.city_name,
        country=data.country
    )

    db.add(fav)
    db.commit()
    db.refresh(fav)

    return fav


# GET ALL FAVORITES
@router.get("/", response_model=list[FavoriteCityResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(FavoriteCity).filter_by(
        user_id=current_user.id
    ).all()


# DELETE FAVORITE
@router.delete("/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    fav = db.query(FavoriteCity).filter_by(
        id=favorite_id,
        user_id=current_user.id
    ).first()

    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()

    return {"message": "Deleted successfully"}