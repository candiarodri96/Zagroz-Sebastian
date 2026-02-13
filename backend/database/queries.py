from sqlalchemy.orm import Session
from .models import User, Post, Invoice, Contract, Task

def create_user(db: Session, username: str, email: str, password_hash: str):
    user = User(
        username=username,
        email=email,
        password_hash=password_hash
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_post(db: Session, title: str, content: str, user_id: int):
    post = Post(
        title=title,
        content=content,
        user_id=user_id
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def create_invoice(db: Session, amount: int, user_id: int):
    invoice = Invoice(
        amount=amount,
        user_id=user_id
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

def create_contract(db: Session, details: str, user_id: int):
    contract = Contract(
        details=details,
        user_id=user_id
    )

    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract
def create_task(db: Session, description: str, user_id: int):
    task = Task(
        description=description,
        user_id=user_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    return task
