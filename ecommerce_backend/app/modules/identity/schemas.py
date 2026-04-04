from pydantic import BaseModel
from typing import Optional

# 1. اللي جاي من الموبايل
class GoogleLoginSchema(BaseModel):
    token: str  # التوكن الطويل اللي جوجل بيديه للموبايل

# app/modules/identity/schemas.py

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    total_points: int  # 👈 تأكد إن الاسم كدة مش points_balance
    picture_url: Optional[str] = None
    is_new_user: bool

    class Config:
        from_attributes = True # عشان يقرأ من الـ Database Model مباشرة