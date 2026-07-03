from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Session = allows to talk to DB (query, insert, etc.)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database tables
Base = declarative_base()

from app.models.user import User