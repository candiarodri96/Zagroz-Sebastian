from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


# =========================
# CREATE (from selected offer)
# =========================
class ContractCreate(BaseModel):
    details: Optional[str] = Field(None, max_length=2000)


# =========================
# OUTPUT
# =========================
class ContractOut(BaseModel):
    id: int
    ad_id: int
    offer_id: int
    customer_id: int
    company_id: int
    agreed_amount: int
    details: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    signed_at: Optional[datetime] = None

    class Config:
        from_attributes = True