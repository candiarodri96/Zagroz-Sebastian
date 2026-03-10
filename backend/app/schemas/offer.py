from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import Optional


# =========================
# CREATE
# =========================
class OfferCreate(BaseModel):
    amount: int = Field(gt=0)
    estimated_time: Optional[str] = Field(None, max_length=100)
    available_to_start: Optional[date] = None
    message: Optional[str] = Field(None, max_length=500)


# =========================
# UPDATE (only when pending)
# =========================
class OfferUpdate(BaseModel):
    amount: Optional[int] = Field(None, gt=0)
    estimated_time: Optional[str] = Field(None, max_length=100)
    available_to_start: Optional[date] = None
    message: Optional[str] = Field(None, max_length=500)


# =========================
# OUTPUT
# =========================
class OfferOut(BaseModel):
    id: int
    ad_id: int
    user_id: int
    amount: int
    estimated_time: Optional[str] = None
    available_to_start: Optional[date] = None
    message: Optional[str] = None
    version: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True