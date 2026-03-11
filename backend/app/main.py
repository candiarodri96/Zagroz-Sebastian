from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIASGIMiddleware
from app.core.limiter import limiter

from app.routers.users import router as user_router
from app.routers.ads import router as ads_router
from app.core.auth import router as auth_router
from app.routers.offers import router as offers_router
from app.routers.contracts import router as contracts_router
from app.routers.messages import router as messages_router
from app.routers.notifications import router as notifications_router
from app.routers.reviews import router as reviews_router

from app.db.database import engine
from app.models.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print("✅ Tables ready")
    yield


app = FastAPI(lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIASGIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://13.62.178.191:5173",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(ads_router, prefix="/ads", tags=["ads"])
app.include_router(offers_router, prefix="/ads", tags=["offers"])
app.include_router(contracts_router, prefix="/ads", tags=["contracts"])
app.include_router(messages_router, tags=["messages"])
app.include_router(notifications_router)
app.include_router(reviews_router, tags=["Reviews"])
