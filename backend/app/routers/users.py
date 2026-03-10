from fastapi import APIRouter, Depends
from sqlalchemy import select, or_
from sqlalchemy.orm import Session
from typing import List

from app.models.models import User, Contract
from app.core.auth import get_current_user
from app.db.database import get_db
from app.schemas.user import UserUpdate, ChangePassword, UserOut
from app.schemas.contract import ContractOut
from app.services import user_services

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# =========================
# GET CURRENT USER
# =========================
@router.get("/me", response_model=UserOut)
def read_current_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


# =========================
# UPDATE EMAIL
# =========================
@router.put("/me", response_model=UserOut)
def update_current_user(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return user_services.update_user_email(
        db=db,
        user=current_user,
        new_email=data.email,
    )


# =========================
# CHANGE PASSWORD
# =========================
@router.patch("/change-password")
def change_password(
    data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_services.change_user_password(
        db=db,
        user=current_user,
        old_password=data.old_password,
        new_password=data.new_password,
    )

    return {"message": "Password updated successfully"}


# =========================
# DELETE USER
# =========================
@router.delete("/me")
def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_services.delete_user(db=db, user=current_user)

    return {"message": "User deleted successfully"}


# =========================
# GET MY CONTRACTS
# =========================
@router.get("/me/contracts", response_model=List[ContractOut])
def get_my_contracts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contracts = db.execute(
        select(Contract).where(
            or_(
                Contract.customer_id == current_user.id,
                Contract.company_id == current_user.id,
            )
        ).order_by(Contract.created_at.desc())
    ).scalars().all()
    return contracts