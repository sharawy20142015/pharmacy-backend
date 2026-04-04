from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.Category import Category
from app.schemas.Category.Category import CategoryRead, CategoryWithSub

# استيراد الموديلات المطلوبة للـ Endpoint الخاص بالمنتجات
from app.models.product import Product
from app.models.Short_Item_No import ShortItemNo
from app.models.ProductImage import ProductImage
from app.schemas.Product.Product import ProductShopRead

router = APIRouter(
    prefix="/categories",
    tags=["Product Categories"]
)

# 1️⃣ جلب جميع الأقسام الرئيسية (Level 0) مع أقسامها الفرعية (للفئات اللي ليها منتجات مفعلة فقط)
@router.get("/", response_model=List[CategoryWithSub])
async def get_main_categories(db: AsyncSession = Depends(get_db)):
    """
    جلب قائمة بالأقسام الرئيسية (Level 0) مع تحميل الأقسام الفرعية التابعة لها.
    يتم جلب الأقسام التي تحتوي على منتجات مفعلة فقط (is_active == True).
    """
    query = (
        select(Category)
        .join(Category.items)           # الربط مع جدول التفاصيل (ShortItemNo)
        .join(ShortItemNo.products)     # الربط مع المنتجات (Product)
        .options(selectinload(Category.sub_categories))
        .where(
            Category.level == 0, 
            Product.is_active == True   # التأكد إن المنتج مفعل
        )
        .distinct()                     # لمنع تكرار اسم القسم
    )
    
    result = await db.execute(query)
    return result.scalars().all()

# 2️⃣ جلب الأقسام الفرعية لقسم معين بواسطة الـ ID
@router.get("/{parent_id}/subcategories", response_model=List[CategoryRead])
async def get_subcategories(parent_id: int, db: AsyncSession = Depends(get_db)):
    """
    جلب الأقسام الفرعية التابعة لقسم معين.
    """
    query = select(Category).where(Category.parent_id == parent_id)
    result = await db.execute(query)
    return result.scalars().all()

# 3️⃣ جلب تفاصيل قسم واحد بالـ Slug
@router.get("/by-slug/{slug}", response_model=CategoryWithSub)
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    query = select(Category).options(
        selectinload(Category.sub_categories)
    ).where(Category.slug == slug)
    
    result = await db.execute(query)
    category = result.scalars().first()
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Category not found"
        )
    return category

# 4️⃣ جلب جميع المنتجات التابعة لقسم معين بدون Limit
@router.get("/{slug}/products", response_model=List[ProductShopRead])
async def get_category_products(
    slug: str, 
    db: AsyncSession = Depends(get_db),
    offset: int = 0
):
    # 1. البحث عن القسم
    cat_query = select(Category).where(Category.slug == slug)
    cat_res = await db.execute(cat_query)
    category = cat_res.scalars().first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # 2. الاستعلام: شيلنا سطر الـ .limit()
    query = (
        select(Product, ProductImage.img_url)
        .join(ShortItemNo, Product.short_item_no == ShortItemNo.short_item_no)
        .join(ShortItemNo.categories)
        .join(
            ProductImage, 
            (Product.short_item_no == ProductImage.short_item_no) & (ProductImage.is_main == 1), 
            isouter=True
        )
        .where(Category.id == category.id )
        .options(selectinload(Product.item_details))
        .order_by(Product.id.desc())
        # تم إزالة limit لضمان جلب كافة المنتجات
    )
    
    result = await db.execute(query)
    rows = result.all()

    # 3. بناء الداتا
    final_list = []
    for product, main_img_url in rows:
        details = product.item_details
        product_data = {
            "id": product.id,
            "slug": product.slug,
            "short_item_no": product.short_item_no,
            "en_name": details.en_name if details and details.en_name else "Unknown Product",
            "ar_name": details.ar_name if details and details.ar_name else "بدون اسم",
            "description": details.description if details and details.description else "",
            "price": product.price,
            "discount_value": product.discount_value or 0.0,
            "discount_percentage": product.discount_percentage or 0.0,
            "final_price": product.final_price,
            "quantity": product.stock_quantity, 
            "classification": category.name, 
            "is_active": product.is_active,
            "is_featured": product.is_featured,
            "is_new_arrival": product.is_new_arrival,
            "img_url1": main_img_url if main_img_url else None
        }
        try:
            final_list.append(ProductShopRead(**product_data))
        except Exception:
            continue

    return final_list



# 🌟 مسار جديد لجلب الفئات الفرعية (Level 1) للصفحة الرئيسية
@router.get("/level-1")
async def get_level_1_categories(db: AsyncSession = Depends(get_db)):
    """
    جلب الفئات اللي الـ Level بتاعها 1، 
    بشرط يكون جواها منتجات مفعلة (is_active == True).
    مفيد جداً للعرض في الصفحة الرئيسية.
    """
    query = (
        select(Category)
        .join(Category.items)           # الربط مع جدول التفاصيل (ShortItemNo)
        .join(ShortItemNo.products)     # الربط مع المنتجات (Product)
        .where(
            Category.level == 1,        # 🟢 تحديد الـ Level 1
        )
        .distinct()                     # لمنع تكرار اسم القسم
    )
    
    result = await db.execute(query)
    categories = result.scalars().all()
    
    # هنرجع الداتا بالشكل اللي الفرونت إند محتاجه عشان الصور تظهر
    return [
        {
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "level": cat.level,
            "img_url": cat.img_url
        } 
        for cat in categories
    ]