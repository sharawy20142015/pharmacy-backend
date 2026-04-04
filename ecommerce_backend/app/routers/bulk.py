from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
# استيراد الموديلات الخاصة بك
from app.models import Product, ShortItemNo, Category, ProductImage, Tag, product_tags_association
import pandas as pd
import io
from slugify import slugify 

router = APIRouter(prefix="/bulk", tags=["Bulk Operations"])

# --- أدوات المساعدة ---
def clean_str(value):
    if pd.isna(value) or str(value).strip().lower() == 'nan':
        return None
    return str(value).strip()

def clean_num(value, default=0.0):
    if pd.isna(value): return default
    try: return float(value)
    except: return default

@router.post("/upload-products")
async def upload_products(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="يرجى رفع ملف إكسيل (.xlsx)")
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        df.columns = df.columns.str.strip()
        
        # كاش للأقسام والتاجات لتقليل الـ DB Queries
        category_cache = {}
        tag_cache = {}
        processed_count = 0

        for _, row in df.iterrows():
            item_no = clean_str(row.get("short_item_no"))
            if not item_no: continue

            # 1. معالجة القسم (Category)
            cat_name = clean_str(row.get("category_name"))
            cat_id = None
            if cat_name:
                if cat_name in category_cache:
                    cat_id = category_cache[cat_name]
                else:
                    stmt = select(Category).where(Category.name == cat_name)
                    res = await db.execute(stmt)
                    cat_obj = res.scalar_one_or_none()
                    if not cat_obj:
                        cat_obj = Category(name=cat_name, slug=slugify(cat_name))
                        db.add(cat_obj)
                        await db.flush()
                    category_cache[cat_name] = cat_obj.id
                    cat_id = cat_obj.id

            # 2. إنشاء أو تحديث تعريف الصنف (ShortItemNo)
            stmt_item = select(ShortItemNo).where(ShortItemNo.short_item_no == item_no)
            item_res = await db.execute(stmt_item)
            item_obj = item_res.scalar_one_or_none()

            if not item_obj:
                item_obj = ShortItemNo(short_item_no=item_no)
                db.add(item_obj)
            
            item_obj.ar_name = clean_str(row.get("ar_name"))
            item_obj.en_name = clean_str(row.get("en_name"))
            item_obj.Brand_Name = clean_str(row.get("brand_name"))
            item_obj.description = clean_str(row.get("description"))
            item_obj.header = clean_str(row.get("header"))
            item_obj.sub_header = clean_str(row.get("sub_header"))
            
            # ربط الصنف بالقسم (Many-to-Many)
            if cat_id and cat_id not in [c.id for c in item_obj.categories]:
                stmt_cat = select(Category).where(Category.id == cat_id)
                res_cat = await db.execute(stmt_cat)
                item_obj.categories.append(res_cat.scalar_one())

            await db.flush()

            # 3. إنشاء أو تحديث بيانات العرض والسعر (Product)
            stmt_prod = select(Product).where(Product.short_item_no == item_no)
            prod_res = await db.execute(stmt_prod)
            product_obj = prod_res.scalar_one_or_none()

            if not product_obj:
                # توليد Slug من الاسم الإنجليزي أو كود الصنف
                slug_base = item_obj.en_name if item_obj.en_name else item_no
                product_obj = Product(short_item_no=item_no, slug=slugify(slug_base))
                db.add(product_obj)
            
            product_obj.price = clean_num(row.get("price"))
            product_obj.discount_percentage = clean_num(row.get("discount_percentage"))
            product_obj.discount_value = clean_num(row.get("discount_value"))
            product_obj.stock_quantity = clean_num(row.get("stock_quantity"))
            product_obj.is_featured = bool(row.get("is_featured", False))
            
            # حساب السعر النهائي آلياً بناءً على الدالة اللي في الموديل
            product_obj.calculate_final_price()

            # 4. معالجة الصور (الأساسية والإضافية)
            # الصورة الأساسية
            main_img = clean_str(row.get("main_image_url"))
            if main_img:
                stmt_img = select(ProductImage).where(ProductImage.short_item_no == item_no, ProductImage.img_url == main_img)
                if not (await db.execute(stmt_img)).scalar_one_or_none():
                    db.add(ProductImage(short_item_no=item_no, img_url=main_img, is_main=True))

            # الصور الإضافية (مفصولة بفاصلة)
            extra_imgs = clean_str(row.get("extra_images"))
            if extra_imgs:
                for img_url in extra_imgs.split(','):
                    img_url = img_url.strip()
                    if img_url:
                        stmt_img = select(ProductImage).where(ProductImage.short_item_no == item_no, ProductImage.img_url == img_url)
                        if not (await db.execute(stmt_img)).scalar_one_or_none():
                            db.add(ProductImage(short_item_no=item_no, img_url=img_url, is_main=False))

            # 5. معالجة التاجات (Tags)
            tags_str = clean_str(row.get("tags"))
            if tags_str:
                for t_name in tags_str.split(','):
                    t_name = t_name.strip()
                    if t_name:
                        if t_name in tag_cache:
                            tag_obj = tag_cache[t_name]
                        else:
                            stmt_tag = select(Tag).where(Tag.name == t_name)
                            tag_obj = (await db.execute(stmt_tag)).scalar_one_or_none()
                            if not tag_obj:
                                tag_obj = Tag(name=t_name)
                                db.add(tag_obj)
                                await db.flush()
                            tag_cache[t_name] = tag_obj
                        
                        if tag_obj not in product_obj.tags:
                            product_obj.tags.append(tag_obj)

            processed_count += 1
            if processed_count % 50 == 0:
                await db.commit()

        await db.commit()
        return {"status": "success", "total_processed": processed_count}

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))