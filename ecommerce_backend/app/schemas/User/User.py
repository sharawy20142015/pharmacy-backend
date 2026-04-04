from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

# 1. تعريف الـ Enum عشان يتطابق مع الداتابيز
class UserRole(str, Enum):
    ADMIN = "admin"
    STAFF = "staff"
    CUSTOMER = "customer"

class GoogleLoginRequest(BaseModel):
    google_id: str
    email: str
    name: str
    avatar_url: Optional[str] = None

# 2. إضافة الـ role هنا هو اللي هيحل لغز الـ undefined
class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: UserRole  # 👈 الحقل السحري اللي كان ناقص
    is_active: bool

    class Config:
        from_attributes = True

class UserLoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"