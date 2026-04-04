from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel

from app.db.session import get_db
# استيراد الموديلات من مساراتها الصحيحة
from app.models.user import Customer, Address
from app.models.user import PointsTransaction

from app.modules.identity.schemas import GoogleLoginSchema, CustomerResponse
from app.modules.identity.services import IdentityService

router = APIRouter()

# ==========================================
# 1. تسجيل الدخول بجوجل
# ==========================================
@router.post("/auth/google", response_model=CustomerResponse)
async def google_login(payload: GoogleLoginSchema, db: AsyncSession = Depends(get_db)):
    
    # 1. التحقق من صحة التوكن عبر خدمة الهوية
    google_user_data = await IdentityService.verify_google_token(payload.token)
    
    if not google_user_data:
        raise HTTPException(status_code=400, detail="Invalid Google Token")
    
    # 2. الحصول على بيانات العميل أو إنشائه (تأكد أن الخدمة ترجع كائن Customer)
    customer, is_new = await IdentityService.get_or_create_customer(db, google_user_data)
    
    # 3. إرجاع البيانات (تأكد من مطابقة المسميات مع CustomerResponse Schema)
    return {
        "id": customer.user_id, # معرف اليوزر الأساسي للربط في الموبايل
        "name": customer.name, 
        "email": customer.email,
        "total_points": customer.total_points, # القيمة الحقيقية من الداتا بيز (مثل الـ 256)
        "picture_url": customer.picture_url, 
        "is_new_user": is_new
    }

# ==========================================
# 2. Pydantic Schemas
# ==========================================
class AddressCreate(BaseModel):
    user_id: int
    governorate: str
    city: str
    details: str
    phone: str

# ==========================================
# 3. حفظ وتحديث العنوان الافتراضي
# ==========================================
@router.post("/customers/address")
async def add_or_update_address(address_data: AddressCreate, db: AsyncSession = Depends(get_db)):
    
    # البحث عن العميل باستخدام user_id
    result = await db.execute(select(Customer).filter(Customer.user_id == address_data.user_id))
    customer = result.scalars().first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="العميل غير موجود")

    # البحث عن عنوان افتراضي موجود مسبقاً
    addr_result = await db.execute(
        select(Address).filter(
            Address.customer_id == customer.id,
            Address.is_default == True
        )
    )
    existing_address = addr_result.scalars().first()

    if existing_address:
        # تحديث العنوان الحالي
        existing_address.governorate = address_data.governorate
        existing_address.city = address_data.city
        existing_address.details = address_data.details
        existing_address.phone = address_data.phone
    else:
        # إنشاء عنوان جديد
        new_address = Address(
            customer_id=customer.id,
            governorate=address_data.governorate,
            city=address_data.city,
            details=address_data.details,
            phone=address_data.phone,
            is_default=True
        )
        db.add(new_address)

    try:
        await db.commit()
        return {
            "status": "success",
            "message": "تم حفظ العنوان بنجاح", 
            "address": address_data.dict()
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="خطأ في حفظ البيانات")

# ==========================================
# 4. جلب بيانات البروفايل كاملة (نقاط فعلية + معلقة + عنوان)
# ==========================================
@router.get("/auth/profile/{user_id}")
async def get_customer_profile(user_id: int, db: AsyncSession = Depends(get_db)):
    
    # 1. جلب بيانات العميل الأساسية
    # استخدمنا filter على user_id لضمان الربط مع نظام الـ Auth
    result = await db.execute(select(Customer).filter(Customer.user_id == user_id))
    customer = result.scalars().first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="بيانات العميل غير مكتملة")

    # 2. حساب مجموع النقاط "المعلقة" (Pending) من جدول العمليات
    pending_points_query = await db.execute(
        select(func.sum(PointsTransaction.points)).where(
            PointsTransaction.customer_id == customer.id,
            PointsTransaction.status == "pending"
        )
    )
    pending_points = pending_points_query.scalar() or 0

    # 3. جلب العنوان الافتراضي
    addr_result = await db.execute(
        select(Address).filter(Address.customer_id == customer.id, Address.is_default == True)
    )
    address = addr_result.scalars().first()

    # 4. تجميع البيانات النهائية
    return {
        "id": customer.id,
        "name": customer.name, # يتم جلبها من علاقة اليوزر في الموديل أو الخدمة
        "email": customer.email,
        "total_points": int(customer.total_points),  # التأكد أنها Integer للـ StatsGrid
        "pending_points": int(pending_points), 
        "customer_code": customer.customer_code,
        "picture_url": customer.picture_url,
        "is_chronic": customer.is_chronic,
        "default_address": {
            "governorate": address.governorate,
            "city": address.city,
            "details": address.details,
            "phone": address.phone
        } if address else None
    }