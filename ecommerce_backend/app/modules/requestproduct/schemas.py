from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# الحقول الأساسية
class ProductRequestBase(BaseModel):
    name: str
    phone: str
    address: str
    product_details: str

# لإنشاء طلب جديد
class ProductRequestCreate(ProductRequestBase):
    pass

# 👈 دي اللي كانت ناقصة وعاملة AttributeError
class ProductRequestUpdateStatus(BaseModel):
    status: str # 'pending', 'processing', 'completed', 'cancelled'

# الرد اللي بيرجع من الـ API
class ProductRequestResponse(ProductRequestBase):
    id: int
    order_number: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True