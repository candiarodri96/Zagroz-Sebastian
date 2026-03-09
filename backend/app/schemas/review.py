from pydantic import BaseModel, Field
from datetime import datetime


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    contract_id: int
    ad_id: int
    reviewer_id: int
    reviewee_id: int
    reviewer_name: str = ""
    ad_title: str = ""
    rating: int
    comment: str | None
    created_at: datetime

    model_config = {"from_attributes": True}