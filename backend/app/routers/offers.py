from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import Ad, Offer, User
from app.schemas.offer import OfferCreate, OfferUpdate, OfferOut
from app.core.auth import get_current_user
from app.services.status_machine import validate_transition, OFFER_TRANSITIONS

router = APIRouter()


# =========================
# CREATE OFFER (Phase 2)
# =========================
@router.post("/{ad_id}/offers", response_model=OfferOut)
def create_offer(
    ad_id: int,
    offer: OfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    if ad.status != "open":
        raise HTTPException(status_code=400, detail=f"Ad is '{ad.status}', not accepting new offers")

    if ad.user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot bid on your own ad")

    existing = (
        db.query(Offer)
        .filter(
            Offer.ad_id == ad_id,
            Offer.user_id == current_user.id,
            Offer.status == "pending",
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="You already have a pending offer on this ad")

    new_offer = Offer(
        ad_id=ad_id,
        user_id=current_user.id,
        amount=offer.amount,
        estimated_time=offer.estimated_time,
        message=offer.message,
    )
    db.add(new_offer)
    db.commit()
    db.refresh(new_offer)
    return new_offer


# =========================
# UPDATE OFFER (Phase 2 — only while pending)
# =========================
@router.put("/{ad_id}/offers/{offer_id}", response_model=OfferOut)
def update_offer(
    ad_id: int,
    offer_id: int,
    data: OfferUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.ad_id == ad_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    if offer.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your offer")

    if offer.status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Cannot update offer with status '{offer.status}'. Only 'pending' offers can be updated.",
        )

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(offer, key, value)

    offer.version += 1
    db.commit()
    db.refresh(offer)
    return offer


# =========================
# WITHDRAW OFFER (Phase 2 — only while pending)
# =========================
@router.patch("/{ad_id}/offers/{offer_id}/withdraw", response_model=OfferOut)
def withdraw_offer(
    ad_id: int,
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.ad_id == ad_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    if offer.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your offer")

    validate_transition(offer.status, "withdrawn", OFFER_TRANSITIONS, "Offer")

    offer.status = "withdrawn"
    db.commit()
    db.refresh(offer)
    return offer


# =========================
# SELECT OFFER (Phase 3 — ad owner picks a company)
# =========================
@router.patch("/{ad_id}/offers/{offer_id}/select", response_model=OfferOut)
def select_offer(
    ad_id: int,
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the ad owner can select an offer")

    if ad.status != "open":
        raise HTTPException(status_code=400, detail=f"Ad is '{ad.status}', must be 'open' to select an offer")

    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.ad_id == ad_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    validate_transition(offer.status, "selected", OFFER_TRANSITIONS, "Offer")

    offer.status = "selected"
    ad.status = "negotiation"

    db.commit()
    db.refresh(offer)
    return offer


# =========================
# FAIL NEGOTIATION (Phase 4B — back to open)
# =========================
@router.patch("/{ad_id}/offers/{offer_id}/fail", response_model=OfferOut)
def fail_negotiation(
    ad_id: int,
    offer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the ad owner can fail a negotiation")

    if ad.status != "negotiation":
        raise HTTPException(status_code=400, detail=f"Ad must be in 'negotiation' to fail. Current: '{ad.status}'")

    offer = db.query(Offer).filter(Offer.id == offer_id, Offer.ad_id == ad_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")

    validate_transition(offer.status, "failed_negotiation", OFFER_TRANSITIONS, "Offer")

    offer.status = "failed_negotiation"
    ad.status = "open"

    db.commit()
    db.refresh(offer)
    return offer


# =========================
# GET OFFERS — ad owner sees all, company sees own
# =========================
@router.get("/{ad_id}/offers", response_model=List[OfferOut])
def get_offers(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    if ad.user_id == current_user.id:
        return db.query(Offer).filter(Offer.ad_id == ad_id).all()

    return (
        db.query(Offer)
        .filter(Offer.ad_id == ad_id, Offer.user_id == current_user.id)
        .all()
    )
