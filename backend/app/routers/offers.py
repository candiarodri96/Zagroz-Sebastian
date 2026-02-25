from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import Ad, Offer, User
from app.schemas.offer import OfferCreate, OfferOut
from app.core.auth import get_current_user

router = APIRouter()


# CREATE — submit an offer on an ad
@router.post("/{ad_id}/offers", response_model=OfferOut)
def create_offer(
    ad_id: int,
    offer: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if the ad exists
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    # Can't bid on your own ad
    if ad.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot bid on your own ad")

    # Check if user already has a pending offer on this ad
    existing_offer = (
        db.query(Offer)
        .filter(Offer.ad_id == ad_id, Offer.user_id == current_user.id, Offer.status == "pending")
        .first()
    )
    if existing_offer:
        raise HTTPException(status_code=400, detail="You already have a pending offer on this ad")

    new_offer = Offer(
        ad_id=ad_id,
        user_id=current_user.id,
        amount=offer.amount,
        message=offer.message,
    )
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    return new_offer


# READ — get all offers on an ad (only the ad owner can see)
@router.get("/{ad_id}/offers", response_model=List[OfferOut])
def get_offers_for_ad(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the ad owner can view offers")

    return db.query(Offer).filter(Offer.ad_id == ad_id).all()