import pandas as pd
import io
import re
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import (
    ShortItemNo, Product, Category, Tag, 
    ProductImage, Warehouse, TransactionType
)

def create_slug(text):
    if not text: return ""
    # تحويل النص لـ Slug متوافق مع الروابط (يدعم العربي والإنجليزي)
    text = str(text).lower().strip()
    text = re.sub(r'[^a-z0-9\u0600-\u06FF\s-]', '', text)
    text = re.sub(r'[\s]+', '-', text)
    return text

def generate_product_template():
    """توليد ملف إكسيل فارغ بالأعمدة المطلوبة"""
    columns = [
        "short_item_no", "ar_name", "en_name", "header", "sub_header", 
        "description", "brand", "price", "discount_value", "discount_percentage", 
        "stock", "categories", "tags", "images"
    ]
    df = pd.DataFrame(columns=columns)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Data_Import')
    output.seek(0)
    return output

async def process_excel_import(file_content: bytes, db: AsyncSession):
    """معالجة ملف الإكسيل المرفوع وتحديث قاعدة البيانات"""
    try:
        df = pd.read_excel(io.BytesIO(file_content))
        # تنظيف البيانات من القيم الفارغة (NaN)
        df = df.where(pd.notnull(df), None)
    except Exception as e:
        return {"error": f"Invalid Excel Format: {str(e)}"}

    results = {"added": 0, "updated": 0, "errors": []}

    for index, row in df.iterrows():
        try:
            short_code = str(row['short_item_no']).strip()
            if not short_code or short_code == 'None': continue

            # 1. التعامل مع تعريف الصنف (ShortItemNo)
            stmt = select(ShortItemNo).where(ShortItemNo.short_item_no == short_code)
            item = (await db.execute(stmt)).scalars().first()

            if not item:
                item = ShortItemNo(
                    short_item_no=short_code,
                    ar_name=row.get('ar_name'),
                    en_name=row.get('en_name'),
                    header=row.get('header'),
                    sub_header=row.get('sub_header'),
                    description=row.get('description'),
                    Brand_Name=row.get('brand')
                )
                db.add(item)
                await db.flush() # الحصول على id الصنف فوراً
            else:
                # تحديث البيانات الأساسية لو الصنف موجود
                item.ar_name = row.get('ar_name') or item.ar_name
                item.header = row.get('header') or item.header
                item.description = row.get('description') or item.description

            # 2. معالجة الصور الإضافية (Gallery)
            if row.get('images'):
                urls = [u.strip() for u in str(row.get('images')).split('|') if u.strip()]
                for i, url in enumerate(urls):
                    img_stmt = select(ProductImage).where(
                        (ProductImage.short_item_id == item.id) & (ProductImage.img_url == url)
                    )
                    if not (await db.execute(img_stmt)).scalars().first():
                        db.add(ProductImage(short_item_id=item.id, img_url=url, is_main=(i == 0)))

            # 3. التعامل مع المنتج المسعر (Product)
            p_stmt = select(Product).where(Product.short_item_id == item.id)
            product = (await db.execute(p_stmt)).scalars().first()
            
            price = float(row.get('price') or 0)
            d_val = float(row.get('discount_value') or 0)
            d_per = float(row.get('discount_percentage') or 0)
            new_stock = float(row.get('stock') or 0)

            if not product:
                product = Product(
                    short_item_id=item.id,
                    slug=create_slug(f"{row.get('en_name') or 'item'}-{short_code}"),
                    price=price,
                    discount_value=d_val,
                    discount_percentage=d_per,
                    stock_quantity=new_stock,
                    is_active=True
                )
                product.calculate_final_price()
                db.add(product)
                await db.flush()
                
                # 4. تسجيل حركة مخزن أول مدة (Inventory Adjustment)
                if new_stock > 0:
                    db.add(Warehouse(
                        product_id=product.id,
                        transaction_type=TransactionType.ADJUSTMENT,
                        quantity=new_stock,
                        unit_price=price,
                        notes="Initial Excel Import"
                    ))
                results["added"] += 1
            else:
                # تحديث السعر والمخزن
                old_stock = product.stock_quantity
                product.price = price
                product.discount_value = d_val
                product.discount_percentage = d_per
                product.stock_quantity = new_stock # تحديث مباشر للمخزن
                product.calculate_final_price()
                
                # تسجيل حركة تعديل لو المخزن اختلف
                if old_stock != new_stock:
                    db.add(Warehouse(
                        product_id=product.id,
                        transaction_type=TransactionType.ADJUSTMENT,
                        quantity=new_stock - old_stock,
                        unit_price=price,
                        notes="Excel Stock Update"
                    ))
                results["updated"] += 1

            # 5. معالجة التاجات (Tags)
            if row.get('tags'):
                t_names = [t.strip() for t in str(row.get('tags')).split(',') if t.strip()]
                for tn in t_names:
                    tslug = create_slug(tn)
                    tag = (await db.execute(select(Tag).where(Tag.slug == tslug))).scalars().first()
                    if not tag:
                        tag = Tag(name=tn, slug=tslug)
                        db.add(tag)
                        await db.flush()
                    
                    # ربط التاج بالمنتج لو مش مربوط
                    # ملاحظة: التحقق من وجود التاج في product.tags يحتاج لـ await لو كانت العلاقة lazy
                    product.tags.append(tag) 

            # 6. معالجة الأقسام (Categories)
            if row.get('categories'):
                c_names = [c.strip() for c in str(row.get('categories')).split(',') if c.strip()]
                for cn in c_names:
                    cslug = create_slug(cn)
                    c_obj = (await db.execute(select(Category).where(Category.slug == cslug))).scalars().first()
                    if not c_obj:
                        c_obj = Category(name=cn, slug=cslug, level=0)
                        db.add(c_obj)
                        await db.flush()
                    if c_obj not in item.categories:
                        item.categories.append(c_obj)

        except Exception as e:
            results["errors"].append(f"Row {index+2}: {str(e)}")
            continue

    await db.commit()
    return results