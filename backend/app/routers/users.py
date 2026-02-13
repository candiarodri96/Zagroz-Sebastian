from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db import queries
from app.schemas.user import UserCreate, UserOut

router = APIRouter()

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return queries.create_user(
        db,
        username=user.username,
        email=user.email,
        password_hash=user.password_hash
    )
