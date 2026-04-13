from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from typing import List

# 🟢 استيراد أداة الكاش
from fastapi_cache.decorator import cache

from app.db.session import get_db
from app.models.Category import Category
from app.schemas.Category.Category import CategoryRead, CategoryWithSub

# استيراد الموديلات المطلوبة
from app.models.product import Product
from app.models.Short_Item_No import ShortItemNo
from app.models.ProductImage import ProductImage
from app.schemas.Product.Product import ProductShopRead

router = APIRouter(
    prefix="/categories",
    tags=["Product Categories"]
)

# --- 1. الروابط الثابتة (Static Routes) تضعها في البداية ---

@router.get("/all-names")
async def get_all_categories_names(db: AsyncSession = Depends(get_db)):
    """
    جلب كافة الفئات (ID و Name) لاستخدامها في فورم الإدمن (Multi-select)
    """
    query = select(Category.id, Category.name).order_by(Category.name.asc())
    result = await db.execute(query)
    rows = result.all()
    return [{"id": row.id, "name": row.name} for row in rows]


@router.get("/level-1")
@cache(expire=300)
async def get_level_1_categories(db: AsyncSession = Depends(get_db)):
    """ جلب الفئات المستوى 1 التي تحتوي على منتجات مفعلة """
    query = (
        select(Category)
        .join(Category.items)
        .join(ShortItemNo.products)
        .where(
            Category.level == 1,
            Product.is_active == True # ✅ PostgreSQL Fix
        )
        .distinct()
    )
    result = await db.execute(query)
    categories = result.scalars().all()
    return [
        {
            "id": cat.id, "name": cat.name, "slug": cat.slug,
            "level": cat.level, "img_url": cat.img_url
        } for cat in categories
    ]


@router.get("/", response_model=List[CategoryWithSub])
@cache(expire=300)
async def get_main_categories(db: AsyncSession = Depends(get_db)):
    """ جلب الفئات الرئيسية المستوى 0 """
    query = (
        select(Category)
        .join(Category.items)
        .join(ShortItemNo.products)
        .options(selectinload(Category.sub_categories))
        .where(
            Category.level == 0, 
            Product.is_active == True # ✅ PostgreSQL Fix
        )
        .distinct()
    )
    result = await db.execute(query)
    return result.scalars().all()


# --- 2. الروابط التي تحتوي على تمييز في المسار ---

@router.get("/by-slug/{slug}", response_model=CategoryWithSub)
@cache(expire=300)
async def get_category_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    query = select(Category).options(
        selectinload(Category.sub_categories)
    ).where(Category.slug == slug)
    
    result = await db.execute(query)
    category = result.scalars().first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# --- 3. الروابط المتغيرة (Dynamic Routes) تضعها في النهاية ---

@router.get("/{parent_id}/subcategories", response_model=List[CategoryRead])
@cache(expire=300)
async def get_subcategories(parent_id: int, db: AsyncSession = Depends(get_db)):
    """ جلب الفئات الفرعية بواسطة معرف الأب """
    query = select(Category).where(Category.parent_id == parent_id)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{slug}/products", response_model=List[ProductShopRead])
@cache(expire=120)
async def get_category_products(slug: str, db: AsyncSession = Depends(get_db)):
    """ جلب كافة المنتجات التابعة لـ Slug معين """
    
    # 1. البحث عن الفئة
    cat_query = select(Category).where(Category.slug == slug)
    cat_res = await db.execute(cat_query)
    category = cat_res.scalars().first()
    
    if not category:
        raise HTTPException(status_code=404, detail=f"Category '{slug}' not found")

    # 2. الاستعلام عن المنتجات
    query = (
        select(Product, ProductImage.img_url)
        .join(ShortItemNo, Product.short_item_no == ShortItemNo.short_item_no)
        .join(ShortItemNo.categories)
        .join(
            ProductImage, 
            and_(
                Product.short_item_no == ProductImage.short_item_no, 
                ProductImage.is_main == True # ✅ PostgreSQL Fix
            ), 
            isouter=True
        )
        .where(Category.id == category.id)
        .options(selectinload(Product.item_details))
        .order_by(Product.id.desc())
    )
    
    result = await db.execute(query)
    rows = result.all()

    final_list = []
    for product, main_img_url in rows:
        details = product.item_details
        product_data = {
            "id": product.id,
            "slug": product.slug,
            "short_item_no": product.short_item_no,
            "en_name": details.en_name if details and details.en_name else "Unknown",
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
        except:
            continue

    return final_list