from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# =========================
# CREATE
# =========================
class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


# =========================
# OUTPUT
# =========================
class MessageOut(BaseModel):
    id: int
    ad_id: int
    sender_id: int
    sender_name: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# CONVERSATION (for /conversations list)
# =========================
class ConversationOut(BaseModel):
    ad_id: int
    ad_title: str
    other_user_id: Optional[int]
    other_user_name: str
    last_message: Optional[str]
    last_message_at: Optional[datetime]
    has_unread: bool