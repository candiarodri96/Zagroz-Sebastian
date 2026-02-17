from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from db import queries
from schemas.user import UserCreate, UserOut, UserLogin
from models.models import User

router = APIRouter()

@router.post("/register", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return queries.create_user(
        db,
        username=user.username,
        email=user.email,
        password_hash=user.password_hash
    )

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if db_user.password_hash != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": db_user.id, "username": db_user.username}