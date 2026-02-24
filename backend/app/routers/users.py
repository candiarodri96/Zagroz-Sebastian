from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import queries
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.models.models import User
from app.core.security import verify_password, create_access_token

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
    
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(
        data={"sub": str(db_user.id)}
    )
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
