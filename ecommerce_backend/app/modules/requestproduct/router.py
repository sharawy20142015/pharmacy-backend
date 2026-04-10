from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas
from app.db.session import get_db

router = APIRouter(
    prefix="/requests",
    tags=["Product Requests"]
)

@router.post("/create", response_model=schemas.ProductRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_product_request(request: schemas.ProductRequestCreate, db: AsyncSession = Depends(get_db)):
    new_request = models.ProductRequest(**request.model_dump())
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)
    return new_request

@router.get("/", response_model=list[schemas.ProductRequestResponse])
async def get_all_requests(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.ProductRequest).order_by(models.ProductRequest.created_at.desc()))
    return result.scalars().all()

@router.patch("/{request_id}/status", response_model=schemas.ProductRequestResponse)
async def update_request_status(
    request_id: int, 
    status_update: schemas.ProductRequestUpdateStatus, # 👈 دلوقت هيلاقيها
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.ProductRequest).filter(models.ProductRequest.id == request_id))
    db_request = result.scalar_one_or_none()
    
    if not db_request:
        raise HTTPException(status_code=404, detail="الطلب غير موجود")
    
    db_request.status = status_update.status
    await db.commit()
    await db.refresh(db_request)
    return db_request