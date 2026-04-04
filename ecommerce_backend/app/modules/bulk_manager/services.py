import pandas as pd
import io
import numpy as np
import logging
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from slugify import slugify
from app.models import ShortItemNo, Product, ProductImage, Category

# إعداد اللوجر لمتابعة العمليات
logger = logging.getLogger("sqlalchemy.engine")

class BulkService:
    @staticmethod
    async def get_or_create_category(db, cat_name: str):
        """دالة ذكية للبحث عن القسم أو إنشائه لتجنب الـ Duplicate Key"""
        if not cat_name:
            return None
        
        cat_name = cat_name.strip()
        # 1. البحث عن القسم بالاسم
        stmt = select(Category).where(Category.name == cat_name)
        result = await db.execute(stmt)
        category = result.scalars().first()
        
        # 2. إذا لم يوجد، نقوم بإنشائه فوراً وعمل flush
        if not category:
            new_slug = slugify(cat_name)
            category = Category(name=cat_name, slug=new_slug)
            db.add(category)
            try:
                await db.flush() # توفير الـ ID للربط في نفس اللحظة
            except Exception:
                # في حالة حدوث سباق (Race Condition) ابحث عنه مرة أخرى
                await db.rollback()
                result = await db.execute(stmt)
                category = result.scalars().first()
                
        return category

    @staticmethod
    async def process_excel(file_content: bytes, db):
        # قراءة ملف الإكسيل
        df = pd.read_excel(io.BytesIO(file_content))
        # تحويل الـ NaN لقيم None عشان الـ Database تفهمها
        df = df.replace({np.nan: None})
        
        added_count = 0
        updated_count = 0
        errors = []

        for index, row in df.iterrows():
            sku = str(row.get('short_item_no', '')).strip()
            if not sku or sku == 'None':
                continue

            try:
                # استخدام Transaction فرعية لكل سطر (Savepoint)
                # دي بتضمن إن لو سطر فشل، الباقي يكمل عادي
                async with db.begin_nested():
                    
                    # --- 1. إدارة ShortItemNo ---
                    # بنستخدم selectinload عشان نحمل الأقسام المرتبطة ونعدلها
                    stmt = select(ShortItemNo).where(ShortItemNo.short_item_no == sku).options(selectinload(ShortItemNo.categories))
                    result = await db.execute(stmt)
                    item = result.scalars().first()
                    
                    if not item:
                        item = ShortItemNo(short_item_no=sku)
                        db.add(item)
                    
                    item.ar_name = row.get('ar_name')
                    item.en_name = row.get('en_name')
                    item.description = row.get('description')

                    # --- 2. إدارة الأقسام (حل مشكلة الـ Rollback) ---
                    categories_input = row.get('categories')
                    if categories_input:
                        # تقسيم الأقسام لو كانت أكتر من واحد (مثلاً: أدوية, العناية بالبشرة)
                        cat_names = [c.strip() for c in str(categories_input).split(',') if c.strip()]
                        
                        # تصفير الأقسام الحالية وإعادة ربطها (أو التحقق من الموجود)
                        item.categories = [] 
                        for name in cat_names:
                            cat_obj = await BulkService.get_or_create_category(db, name)
                            if cat_obj and cat_obj not in item.categories:
                                item.categories.append(cat_obj)

                    # --- 3. إدارة المنتج (Product) والأسعار ---
                    p_stmt = select(Product).where(Product.short_item_no == sku)
                    p_res = await db.execute(p_stmt)
                    product = p_res.scalars().first()
                    
                    if not product:
                        p_slug = slugify(str(item.en_name or item.ar_name or sku))
                        product = Product(short_item_no=sku, slug=p_slug)
                        db.add(product)
                        added_count += 1
                    else:
                        updated_count += 1

                    # تحديث البيانات المالية
                    product.price = float(row.get('price', 0))
                    product.stock_quantity = int(row.get('stock_quantity', 0))
                    # دالة حساب السعر النهائي (لو موجودة في الـ Model عندك)
                    if hasattr(product, 'calculate_final_price'):
                        product.calculate_final_price()

                    # --- 4. إدارة الصور ---
                    img_url = row.get('main_image_url')
                    if img_url:
                        img_stmt = select(ProductImage).where(
                            ProductImage.short_item_no == sku, 
                            ProductImage.is_main == True
                        )
                        img_res = await db.execute(img_stmt)
                        img_obj = img_res.scalars().first()
                        
                        if img_obj:
                            img_obj.img_url = img_url
                        else:
                            db.add(ProductImage(short_item_no=sku, img_url=img_url, is_main=True))

                # عمل Flush بعد كل سطر ناجح لتثبيت الـ Savepoint
                await db.flush()

            except Exception as e:
                error_msg = f"خطأ في السطر {index + 2} (SKU: {sku}): {str(e)}"
                logger.error(error_msg)
                errors.append(error_msg)
                # السطر ده هيفشل لوحده والـ begin_nested هتعمله Rollback 
                # لكن البرنامج هيكمل للسطر اللي بعده

        # حفظ كل التعديلات الناجحة في قاعدة البيانات
        await db.commit()
        
        return {
            "status": "completed",
            "added": added_count,
            "updated": updated_count,
            "errors": errors
        }