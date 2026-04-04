# E:\Sharawy\PharmacyApp\ecommerce_backend\app\services\identity_service.py

from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.core.config import settings

class IdentityService:
    
    @staticmethod
    async def verify_google_token(token: str):
        """
        التحقق من صحة Token جوجل باستخدام Client ID الخاص بالتطبيق.
        """
        try:
            # ✅ استخدام الـ Client ID من ملف الإعدادات المركزي
            id_info = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            
            # التأكد من أن التوكن صادر من جهة جوجل
            if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            return id_info
        except ValueError as e:
            print(f"❌ Google Token Verification Error: {str(e)}")
            return None
        except Exception as e:
            print(f"❌ Unexpected Error during Token Verification: {str(e)}")
            return None

    @staticmethod
    async def get_or_create_customer(db: AsyncSession, google_data: dict):
        """
        البحث عن العميل أو إنشائه:
        - يضمن إرجاع كائن العميل (Customer) مع بيانات اليوزر (User) لضمان ظهور النقاط.
        """
        # استيراد الموديلات داخل الدالة لتجنب الـ Circular Import
        from app.models.user import User, Customer
        
        email = google_data.get('email')
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Email not provided by Google account"
            )

        # 1. البحث عن المستخدم في جدول الـ User الأساسي
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        user = result.scalars().first()

        is_new = False

        if user:
            # إذا كان اليوزر موجود، نحدث البيانات الأساسية
            user.name = google_data.get('name', user.name)
            user.avatar_url = google_data.get('picture', user.avatar_url)
            
            # البحث عن سجل العميل (Customer) المرتبط به
            customer_query = select(Customer).where(Customer.user_id == user.id)
            customer_result = await db.execute(customer_query)
            customer = customer_result.scalars().first()
            
            if not customer:
                # لو اليوزر موجود بس ملوش سجل عميل (حالة نادرة)
                customer = Customer(user_id=user.id, total_points=50)
                db.add(customer)
        else:
            # 2. إنشاء مستخدم جديد تماماً
            is_new = True
            new_user = User(
                email=email,
                name=google_data.get('name'),
                avatar_url=google_data.get('picture'),
                is_active=True
            )
            db.add(new_user)
            await db.flush() # الحصول على ID اليوزر لاستخدامه في ربط العميل

            # إنشاء سجل العميل وإضافة هدية الترحيب
            customer = Customer(
                user_id=new_user.id,
                total_points=50  # هدية تسجيل أول مرة
            )
            db.add(customer)
            user = new_user

        try:
            await db.commit()
            
            # 🟢 خطوة الربط السحرية لضمان وصول البيانات للـ Router 🟢
            # بننقل بيانات الـ User لكائن الـ Customer عشان الـ Schema تقرأها صح
            customer.name = user.name
            customer.email = user.email
            customer.picture_url = user.avatar_url

            return customer, is_new
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Database Error in Auth Service: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="حدث خطأ أثناء حفظ بيانات المستخدم"
            )