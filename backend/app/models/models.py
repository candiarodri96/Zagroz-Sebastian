from datetime import datetime, timezone
from sqlalchemy import Integer, Text, String, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


def utc_now():
    return datetime.now(timezone.utc)


# =========================
# USER
# =========================
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    ads = relationship("Ad", back_populates="user", cascade="all, delete")
    offers = relationship("Offer", back_populates="user", cascade="all, delete")


# =========================
# AD
# =========================
class Ad(Base):
    __tablename__ = "ads"
    __table_args__ = (
        CheckConstraint(
            "status IN ('open', 'negotiation', 'active_contract', 'closed')",
            name="ck_ad_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    budget: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[str] = mapped_column(String(50), nullable=False, default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # Relationships
    user = relationship("User", back_populates="ads")
    offers = relationship("Offer", back_populates="ad", cascade="all, delete")
    contract = relationship("Contract", back_populates="ad", uselist=False, cascade="all, delete")
    messages = relationship("Message", back_populates="ad", cascade="all, delete")


# =========================
# OFFER
# =========================
class Offer(Base):
    __tablename__ = "offers"
    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'withdrawn', 'selected', 'failed_negotiation', 'rejected', 'revised')",
            name="ck_offer_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ad_id: Mapped[int] = mapped_column(ForeignKey("ads.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    estimated_time: Mapped[str | None] = mapped_column(String(100), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)

    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    ad = relationship("Ad", back_populates="offers")
    user = relationship("User", back_populates="offers")


# =========================
# CONTRACT
# =========================
class Contract(Base):
    __tablename__ = "contracts"
    __table_args__ = (
        CheckConstraint(
            "status IN ('draft', 'signed_by_company', 'signed_by_customer', 'fully_signed', 'completed', 'cancelled')",
            name="ck_contract_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    ad_id: Mapped[int] = mapped_column(
        ForeignKey("ads.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    offer_id: Mapped[int] = mapped_column(
        ForeignKey("offers.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    company_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    agreed_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(String(30), default="draft", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)
    signed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    ad = relationship("Ad", back_populates="contract")
    offer = relationship("Offer")
    customer = relationship("User", foreign_keys=[customer_id])
    company = relationship("User", foreign_keys=[company_id])


# =========================
# MESSAGE (Negotiation Chat)
# =========================
class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    ad_id: Mapped[int] = mapped_column(
        ForeignKey("ads.id", ondelete="CASCADE"), nullable=False, index=True
    )
    sender_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, nullable=False
    )

    # Relationships
    ad = relationship("Ad", back_populates="messages")
    sender = relationship("User")
