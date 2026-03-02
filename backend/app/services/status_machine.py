from fastapi import HTTPException, status
# Status changes depending on whether the customer and the company reach an agreement
# =========================
# VALID TRANSITIONS
# =========================
AD_TRANSITIONS = {
    "open": ["negotiation", "closed"],
    "negotiation": ["open", "active_contract"],
    "active_contract": ["closed"],
    "closed": [],
}

OFFER_TRANSITIONS = {
    "pending": ["withdrawn", "selected", "rejected", "revised"],
    "withdrawn": [],
    "selected": ["failed_negotiation", "rejected"],
    "failed_negotiation": [],
    "rejected": [],
    "revised": [],
}

CONTRACT_TRANSITIONS = {
    "draft": ["signed_by_company", "signed_by_customer", "cancelled"],
    "signed_by_company": ["fully_signed", "cancelled"],
    "signed_by_customer": ["fully_signed", "cancelled"],
    "fully_signed": ["completed"],
    "completed": [],
    "cancelled": [],
}


def validate_transition(current: str, new: str, transitions: dict, entity: str = "Entity"):
    """Raises HTTPException if the status transition is not allowed."""
    allowed = transitions.get(current, [])
    if new not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{entity} cannot go from '{current}' to '{new}'. Allowed: {allowed}",
        )