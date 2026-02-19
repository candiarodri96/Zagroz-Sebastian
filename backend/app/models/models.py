from datetime import datetime
from sqlalchemy import Integer,Text, String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base




class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="user")
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    ads = relationship("Ad", back_populates="user", cascade="all, delete")
    offers = relationship("Offer", back_populates="user", cascade="all, delete")

class Ad(Base):
    __tablename__ = "ads"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    location: Mapped[str] = mapped_column(String(100), nullable=False)
    budget: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[str] = mapped_column(
        String(50),
         nullable=False,
           default="open"
           )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        nullable=False
        )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), ondelete="CASCADE",
          nullable=False,
          index=True
          )
    # Relationships
    user = relationship("User", back_populates="ads")
    offers = relationship("Offer", back_populates="ad", cascade="all, delete")



class Offer(Base):
    __tablename__ = "offers"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ad_id: Mapped[int] = mapped_column(ForeignKey("ads.id"), ondelete="CASCADE", nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), ondelete="CASCADE", nullable=False, index=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        nullable=False
        )
    status: Mapped[str] = mapped_column(
        String(20),
        default="pending",
        nullable=False
    )
    # Relationships
    ad = relationship("Ad", back_populates="offers")
    user = relationship("User", back_populates="offers")
