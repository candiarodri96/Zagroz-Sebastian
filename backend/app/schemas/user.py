from pydantic import BaseModel, EmailStr, Field, field_validator
import string

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class UserCreate(BaseModel):
    first_name: str = Field(min_length=2, max_length=50)
    last_name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def password_strenght(cls, x):
        if len(x) < 8:
            raise ValueError("Password must be longer than 8 characters")
        if not any(char.isdigit() for char in x):
            raise ValueError("Password must contain contain at least one digit")
        if not any(char.isupper() for char in x):
            raise ValueError("Password must have at least one uppercase letter")
        if not any(char.islower() for char in x):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char in string.punctuation for char in x):
            raise ValueError("Password must contain at least one special character")
        
        # hash the password later as well if not already done
        return x
    

class UserUpdate(BaseModel):
    email: EmailStr


class ChangePassword(BaseModel):
    old_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, x):
        if len(x) < 8:
            raise ValueError("Password must be longer than 8 characters")
        if not any(char.isdigit() for char in x):
            raise ValueError("Password must contain at least one digit")
        if not any(char.isupper() for char in x):
            raise ValueError("Password must have at least one uppercase letter")
        if not any(char.islower() for char in x):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char in string.punctuation for char in x):
            raise ValueError("Password must contain at least one special character")
        return x

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr

    class Config:
        from_attributes = True