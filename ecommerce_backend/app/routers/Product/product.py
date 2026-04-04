from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func 
from sqlalchemy.orm import selectinload
from typing import List, Optional

# استدعي الملفات بتاعتك هنا بناءً على مسارات مشروعك
from app.db.session import get_db
from app.models import Product, ShortItemNo, Category
from app.schemas.Product.Product import ProductShopRead

router = APIRouter(
    prefix="/products",
    tags=["Products Store"]
)

# 🟢 1. جلب كل البراندات المتاحة للمنتجات اللي ليها مخزون فقط
@router.get("/brands", response_model=List[str])
async def get_active_brands(db: AsyncSession = Depends(get_db)):
    """
    جلب أسماء البراندات للمنتجات المفعلة والتي تحتوي على مخزون فقط.
    """
    query = (
        select(ShortItemNo.Brand_Name)
        .join(ShortItemNo.products)
        .where(
            Product.is_active == True,
            Product.stock_quantity > 0, # 👈 التأكد من وجود مخزون
            ShortItemNo.Brand_Name.isnot(None),
            ShortItemNo.Brand_Name != ""
        )
        .distinct()
    )
    result = await db.execute(query)
    brands = result.scalars().all()
    
    return brands

# --- 2. جلب الواصل حديثاً (المتوفر فقط) ---
@router.get("/new-arrivals", response_model=List[ProductShopRead])
async def get_new_arrivals(
    limit: int = Query(default=10, ge=1),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Product)
        .options(
            selectinload(Product.item_details).selectinload(ShortItemNo.categories),
            selectinload(Product.item_details).selectinload(ShortItemNo.additional_images) 
        )
        .where(
            Product.is_new_arrival == '1', 
            Product.is_active == True,
            Product.stock_quantity > 0 # 👈 إخفاء المنتجات اللي رصيدها صفر
        )
        .order_by(Product.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    result = await db.execute(query)
    products_objs = result.unique().scalars().all()
    
    return [ProductShopRead.map_from_orm(p) for p in products_objs]

# --- 3. جلب الاقتراحات (للمنتجات المتوفرة فقط) ---
@router.get("/suggestions")
async def get_search_suggestions(
    query: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(ShortItemNo.en_name, ShortItemNo.ar_name, Product.id)
        .join(Product.item_details)
        .where(
            or_(
                ShortItemNo.en_name.ilike(f"%{query}%"),
                ShortItemNo.ar_name.ilike(f"%{query}%")
            ),
            Product.is_active == True,
            Product.stock_quantity > 0 # 👈 عشان متبقاش الاقتراحات لمنتجات مش موجودة
        )
        .limit(8)
    )
    result = await db.execute(stmt)
    suggestions = result.all()
    
    return [
        {"id": s.id, "name": s.en_name or s.ar_name} 
        for s in suggestions
    ]

# --- 4. جلب قائمة المنتجات العامة (المتوفرة فقط) ---
@router.get("/")
async def list_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    brands: Optional[List[str]] = Query(default=None), 
    min_price: Optional[float] = Query(default=None),
    max_price: Optional[float] = Query(default=None),
    limit: int = Query(default=20, ge=1),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    base_query = (
        select(Product)
        .join(Product.item_details)
        .where(
            Product.is_active == True,
            Product.stock_quantity > 0 # 👈 التعديل اللي أنت عملته وهو سليم
        )
    )

    if search:
        search_term = f"%{search}%"
        base_query = base_query.where(
            or_(
                ShortItemNo.ar_name.ilike(search_term),
                ShortItemNo.en_name.ilike(search_term),
                ShortItemNo.Brand_Name.ilike(search_term),
                ShortItemNo.description.ilike(search_term),
                ShortItemNo.header.ilike(search_term),
                ShortItemNo.sub_header.ilike(search_term),
                ShortItemNo.short_item_no.ilike(search_term)
            )
        )

    if category_slug:
        base_query = base_query.join(ShortItemNo.categories).where(Category.slug == category_slug)

    if brands:
        base_query = base_query.where(ShortItemNo.Brand_Name.in_(brands))

    if min_price is not None:
        base_query = base_query.where(Product.final_price >= min_price)
    if max_price is not None:
        base_query = base_query.where(Product.final_price <= max_price)

    count_stmt = select(func.count()).select_from(base_query.subquery())
    total_result = await db.execute(count_stmt)
    total_count = total_result.scalar() or 0

    data_query = (
        base_query
        .options(
            selectinload(Product.item_details).selectinload(ShortItemNo.additional_images),
            selectinload(Product.item_details).selectinload(ShortItemNo.categories)
        )
        .order_by(Product.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    
    result = await db.execute(data_query)
    products_objs = result.unique().scalars().all()

    return {
        "total": total_count,
        "limit": limit,
        "offset": offset,
        "products": [ProductShopRead.map_from_orm(p) for p in products_objs]
    }

# --- 5. جلب تفاصيل منتج واحد (ID) ---
# هنا بنسمح بعرض المنتج حتى لو صفر عشان لو العميل دخل من لينك قديم يظهرله "نفذت الكمية"
@router.get("/{product_id}", response_model=ProductShopRead)
async def get_product_details(product_id: int, db: AsyncSession = Depends(get_db)):
    query = (
        select(Product)
        .options(
            selectinload(Product.item_details).selectinload(ShortItemNo.additional_images),
            selectinload(Product.item_details).selectinload(ShortItemNo.categories)
        )
        .where(Product.id == product_id, Product.is_active == True)
    )
    
    result = await db.execute(query)
    product_obj = result.unique().scalars().first()
    
    if not product_obj: 
        raise HTTPException(status_code=404, detail="Product not found")
    
    return ProductShopRead.map_from_orm(product_obj)