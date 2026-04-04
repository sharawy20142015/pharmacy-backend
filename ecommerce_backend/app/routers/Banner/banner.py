from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel

from app.db.session import get_db
from app.models.Banner import Banner
from app.models.Category import Category 

router = APIRouter(
    prefix="/banners",
    tags=["Banners"]
)

# --- 🛠️ Pydantic Schemas ---

# 1. سكيما صغيرة للكاتجوري عشان تظهر جوه البانر
class CategorySimple(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True

# 2. سكيما البانر الرئيسية
class BannerRead(BaseModel):
    id: int
    image_url: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    
    # 👇 هنا التغيير: شيلنا section وحطينا category كاملة
    category: Optional[CategorySimple] = None 
    category_id: Optional[int] = None
    
    target_screen: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


# 1️⃣ Get Banner By Category ID (ده اللي هتستخدمه في صفحة Men/Women)
@router.get("/category/{category_id}", response_model=BannerRead)
async def get_banner_by_category(category_id: int, db: AsyncSession = Depends(get_db)):
    """
    جلب البانر الخاص بقسم معين عن طريق الـ ID الخاص بالقسم
    مثال: لو قسم الرجال ID بتاعه 2، ابعت 2 هيرجعلك البانر بتاعه
    """
    query = (
        select(Banner)
        .options(selectinload(Banner.category)) # 👈 مهم جداً: عشان يحمل بيانات القسم مع البانر
        .filter(
            Banner.category_id == category_id,
            Banner.is_active == True
        )
    )
    
    result = await db.execute(query)
    banner = result.scalars().first()
    
    if not banner:
        raise HTTPException(status_code=404, detail=f"No active banner found for category ID: {category_id}")
        
    return banner


# 2️⃣ Get All Banners (للداشبورد أو للعرض العام)
@router.get("/", response_model=List[BannerRead])
async def get_all_banners(db: AsyncSession = Depends(get_db)):
    """
    جلب كل البانرات
    """
    # بنعمل Loading للعلاقة عشان السكيما متضربش
    query = select(Banner).options(selectinload(Banner.category))
    result = await db.execute(query)
    banners = result.scalars().all()
    return banners



# 👇 3️⃣ Get Home Banner (بانر الصفحة الرئيسية)
@router.get("/home", response_model=BannerRead)
async def get_home_banner(db: AsyncSession = Depends(get_db)):
    """
    جلب بانر الصفحة الرئيسية (اللي ملوش category_id)
    """
    query = select(Banner).filter(
        Banner.category_id == None, # 👈 بنجيب اللي ملوش قسم
        Banner.title.contains("Home"), # احتياطي عشان نتأكد إنه بتاع الهوم
        Banner.is_active == True
    )
    
    result = await db.execute(query)
    banner = result.scalars().first()
    
    if not banner:
        raise HTTPException(status_code=404, detail="No active home banner found")
        
    return banner