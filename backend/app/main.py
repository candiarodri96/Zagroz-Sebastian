from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.users import router as user_router
from models.models import base
from db.database import engine

app = FastAPI()

# Allows for communciation between frontend and backend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Creates database tables from your models
base.metadata.create_all(bind=engine)

# Registers the endpoints
app.include_router(user_router, prefix="/users", tags=["users"])

