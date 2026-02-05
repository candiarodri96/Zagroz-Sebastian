from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, declarative_base


base = declarative_base()

class User(base):
 __tablename__ = 'users'
 id = Mapped[int](mapped_column(primary_key=True, autoincrement=True))
 username = Mapped[str](String(50), unique=True, nullable=False)
 email = Mapped[str](String(100), unique=True, nullable=False)
 password_hash = Mapped[str](String(255), nullable=False)

class Post(base):
 __tablename__ = 'posts'
 id = Mapped[int](mapped_column(primary_key=True, autoincrement=True))
 title = Mapped[str](String(200), nullable=False)
 content = Mapped[str](String, nullable=False)
 user_id = Mapped[int](ForeignKey('users.id'), nullable=False)

 class Invoice(base):
     __tablename__ = 'invoices'
     id = Mapped[int](mapped_column(primary_key=True, autoincrement=True))
     amount = Mapped[int](nullable=False)
     user_id = Mapped[int](ForeignKey('users.id'), nullable=False)

 class Contract(base):
     __tablename__ = 'contracts'
     id = Mapped[int](mapped_column(primary_key=True, autoincrement=True))
     details = Mapped[str](String, nullable=False)
     user_id = Mapped[int](ForeignKey('users.id'), nullable=False)
     
     
class Task(base):
    __tablename__ = 'tasks'
    id = Mapped[int](mapped_column(primary_key=True, autoincrement=True))
    description = Mapped[str](String, nullable=False)
    user_id = Mapped[int](ForeignKey('users.id'), nullable=False)