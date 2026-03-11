from datetime import datetime, date
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# =========================
# CATEGORY ENUM
# =========================
class CategoryEnum(str, Enum):
    renovation = "renovation"
    construction = "construction"
    plumbing = "plumbing"
    electrical = "electrical"
    painting = "painting"
    roofing = "roofing"
    cleaning = "cleaning"
    landscaping = "landscaping"
    moving = "moving"
    other = "other"


# =========================
# CREATE
# =========================
class AdCreate(BaseModel):
    title: str = Field(min_length=5, max_length=200)
    category: CategoryEnum
    city: str = Field(min_length=2, max_length=100)
    address: str = Field(min_length=2, max_length=200)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: str = Field(min_length=10)


# =========================
# UPDATE
# =========================
class AdUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=5, max_length=200)
    category: Optional[CategoryEnum] = None
    city: Optional[str] = Field(default=None, min_length=2, max_length=100)
    address: Optional[str] = Field(default=None, min_length=2, max_length=200)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = Field(default=None, min_length=10)
    status: Optional[str] = None


# =========================
# PUBLIC OUTPUT (NO ADDRESS)
# =========================
class AdPublicOut(BaseModel):
    id: int
    title: str
    category: CategoryEnum
    city: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: str
    status: str
    created_at: datetime
    user_id: int
    owner_name: str | None = None

    class Config:
        from_attributes = True


# =========================
# MATCHED OUTPUT (WITH ADDRESS)
# =========================
class AdMatchedOut(AdPublicOut):
    address: Optional[str] = None