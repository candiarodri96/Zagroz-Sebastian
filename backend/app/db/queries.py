from sqlalchemy.orm import Session
from app.models.models import User, Ad, Offer

def create_user(db: Session, first_name: str, last_name: str, email: str, password_hash: str):
    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=password_hash
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_ad(db: Session, title: str, category: str, location: str, budget: int, description: str, user_id: int):
    ad = Ad(
        title=title,
        category=category,
        location=location,
        budget=budget,
        description=description,
        user_id=user_id
    )
    db.add(ad)
    db.commit()
    db.refresh(ad)
    return ad

def create_offer(db: Session, ad_id: int, user_id: int, amount: int, message: str | None = None):
    offer = Offer(
        ad_id=ad_id,
        user_id=user_id,
        amount=amount,
        message=message
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer




