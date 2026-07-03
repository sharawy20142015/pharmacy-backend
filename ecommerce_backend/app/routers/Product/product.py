from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func 
from sqlalchemy.orm import selectinload
from typing import List, Optional
from fastapi_cache.decorator import cache
from app.db.session import get_db
from app.models import Product, ShortItemNo, Category
from app.schemas.Product.Product import ProductShopRead

router = APIRouter(
    prefix="/products",
    tags=["Products Store"]
)

@router.get("/brands", response_model=List[str])
@cache(expire=3600)
async def get_active_brands(db: AsyncSession = Depends(get_db)):
    query = (
        select(ShortItemNo.Brand_Name)
        .join(ShortItemNo.products)
        .where(
            Product.is_active == True,
            Product.stock_quantity > 0,
            ShortItemNo.Brand_Name.isnot(None),
            ShortItemNo.Brand_Name != ""
        )
        .distinct()
    )
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/new-arrivals", response_model=List[ProductShopRead])
@cache(expire=300)
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
            Product.is_new_arrival == True,
            Product.is_active == True,
            Product.stock_quantity > 0
        )
        .order_by(Product.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(query)
    products_objs = result.unique().scalars().all()
    return [ProductShopRead.map_from_orm(p) for p in products_objs]

@router.get("/suggestions")
async def get_search_suggestions(
    query: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    search_term = query.strip()
    stmt = (
        select(ShortItemNo.en_name, ShortItemNo.ar_name, Product.id)
        .join(Product.item_details)
        .where(
            or_(
                ShortItemNo.en_name.ilike(f"{search_term}%"),
                ShortItemNo.ar_name.ilike(f"{search_term}%"),
                ShortItemNo.Brand_Name.ilike(f"{search_term}%")
            ),
            Product.is_active == True,
            Product.stock_quantity > 0
        )
        .limit(8)
    )
    result = await db.execute(stmt)
    suggestions = result.all()
    return [
        {"id": s.id, "name": s.en_name or s.ar_name} 
        for s in suggestions
    ]

@router.get("/")
async def list_products(
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    brands: Optional[List[str]] = Query(default=None), 
    min_price: Optional[float] = Query(default=None),
    max_price: Optional[float] = Query(default=None),
    in_stock_only: bool = Query(default=False), 
    on_sale_only: bool = Query(default=False),
    limit: int = Query(default=20, ge=1),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    base_query = (
        select(Product)
        .join(Product.item_details)
        .where(Product.is_active == True)
    )

    if in_stock_only:
        base_query = base_query.where(Product.stock_quantity > 0)

    if on_sale_only:
        base_query = base_query.where(Product.price > Product.final_price)

    if search:
        search_term = search.strip()
        base_query = base_query.where(
            or_(
                ShortItemNo.ar_name.ilike(f"{search_term}%"),
                ShortItemNo.en_name.ilike(f"{search_term}%"),
                ShortItemNo.Brand_Name.ilike(f"{search_term}%"),
                ShortItemNo.short_item_no == search_term,
                func.to_tsvector('arabic', func.coalesce(ShortItemNo.description, '')).op('@@')(func.plainto_tsquery('arabic', search_term)),
                func.to_tsvector('english', func.coalesce(ShortItemNo.description, '')).op('@@')(func.plainto_tsquery('english', search_term))
            )
        )

    if category_slug:
        base_query = base_query.join(ShortItemNo.categories).where(
            or_(
                Category.slug == category_slug,
                Category.name == select(Category.name).where(Category.slug == category_slug).scalar_subquery(),
                Category.parent_id == select(Category.id).where(Category.slug == category_slug).scalar_subquery()
            )
        )

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

@router.get("/{product_id}", response_model=ProductShopRead)
@cache(expire=60)
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