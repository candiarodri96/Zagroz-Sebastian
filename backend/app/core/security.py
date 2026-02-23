from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


# Hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =========================
# PASSWORD FUNCTIONS

# Function to hash password, to be used in auth routes
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Function to verify password, to be used in auth routes
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# =========================
# JWT TOKEN FUNCTIONS

# Function to create JWT token, to be used in auth routes
def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt

# decoding function for JWT token, to be used in auth dependencies
def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
