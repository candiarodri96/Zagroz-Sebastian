from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, declarative_base


base = declarative_base()

class User(base):
 __tablename__ = 'users'
 id = Mapped[Integer](mapped_column(primary_key=True, autoincrement=True))
 username = Mapped[String](String(50), unique=True, nullable=False)
 email = Mapped[String](String(100), unique=True, nullable=False)
 password_hash = Mapped[String](String(255), nullable=False)

class Post(base):
 __tablename__ = 'posts'
 id = Mapped[Integer](mapped_column(primary_key=True, autoincrement=True))
 title = Mapped[String](String(200), nullable=False)
 content = Mapped[String](String, nullable=False)
 user_id = Mapped[Integer](ForeignKey('users.id'), nullable=False)

 class Invoice(base):
     __tablename__ = 'invoices'
     id = Mapped[Integer](mapped_column(primary_key=True, autoincrement=True))
     amount = Mapped[Integer](nullable=False)
     user_id = Mapped[Integer](ForeignKey('users.id'), nullable=False)

 class Contract(base):
     __tablename__ = 'contracts'
     id = Mapped[Integer](mapped_column(primary_key=True, autoincrement=True))
     details = Mapped[String](String, nullable=False)
     user_id = Mapped[Integer](ForeignKey('users.id'), nullable=False)
     
     
class Task(base):
    __tablename__ = 'tasks'
    id = Mapped[Integer](mapped_column(primary_key=True, autoincrement=True))
    description = Mapped[String](String, nullable=False)
    user_id = Mapped[Integer](ForeignKey('users.id'), nullable=False)