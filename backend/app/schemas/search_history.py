from pydantic import BaseModel
from datetime import datetime


class SearchHistoryResponse(BaseModel):
    id: int
    city_name: str
    country: str | None
    searched_at: datetime

    class Config:
        from_attributes = True