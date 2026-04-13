from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
# استيراد الموديلات الأساسية
from app.models import ShortItemNo, Product, ProductImage, Category
# استيراد الـ Schema
from app.modules.adding_products.schemas import ProductAdminCreate

# تعريف الـ Router
router = APIRouter(
    prefix="/products",
    tags=["Admin Products Management"]
)

@router.post("/admin/add", status_code=status.HTTP_201_CREATED)
async def create_product_from_admin(
    payload: ProductAdminCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    إضافة منتج جديد وتوزيعه على جداول: ShortItemNo, Product, ProductImage 
    مع ربطه بالفئات المختارة (Many-to-Many)
    """
    
    # 1. التأكد إن الـ SKU مش مكرر لتجنب IntegrityError
    check_stmt = select(ShortItemNo).where(ShortItemNo.short_item_no == payload.short_item_no)
    result = await db.execute(check_stmt)
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="الكود المختصر (SKU) موجود مسبقاً!")

    try:
        # 2. إنشاء كائن الكتالوج الأساسي (ShortItemNo)
        new_item = ShortItemNo(
            short_item_no=payload.short_item_no,
            ar_name=payload.ar_name,
            en_name=payload.en_name,
            description=payload.description,
            Brand_Name=payload.brand_name,
            header=payload.header,
            sub_header=payload.sub_header
        )

        # 🟢 ربط الفئات (Many-to-Many)
        if payload.category_ids:
            cat_stmt = select(Category).where(Category.id.in_(payload.category_ids))
            cat_result = await db.execute(cat_stmt)
            categories_list = cat_result.scalars().all()
            
            if not categories_list:
                # اختياري: يمكنك رفع خطأ إذا كانت الـ IDs غير صحيحة
                pass 
            
            new_item.categories = categories_list # SQLAlchemy سيتولى ملء جدول الربط تلقائياً

        db.add(new_item)
        
        # 3. إنشاء بيانات التسعير والمخزون (Product)
        # إنشاء Slug فريد
        base_slug = payload.en_name.replace(" ", "-").lower() if payload.en_name else payload.short_item_no
        
        new_product = Product(
            short_item_no=payload.short_item_no,
            slug=f"{base_slug}-{payload.short_item_no}",
            price=payload.price,
            discount_percentage=payload.discount_percentage,
            discount_value=payload.discount_value,
            stock_quantity=payload.stock_quantity,
            classification=payload.classification,
            is_active=payload.is_active,
            is_featured=payload.is_featured,
            is_new_arrival=payload.is_new_arrival
        )
        
        # استدعاء دالة حساب السعر النهائي الموجودة في الموديل عندك
        new_product.calculate_final_price()
        db.add(new_product)

        # 4. إضافة الصورة الرئيسية (ProductImage)
        if payload.main_image_url:
            new_image = ProductImage(
                short_item_no=payload.short_item_no,
                img_url=payload.main_image_url,
                is_main=True,
                alt_text=payload.ar_name 
            )
            db.add(new_image)

        # 5. حفظ كل التغييرات في الجداول الثلاثة وجدول الربط مرة واحدة
        await db.commit()
        
        return {
            "status": "success",
            "message": "تم إضافة المنتج بنجاح وربطه بالفئات",
            "short_item_no": payload.short_item_no,
            "categories_linked": len(payload.category_ids)
        }

    except Exception as e:
        # في حالة حدوث أي خطأ، يتم التراجع عن كل العمليات السابقة
        await db.rollback()
        print(f"Error while adding product: {str(e)}") # للـ Debugging في السيرفر
        raise HTTPException(
            status_code=500, 
            detail=f"حدث خطأ أثناء الحفظ في قاعدة البيانات: {str(e)}"
        )