from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.models import Ad, Offer, Contract, User
from app.schemas.contract import ContractCreate, ContractOut
from app.core.auth import get_current_user
from app.services.status_machine import (
    validate_transition,
    AD_TRANSITIONS,
    CONTRACT_TRANSITIONS,
)

router = APIRouter()


# =========================
# CREATE CONTRACT (Phase 4A — from selected offer)
# =========================
@router.post("/{ad_id}/contract", response_model=ContractOut)
def create_contract(
    ad_id: int,
    data: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    if ad.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the ad owner can create a contract")

    if ad.status != "negotiation":
        raise HTTPException(status_code=400, detail=f"Ad must be in 'negotiation'. Current: '{ad.status}'")

    existing = db.query(Contract).filter(Contract.ad_id == ad_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Contract already exists for this ad")

    selected_offer = (
        db.query(Offer)
        .filter(Offer.ad_id == ad_id, Offer.status == "selected")
        .first()
    )
    if not selected_offer:
        raise HTTPException(status_code=400, detail="No selected offer found")

    contract = Contract(
        ad_id=ad_id,
        offer_id=selected_offer.id,
        customer_id=ad.user_id,
        company_id=selected_offer.user_id,
        agreed_amount=selected_offer.amount,
        details=data.details,
    )

    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


# =========================
# SIGN CONTRACT (Phase 4A — each party signs)
# =========================
@router.patch("/{ad_id}/contract/sign", response_model=ContractOut)
def sign_contract(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.ad_id == ad_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if current_user.id not in (contract.customer_id, contract.company_id):
        raise HTTPException(status_code=403, detail="You are not a party to this contract")

    current_status = contract.status

    if current_user.id == contract.company_id:
        if current_status == "draft":
            new_status = "signed_by_company"
        elif current_status == "signed_by_customer":
            new_status = "fully_signed"
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Company cannot sign when contract is '{current_status}'",
            )
    else:
        if current_status == "draft":
            new_status = "signed_by_customer"
        elif current_status == "signed_by_company":
            new_status = "fully_signed"
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Customer cannot sign when contract is '{current_status}'",
            )

    validate_transition(current_status, new_status, CONTRACT_TRANSITIONS, "Contract")
    contract.status = new_status

    if new_status == "fully_signed":
        contract.signed_at = datetime.now(timezone.utc)

        ad = db.query(Ad).filter(Ad.id == ad_id).first()
        ad.status = "active_contract"

        other_offers = (
            db.query(Offer)
            .filter(
                Offer.ad_id == ad_id,
                Offer.id != contract.offer_id,
                Offer.status.in_(["pending", "selected"]),
            )
            .all()
        )
        for offer in other_offers:
            offer.status = "rejected"

    db.commit()
    db.refresh(contract)
    return contract


# =========================
# CANCEL CONTRACT
# =========================
@router.patch("/{ad_id}/contract/cancel", response_model=ContractOut)
def cancel_contract(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.ad_id == ad_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if current_user.id not in (contract.customer_id, contract.company_id):
        raise HTTPException(status_code=403, detail="You are not a party to this contract")

    validate_transition(contract.status, "cancelled", CONTRACT_TRANSITIONS, "Contract")

    contract.status = "cancelled"

    offer = db.query(Offer).filter(Offer.id == contract.offer_id).first()
    if offer:
        offer.status = "failed_negotiation"

    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if ad:
        ad.status = "open"

    db.commit()
    db.refresh(contract)
    return contract


# =========================
# COMPLETE CONTRACT (Phase 5)
# =========================
@router.patch("/{ad_id}/contract/complete", response_model=ContractOut)
def complete_contract(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.ad_id == ad_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if current_user.id != contract.customer_id:
        raise HTTPException(status_code=403, detail="Only the customer can mark work as completed")

    validate_transition(contract.status, "completed", CONTRACT_TRANSITIONS, "Contract")

    contract.status = "completed"

    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if ad:
        ad.status = "closed"

    db.commit()
    db.refresh(contract)
    return contract


# =========================
# GET CONTRACT
# =========================
@router.get("/{ad_id}/contract", response_model=ContractOut)
def get_contract(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    contract = db.query(Contract).filter(Contract.ad_id == ad_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")

    if current_user.id not in (contract.customer_id, contract.company_id):
        raise HTTPException(status_code=403, detail="You are not a party to this contract")

    return contract