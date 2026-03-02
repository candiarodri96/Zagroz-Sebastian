from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.models import User
from app.core.security import verify_password, hash_password


# =========================
# GET USER BY ID
# =========================
def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


# =========================
# UPDATE EMAIL
# =========================
def update_user_email(db: Session, user: User, new_email: str) -> User:
    existing_user = db.query(User).filter(User.email == new_email).first()

    if existing_user and existing_user.id != user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already in use",
        )

    user.email = new_email
    db.commit()
    db.refresh(user)

    return user


# =========================
# CHANGE PASSWORD
# =========================
def change_user_password(
    db: Session,
    user: User,
    old_password: str,
    new_password: str,
):
    if not verify_password(old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password",
        )

    user.password_hash = hash_password(new_password)
    db.commit()


# =========================
# DELETE USER
# =========================
def delete_user(db: Session, user: User):
    db.delete(user)
    db.commit()