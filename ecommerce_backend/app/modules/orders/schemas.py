from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

# --- 1. Schema لعناصر الطلب (OrderItem) ---
class OrderItemBase(BaseModel):
    # 🟢 غيرناه لـ int لأننا بنبعت الـ ID الرقمي (Primary Key) دلوقتي
    product_id: int  
    quantity: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemRead(OrderItemBase):
    id: int
    unit_price: Decimal
    subtotal: Decimal

    model_config = ConfigDict(from_attributes=True)


# --- 2. Schema لإنشاء طلب جديد (Order Create) ---
class OrderCreate(BaseModel):
    customer_id: Optional[int] = None
    cart_items: List[OrderItemCreate]
    coupon_code: Optional[str] = None
    
    # عدد النقاط التي سيتم خصمها من رصيد العميل
    points_to_redeem: Optional[int] = 0 
    
    shipping_fees: float = 0.0
    
    # بيانات الشحن الأساسية
    shipping_first_name: str
    # 🟢 جعلناه Optional عشان لو اليوزر محطش اسم تاني الريكويست ميفشلش (سبب محتمل لـ 422)
    shipping_last_name: Optional[str] = "" 
    shipping_governorate: str
    shipping_city: str
    shipping_details: str
    shipping_phone: str
    
    # 🟢 وسيلة الدفع (Cash أو Wallet)
    payment_method: Optional[str] = "Cash"


# --- 3. Schema لقراءة بيانات الطلب (Order Read) ---
class OrderRead(BaseModel):
    id: int
    order_number: str
    date: datetime
    status: str
    
    total_raw_amount: Decimal
    shipping_fees: Decimal
    coupon_discount: Decimal
    
    # الحقول الخاصة بنظام الولاء (Loyalty)
    points_discount: Decimal
    used_points: int
    
    total_final_amount: Decimal
    
    # بيانات الشحن المخزنة
    shipping_first_name: Optional[str]
    shipping_last_name: Optional[str]
    shipping_city: Optional[str]
    shipping_phone: Optional[str]
    
    # وسيلة الدفع المخزنة
    payment_method: Optional[str]
    
    # قائمة المنتجات داخل الطلب
    items: List[OrderItemRead]

    model_config = ConfigDict(from_attributes=True)


# --- 4. Schema لتحديث الحالة ---
class OrderStatusUpdate(BaseModel):
    status: str