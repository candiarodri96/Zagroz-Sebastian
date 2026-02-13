from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .database.database import get_db
from .database import queries, queries

router = APIRouter()