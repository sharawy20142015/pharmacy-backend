from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

# 🟢 استيراد أداة الكاش
from fastapi_cache.decorator import cache

from app.db.session import get_db
from app.models.product import Product
from app.models.ProductImage import ProductImage 
from app.schemas.Product.Product import ProductShopRead 

router = APIRouter(
    prefix="/classifications",
    tags=["Classifications"]
)

@router.get("/products", response_model=List[ProductShopRead])
@cache(expire=120) # 🟢 كاش لمدة دقيقتين لتخفيف الضغط مع سرعة تحديث العروض
async def get_products_by_classification(
    type: str = Query(..., description="Type: 'New Arrivals' or 'Offer'"),
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """
    جلب المنتجات حسب التصنيف (New Arrivals / Offers)
    يربط بين جدول المنتجات، جدول الصور (الصورة الأساسية)، وجدول ShortItemNo (المسميات)
    """
    try:
        # 1. الاستعلام الأساسي (بنجيب المنتج + الصورة الأساسية + تفاصيل الاسم والوصف)
        query = (
            select(Product, ProductImage.img_url)
            .join(
                ProductImage, 
                (Product.short_item_no == ProductImage.short_item_no) & (ProductImage.is_main == 1), 
                isouter=True
            )
            .options(selectinload(Product.item_details)) 
        )

        # 2. فلترة ذكية للصفحة الرئيسية
        if type == "New Arrivals":
            query = query.where((Product.classification == type) | (Product.is_new_arrival == 1))
        else:
            query = query.where(Product.classification == type)
            
        query = query.limit(limit)

        result = await db.execute(query)
        rows = result.all()

        final_list = []
        for product, main_img_url in rows:
            # details هنا بتمثل صفحة الـ ShortItemNo اللي فيها الأسماء والوصف
            details = product.item_details
            
            # 3. بناء الداتا بأسماء تتطابق مع الـ Schema (ProductShopRead)
            product_data = {
                "id": product.id,
                "slug": product.slug,
                "short_item_no": product.short_item_no,
                
                # 👇 تم التعديل لـ en_name عشان الـ Schema تقرأها صح
                "en_name": details.en_name if details and details.en_name else "Unknown Product",
                
                # 👇 ضفنا الاسم بالعربي والوصف كمان تحسباً لو احتجتهم
                "ar_name": details.ar_name if details and details.ar_name else "بدون اسم",
                "description": details.description if details and details.description else "",
                
                "price": product.price,
                "discount_value": product.discount_value or 0.0,
                "discount_percentage": product.discount_percentage or 0.0,
                "final_price": product.final_price,
                
                "quantity": product.stock_quantity, 
                
                # 👇 تم التعديل لـ classification بدل category_name
                "classification": details.Brand_Name if details and details.Brand_Name else (product.classification or "General"),
                
                "is_active": product.is_active,
                "is_featured": product.is_featured,
                "is_new_arrival": product.is_new_arrival,
                
                "img_url1": main_img_url if main_img_url else None
            }
            
            try:
                # تحويل القاموس إلى Schema
                final_list.append(ProductShopRead(**product_data))
            except Exception as val_error:
                print(f"Validation Error for Product SKU {product.short_item_no}: {val_error}")
                continue

        return final_list

    except Exception as e:
        print(f"Critical Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")