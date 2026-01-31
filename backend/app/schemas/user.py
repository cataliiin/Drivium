from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    username: str = Field(..., max_length=64)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
