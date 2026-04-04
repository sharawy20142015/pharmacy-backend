from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from .models import Governorate
from .schemas import GovernorateRead

router = APIRouter(prefix="/shipping", tags=["Shipping & Locations"])

@router.get("/locations", response_model=List[GovernorateRead])
async def get_all_locations(db: AsyncSession = Depends(get_db)):
    """
    جلب جميع المحافظات مع مدنها لعرضها في تطبيق الموبايل (Checkout).
    """
    try:
        query = (
            select(Governorate)
            .where(Governorate.is_active == True)
            .options(selectinload(Governorate.cities))
        )
        result = await db.execute(query)
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail="حدث خطأ في جلب الأماكن")