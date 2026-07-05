from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    city_name = Column(String, nullable=False)
    country = Column(String, nullable=True)

    searched_at = Column(DateTime(timezone=True), server_default=func.now())