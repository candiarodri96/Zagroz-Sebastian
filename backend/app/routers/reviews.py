from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import Contract, Review, User, Ad
from app.schemas.review import ReviewCreate, ReviewOut
from app.core.auth import get_current_user
from app.services.notifications import create_notification

router = APIRouter()


# =========================
# CREATE REVIEW (only after contract is completed)
# =========================
@router.post("/ads/{ad_id}/review", response_model=ReviewOut)
def create_review(
    ad_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.execute(
        select(Contract).where(Contract.ad_id == ad_id)
    ).scalars().first()

    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if contract.status != "completed":
        raise HTTPException(status_code=400, detail="Can only review after the contract is completed")

    if current_user.id not in (contract.customer_id, contract.company_id):
        raise HTTPException(status_code=403, detail="You are not a party to this contract")

    # Determine who is being reviewed
    if current_user.id == contract.customer_id:
        reviewee_id = contract.company_id
    else:
        reviewee_id = contract.customer_id

    # Check if already reviewed
    existing = db.execute(
        select(Review).where(
            Review.contract_id == contract.id,
            Review.reviewer_id == current_user.id,
        )
    ).scalars().first()

    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this contract")

    review = Review(
        contract_id=contract.id,
        ad_id=ad_id,
        reviewer_id=current_user.id,
        reviewee_id=reviewee_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)

    ad = db.execute(select(Ad).where(Ad.id == ad_id)).scalars().first()

    create_notification(
        db,
        user_id=reviewee_id,
        ad_id=ad_id,
        type="new_review",
        title="New review received! ⭐",
        message=f"{current_user.first_name} left a {data.rating}-star review for \"{ad.title}\".",
    )

    db.commit()
    db.refresh(review)

    review.reviewer_name = f"{current_user.first_name} {current_user.last_name}"
    return review


# =========================
# GET REVIEWS FOR A USER (for profile page)
# =========================
@router.get("/users/{user_id}/reviews", response_model=List[ReviewOut])
def get_user_reviews(
    user_id: int,
    db: Session = Depends(get_db),
):
    reviews = db.execute(
        select(Review)
        .where(Review.reviewee_id == user_id)
        .order_by(Review.created_at.desc())
    ).scalars().all()

    result = []
    for review in reviews:
        reviewer = db.execute(
            select(User).where(User.id == review.reviewer_id)
        ).scalars().first()
        review.reviewer_name = f"{reviewer.first_name} {reviewer.last_name}" if reviewer else "Unknown"
        result.append(review)

    return result


# =========================
# GET AVERAGE RATING FOR A USER
# =========================
@router.get("/users/{user_id}/rating")
def get_user_rating(
    user_id: int,
    db: Session = Depends(get_db),
):
    avg = db.execute(
        select(func.avg(Review.rating))
        .where(Review.reviewee_id == user_id)
    ).scalar()

    count = db.execute(
        select(func.count())
        .select_from(Review)
        .where(Review.reviewee_id == user_id)
    ).scalar()

    return {
        "average_rating": round(float(avg), 1) if avg else None,
        "review_count": count,
    }


# =========================
# CHECK IF CURRENT USER HAS REVIEWED
# =========================
@router.get("/ads/{ad_id}/review/mine")
def get_my_review(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.execute(
        select(Contract).where(Contract.ad_id == ad_id)
    ).scalars().first()

    if not contract:
        return {"reviewed": False}

    review = db.execute(
        select(Review).where(
            Review.contract_id == contract.id,
            Review.reviewer_id == current_user.id,
        )
    ).scalars().first()

    if review:
        return {"reviewed": True, "rating": review.rating, "comment": review.comment}

    return {"reviewed": False}