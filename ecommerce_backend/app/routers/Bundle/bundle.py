# app/routers/Bundle/bundle.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db 
from app.models.product import Bundle, BundleItem 
from app.models.product import Product 
from app.models.Short_Item_No import ShortItemNo 
from app.schemas.Bundle.schema import BundleResponse

router = APIRouter(prefix="/bundles", tags=["Bundles"])

@router.get("/", response_model=List[BundleResponse])
async def get_all_active_bundles(db: AsyncSession = Depends(get_db)):
    query = (
        select(Bundle)
        .where(Bundle.is_active == True)
        .options(
            selectinload(Bundle.bundle_items)
            .selectinload(BundleItem.product)
            .selectinload(Product.item_details)
            .selectinload(ShortItemNo.additional_images)
        )
    )
    result = await db.execute(query)
    # رجّع الـ scalars علطول، الـ Schema هتتكفل بالـ Mapping طيران وبدون أي بايثون Loops!
    return result.scalars().all()


@router.get("/{slug}", response_model=BundleResponse)
async def get_bundle_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    query = (
        select(Bundle)
        .where(Bundle.slug == slug)
        .options(
            selectinload(Bundle.bundle_items)
            .selectinload(BundleItem.product)
            .selectinload(Product.item_details)
            .selectinload(ShortItemNo.additional_images)
        )
    )
    result = await db.execute(query)
    bundle = result.scalar_one_or_none()
    
    if not bundle:
        raise HTTPException(status_code=404, detail="عفواً، هذه الباقة غير موجودة")
        
    return bundle