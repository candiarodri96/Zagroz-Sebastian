from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


# =========================
# CREATE
# =========================
class OfferCreate(BaseModel):
    amount: int = Field(gt=0)
    message: Optional[str] = Field(None, max_length=500)


# =========================
# OUTPUT
# =========================
class OfferOut(BaseModel):
    id: int
    ad_id: int
    user_id: int
    amount: int
    message: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True