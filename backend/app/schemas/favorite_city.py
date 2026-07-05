from pydantic import BaseModel


class FavoriteCityCreate(BaseModel):
    city_name: str
    country: str | None = None


class FavoriteCityResponse(BaseModel):
    id: int
    city_name: str
    country: str | None
    user_id: int

    class Config:
        from_attributes = True