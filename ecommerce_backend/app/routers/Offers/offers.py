from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.product import Product
# التأكد من صحة هذا السطر

router = APIRouter(
    prefix="/offers",
    tags=["Offers"]
)

@router.get("/")
async def get_all_offers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).options(selectinload(Product.item_details))
    )
    return result.scalars().all()