from fastapi import FastAPI
from routes import router
from database.database import engine
from database.models import Base


app = FastAPI(
    
)

Base.metadata.create_all(bind=engine)

