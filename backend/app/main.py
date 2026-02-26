from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.users import router as user_router
from app.routers.ads import router as ads_router
from app.core.auth import router as auth_router
from app.routers.offers import router as offers_router

from app.db.database import engine
from app.models.models import Base, User, Ad, Offer


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe mode — only creates tables that don't exist yet
    Base.metadata.create_all(bind=engine)
    print("✅ Tables ready")
    yield
    # Shutdown logic (if needed) goes here


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(ads_router, prefix="/ads", tags=["ads"])
app.include_router(offers_router, prefix="/ads", tags=["offers"])