from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from pydantic import BaseModel

from app.db.session import get_db
from app.models.user import User, SocialAccount, Customer, Address
from app.schemas.User.User import GoogleLoginRequest, UserLoginResponse
from app.core.security import create_access_token 

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# --- Pydantic Schemas ---
class AddressCreate(BaseModel):
    user_id: int
    governorate: str
    city: str
    details: str
    phone: str

# ==========================================
# 1. تسجيل الدخول بجوجل
# ==========================================
@router.post("/google", response_model=UserLoginResponse)
async def google_login(
    payload: GoogleLoginRequest, 
    db: AsyncSession = Depends(get_db)
):
    # البحث عن حساب السوشيال ميديا مع جلب بيانات المستخدم المرتبط به
    query_social = (
        select(SocialAccount)
        .options(joinedload(SocialAccount.user))
        .where(
            SocialAccount.provider == "google",
            SocialAccount.provider_account_id == payload.google_id
        )
    )
    result_social = await db.execute(query_social)
    social_account = result_social.scalars().first()

    if social_account:
        user = social_account.user
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="This account has been deactivated."
            )
    else:
        # البحث بالإيميل في جدول المستخدمين (لربط الحسابات إذا وجد الإيميل مسبقاً)
        query_user = select(User).where(User.email == payload.email)
        result_user = await db.execute(query_user)
        user = result_user.scalars().first()

        # إنشاء مستخدم جديد إذا لم يوجد
        if not user:
            user = User(
                email=payload.email,
                name=payload.name,
                avatar_url=payload.avatar_url,
                role="customer", # الدور الافتراضي لأي تسجيل جديد
                is_active=True
            )
            db.add(user)
            await db.flush() 

            # إنشاء حساب Customer مربوط باليوزر فوراً لنظام النقاط والولاء
            new_customer = Customer(
                user_id=user.id,
                total_points=0
            )
            db.add(new_customer)

        # ربط حساب جوجل الجديد باليوزر (سواء كان يوزر موجود أو منشأ حديثاً)
        new_social = SocialAccount(
            user_id=user.id,
            provider="google",
            provider_account_id=payload.google_id
        )
        db.add(new_social)
        
        await db.commit()
        # تحديث بيانات اليوزر للتأكد من سحب حقل الـ role من القاعدة بعد الـ commit
        await db.refresh(user)

    # إعادة جلب بيانات اليوزر بشكل نظيف لضمان ظهور الـ role في الـ response_model
    final_query = select(User).where(User.id == user.id)
    final_result = await db.execute(final_query)
    user = final_result.scalars().first()

    # إنشاء التوكن الخاص بالجلسة
    access_token = create_access_token(data={"sub": str(user.id)})

    # يتم إرجاع البيانات التي تطابق UserLoginResponse (بما فيها الـ role الآن)
    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer"
    }

# ==========================================
# 2. حفظ وتحديث عنوان العميل
# ==========================================
@router.post("/customers/address")
async def add_or_update_address(
    address_data: AddressCreate, 
    db: AsyncSession = Depends(get_db)
):
    # 1. البحث عن الـ Customer المرتبط باليوزر
    result = await db.execute(select(Customer).filter(Customer.user_id == address_data.user_id))
    customer = result.scalars().first()
    
    if not customer:
        # ضمان وجود سجل عميل للمستخدمين القدامى قبل إضافة العنوان
        customer = Customer(user_id=address_data.user_id)
        db.add(customer)
        await db.flush()

    # 2. البحث عن العنوان الافتراضي الحالي لتحديثه أو إنشاء جديد
    addr_result = await db.execute(
        select(Address).filter(
            Address.customer_id == customer.id,
            Address.is_default == True
        )
    )
    existing_address = addr_result.scalars().first()

    if existing_address:
        # تحديث بيانات العنوان الموجودة
        existing_address.governorate = address_data.governorate
        existing_address.city = address_data.city
        existing_address.details = address_data.details
        existing_address.phone = address_data.phone
    else:
        # إنشاء عنوان افتراضي جديد
        new_address = Address(
            customer_id=customer.id,
            governorate=address_data.governorate,
            city=address_data.city,
            details=address_data.details,
            phone=address_data.phone,
            is_default=True
        )
        db.add(new_address)

    await db.commit()
    return {"message": "Address updated successfully", "address": address_data}

# ==========================================
# 3. جلب بيانات البروفايل (النقاط + العنوان)
# ==========================================
@router.get("/profile/{user_id}")
async def get_profile_data(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Customer)
        .options(joinedload(Customer.addresses))
        .filter(Customer.user_id == user_id)
    )
    customer = result.scalars().first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    default_address = next((addr for addr in customer.addresses if addr.is_default), None)
    
    return {
        "total_points": customer.total_points,
        "default_address": default_address
    }