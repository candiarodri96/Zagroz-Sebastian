from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.models import Ad, Offer, Conversation, Message, User
from app.schemas.message import MessageCreate, MessageOut, ConversationOut
from app.core.auth import get_current_user
from app.services.notifications import create_notification

router = APIRouter()


def get_or_create_conversation(db: Session, ad_id: int, current_user: User) -> Conversation:
    """
    Find the existing conversation for an ad, or create it if none exists yet.
    Creation requires that the ad has a selected offer (negotiation started).
    Verifies the current user is one of the two parties.
    """
    conv = db.execute(
        select(Conversation).where(Conversation.ad_id == ad_id)
    ).scalars().first()

    if conv:
        if current_user.id not in (conv.customer_id, conv.company_id):
            raise HTTPException(status_code=403, detail="You are not part of this conversation")
        return conv

    # No conversation yet — look up the two parties
    ad = db.execute(select(Ad).where(Ad.id == ad_id)).scalars().first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")

    selected_offer = db.execute(
        select(Offer).where(Offer.ad_id == ad_id, Offer.status == "selected")
    ).scalars().first()
    if not selected_offer:
        raise HTTPException(
            status_code=400,
            detail="Chat opens once an offer is accepted",
        )

    if current_user.id not in (ad.user_id, selected_offer.user_id):
        raise HTTPException(status_code=403, detail="You are not part of this negotiation")

    conv = Conversation(
        ad_id=ad_id,
        customer_id=ad.user_id,
        company_id=selected_offer.user_id,
    )
    db.add(conv)
    db.flush()  # assigns conv.id without committing yet
    return conv


# =========================
# GET ALL CONVERSATIONS
# =========================
@router.get("/conversations", response_model=List[ConversationOut])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversations = db.execute(
        select(Conversation).where(
            (Conversation.customer_id == current_user.id) |
            (Conversation.company_id == current_user.id)
        )
    ).scalars().all()

    _epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
    result = []

    for conv in conversations:
        ad = db.execute(select(Ad).where(Ad.id == conv.ad_id)).scalars().first()

        other_id = conv.company_id if current_user.id == conv.customer_id else conv.customer_id
        other_user = db.execute(select(User).where(User.id == other_id)).scalars().first()

        last_msg = db.execute(
            select(Message)
            .where(Message.conversation_id == conv.id)
            .order_by(Message.created_at.desc())
        ).scalars().first()

        result.append(ConversationOut(
            ad_id=conv.ad_id,
            ad_title=ad.title if ad else "",
            other_user_id=other_id,
            other_user_name=f"{other_user.first_name} {other_user.last_name}" if other_user else "Unknown",
            last_message=last_msg.content if last_msg else None,
            last_message_at=last_msg.created_at if last_msg else conv.created_at,
            has_unread=last_msg.sender_id != current_user.id if last_msg else False,
        ))

    result.sort(key=lambda c: c.last_message_at or _epoch, reverse=True)
    return result


# =========================
# GET MESSAGES
# =========================
@router.get("/conversations/{ad_id}/messages", response_model=List[MessageOut])
def get_messages(
    ad_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_or_create_conversation(db, ad_id, current_user)
    db.commit()  # persist conversation if it was just created

    messages = db.execute(
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(Message.created_at.asc())
    ).scalars().all()

    result = []
    for msg in messages:
        sender = db.execute(select(User).where(User.id == msg.sender_id)).scalars().first()
        result.append(MessageOut(
            id=msg.id,
            conversation_id=msg.conversation_id,
            sender_id=msg.sender_id,
            sender_name=f"{sender.first_name} {sender.last_name}" if sender else "Unknown",
            content=msg.content,
            created_at=msg.created_at,
        ))

    return result


# =========================
# SEND MESSAGE
# =========================
@router.post("/conversations/{ad_id}/messages", response_model=MessageOut)
def send_message(
    ad_id: int,
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_or_create_conversation(db, ad_id, current_user)

    message = Message(
        conversation_id=conv.id,
        sender_id=current_user.id,
        content=data.content,
    )
    db.add(message)

    other_id = conv.company_id if current_user.id == conv.customer_id else conv.customer_id
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
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        sender_name=f"{current_user.first_name} {current_user.last_name}",
        content=message.content,
        created_at=message.created_at,
    )
