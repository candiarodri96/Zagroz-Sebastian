from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Ad, User
from app.schemas.ad import AdCreate, AdPublicOut, AdMatchedOut
from app.core.auth import get_current_user

router = APIRouter()


# =========================
# CREATE AD
# =========================
@router.post("/", response_model=AdPublicOut)
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


# =========================
# UPDATE AD
# =========================
@router.put("/{ad_id}", response_model=AdPublicOut)
def update_ad(
    ad_id: int,
    ad_data: AdCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()

    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    # 🔐 Ägarkontroll
    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this ad")

    for key, value in ad_data.model_dump().items():
        setattr(ad, key, value)

    db.commit()
    db.refresh(ad)

    return ad


# =========================
# DELETE AD
# =========================
@router.delete("/{ad_id}")
def delete_ad(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()

    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    # 🔐 Ägarkontroll
    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this ad")

    db.delete(ad)
    db.commit()

    return {"message": "Ad deleted successfully"}

# =========================
# GET AD
# =========================
@router.get("/{ad_id}", response_model=AdPublicOut)
def get_ad(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()

    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    # Owner can always see address
    if ad.user_id == current_user.id:
        return AdMatchedOut.model_validate(ad)

    # Check accepted offer
    #match = db.query(Offer).filter(
     #   Offer.ad_id == ad.id,
      #  Offer.status == "accepted",
       # Offer.user_id == current_user.id
    #).first()

    #if match:
      #  return AdMatchedOut.model_validate(ad)

    return AdPublicOut.model_validate(ad)