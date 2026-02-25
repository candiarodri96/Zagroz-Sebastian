from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.models import Ad, Offer, User
from app.schemas.ad import AdCreate, AdUpdate


# =========================
# CREATE AD
# =========================
def create_ad(db: Session, ad_data: AdCreate, current_user: User) -> Ad:
    new_ad = Ad(
        **ad_data.model_dump(),
        user_id=current_user.id
    )

    db.add(new_ad)
    db.commit()
    db.refresh(new_ad)

    return new_ad


# =========================
# GET AD BY ID
# =========================
def get_ad_by_id(db: Session, ad_id: int) -> Ad:
    ad = db.query(Ad).filter(Ad.id == ad_id).first()

    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ad not found",
        )

    return ad


# =========================
# UPDATE AD
# =========================
def update_ad(
    db: Session,
    ad_id: int,
    ad_data: AdUpdate,
    current_user: User,
) -> Ad:

    ad = get_ad_by_id(db, ad_id)

    # 🔐 Owner check
    if ad.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this ad",
        )

    update_data = ad_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(ad, key, value)

    db.commit()
    db.refresh(ad)

    return ad


# =========================
# DELETE AD
# =========================
def delete_ad(
    db: Session,
    ad_id: int,
    current_user: User,
):

    ad = get_ad_by_id(db, ad_id)

    # 🔐 Owner check
    if ad.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this ad",
        )

    db.delete(ad)
    db.commit()


# =========================
# CHECK IF MATCHED (FOR ADDRESS REVEAL)
# =========================
def is_matched(db: Session, ad: Ad, current_user: User) -> bool:
    """
    Returns True if:
    - current_user is the ad owner
    - OR current_user has an accepted offer for this ad
    """

    # Ad owner should always see address
    if ad.user_id == current_user.id:
        return True

    match = db.query(Offer).filter(
        Offer.ad_id == ad.id,
        Offer.status == "accepted",
        Offer.user_id == current_user.id
    ).first()

    return match is not None