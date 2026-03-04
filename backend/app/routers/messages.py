from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import Ad, Offer, Message, User
from app.schemas.message import MessageCreate, MessageOut
from app.core.auth import get_current_user
from app.services.notifications import create_notification

router = APIRouter()


def get_negotiation_parties(db: Session, ad_id: int) -> tuple[int, int]:
    """Returns (customer_id, company_id) for the active negotiation."""
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    selected_offer = (
        db.query(Offer)
        .filter(Offer.ad_id == ad_id, Offer.status == "selected")
        .first()
    )
    if not selected_offer:
        raise HTTPException(status_code=400, detail="No active negotiation on this ad")

    return ad.user_id, selected_offer.user_id


# =========================
# SEND MESSAGE
# =========================
@router.post("/{ad_id}/messages", response_model=MessageOut)
def send_message(
    ad_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    if ad.status not in ("negotiation", "active_contract"):
        raise HTTPException(
            status_code=400,
            detail=f"Chat is only available during negotiation or active contract. Current: '{ad.status}'",
        )

    customer_id, company_id = get_negotiation_parties(db, ad_id)
    if current_user.id not in (customer_id, company_id):
        raise HTTPException(status_code=403, detail="You are not part of this negotiation")

    message = Message(
        ad_id=ad_id,
        sender_id=current_user.id,
        content=data.content,
    )
    db.add(message)

    # Notify the other party
    other_id = company_id if current_user.id == customer_id else customer_id
    create_notification(
        db,
        user_id=other_id,
        ad_id=ad_id,
        type="new_message",
        title="New message",
        message=f"{current_user.first_name}: {data.content[:80]}{'...' if len(data.content) > 80 else ''}",
    )

    db.commit()
    db.refresh(message)

    return MessageOut(
        id=message.id,
        ad_id=message.ad_id,
        sender_id=message.sender_id,
        sender_name=f"{current_user.first_name} {current_user.last_name}",
        content=message.content,
        created_at=message.created_at,
    )


# =========================
# GET MESSAGES
# =========================
@router.get("/{ad_id}/messages", response_model=List[MessageOut])
def get_messages(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    customer_id, company_id = get_negotiation_parties(db, ad_id)
    if current_user.id not in (customer_id, company_id):
        raise HTTPException(status_code=403, detail="You are not part of this negotiation")

    messages = (
        db.query(Message)
        .filter(Message.ad_id == ad_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    result = []
    for msg in messages:
        sender = db.query(User).filter(User.id == msg.sender_id).first()
        result.append(
            MessageOut(
                id=msg.id,
                ad_id=msg.ad_id,
                sender_id=msg.sender_id,
                sender_name=f"{sender.first_name} {sender.last_name}" if sender else "Unknown",
                content=msg.content,
                created_at=msg.created_at,
            )
        )

    return result