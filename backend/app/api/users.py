from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.models.user import User
from app.db.database import SessionLocal
from app.core.security import hash_password

from app.schemas.auth import LoginRequest
from app.core.security import verify_password
from app.core.jwt import create_access_token

router = APIRouter()

# Dependency: gives DB session to each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    }

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        return {"error": "Invalid credentials"}

    if not verify_password(request.password, user.hashed_password):
        return {"error": "Invalid credentials"}

    token = create_access_token(
        data={"user_id": user.id, "email": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }