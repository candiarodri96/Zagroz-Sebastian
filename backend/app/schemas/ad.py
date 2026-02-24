from datetime import datetime
from pydantic import BaseModel, Field


# =========================
# CREATE
# =========================
class AdCreate(BaseModel):
    title: str = Field(min_length=5, max_length=200)
    category: str = Field(min_length=2, max_length=50)
    location: str = Field(min_length=2, max_length=100)
    budget: int = Field(gt=0)
    description: str = Field(min_length=10)


# =========================
# UPDATE
# =========================
class AdUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=5, max_length=200)
    category: str | None = Field(default=None, min_length=2, max_length=50)
    location: str | None = Field(default=None, min_length=2, max_length=100)
    budget: int | None = Field(default=None, gt=0)
    description: str | None = Field(default=None, min_length=10)
    status: str | None = None


# =========================
# OUTPUT
# =========================
class AdOut(BaseModel):
    id: int
    title: str
    category: str
    location: str
    budget: int
    description: str
    status: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
