from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Ad, User
from app.schemas.ad import AdCreate, AdOut
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=AdOut)
def create_ad(
    ad: AdCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_ad = Ad(
        **ad.model_dump(),
        user_id=current_user.id
    )

    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)

    return new_ad