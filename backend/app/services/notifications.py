from sqlalchemy.orm import Session
from app.models.models import Notification


def create_notification(
    db: Session,
    user_id: int,
    ad_id: int | None,
    type: str,
    title: str,
    message: str,
):
    notification = Notification(
        user_id=user_id,
        ad_id=ad_id,
        type=type,
        title=title,
        message=message,
    )
    db.add(notification)
    # Don't commit here — let the calling function commit
    return notification