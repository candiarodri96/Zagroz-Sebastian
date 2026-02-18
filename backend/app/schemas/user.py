from pydantic import BaseModel, EmailStr, Field

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8)

class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True