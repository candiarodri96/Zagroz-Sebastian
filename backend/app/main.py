from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.users import router as user_router
from app.routers.ads import router as ads_router
from app.core.auth import router as auth_router

from app.db.database import engine
from app.models.models import Base
from app.models.models import User, Ad, Offer  # 🔥 LÄGG TILL DENNA

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(auth_router)
app.include_router(ads_router, prefix="/ads", tags=["ads"])