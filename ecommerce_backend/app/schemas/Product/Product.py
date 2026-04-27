from pydantic import BaseModel
from typing import Optional, List

# ==========================================
# 1. Schema: لستة المنتجات (البيانات مجمعة Flat ولكن بدون تكرار)
# ==========================================
class ProductFlatRead(BaseModel):
    id: int
    header: Optional[str] = None
    sub_header: Optional[str] = None
    price: float
    SKU: str
    discount_percentage: float
    final_price: float
    is_active: bool
    is_featured: bool
    en_name: Optional[str] = None
    Brand_Name: Optional[str] = None
    dosage: Optional[str] = None                # 👈 ضيف السطر ده
    usage_instructions: Optional[str] = None    # 👈 وضيف السطر ده
    # 🆕 بنستقبل الصور والفئات كلستة عشان نمنع تكرار المنتج في الفرونت إند
    images: List[str] = []
    categories: List[str] = []

    class Config:
        from_attributes = True

# ==========================================
# 2. Schema: تفاصيل منتج واحد (البيانات المجمعة بالكامل)
# ==========================================# ==========================================
# 2. Schema: تفاصيل منتج واحد (البيانات المجمعة بالكامل)
# ==========================================
class ProductShopRead(BaseModel):
    id: int
    price: float
    discount_value: float
    discount_percentage: float
    final_price: float
    quantity: float
    
    sku: Optional[str] = None
    ar_name: Optional[str] = None
    en_name: Optional[str] = None
    description: Optional[str] = None
    Brand_Name: Optional[str] = None
    
    header: Optional[str] = None
    sub_header: Optional[str] = None
    usage: Optional[str] = None
    warning: Optional[str] = None
    
    # 👈 1. ضفنا الحقول هنا عشان تظهر في الـ JSON اللي رايح للتطبيق
    dosage: Optional[str] = None
    usage_instructions: Optional[str] = None
    
    img_url1: Optional[str] = None
    img_url2: Optional[str] = None
    img_url3: Optional[str] = None
    img_url4: Optional[str] = None
    
    # 👈 2. ضفنا مصفوفة الصور عشان الـ Gallery بتاع الموبايل يشتغل صح
    images: List[str] = []
    
    category: Optional[str] = None

    class Config:
        from_attributes = True

    @staticmethod
    def map_from_orm(product):
        item = product.item_details
        
        safe_price = float(product.price) if product.price else 0.0
        safe_discount_val = float(product.discount_value) if product.discount_value else 0.0
        safe_discount_perc = float(product.discount_percentage) if product.discount_percentage else 0.0
        safe_final_price = float(product.final_price) if product.final_price else 0.0
        safe_quantity = float(product.stock_quantity) if getattr(product, 'stock_quantity', None) else 0.0

        if not item:
            return ProductShopRead(
                id=product.id, price=safe_price, discount_value=safe_discount_val,
                discount_percentage=safe_discount_perc, final_price=safe_final_price, quantity=safe_quantity
            )

        images_list = [img.img_url for img in item.additional_images] if item.additional_images else []
        img1 = images_list[0] if len(images_list) > 0 else "https://via.placeholder.com/300"
        
        cat_name = item.categories[0].name if getattr(item, 'categories', None) and len(item.categories) > 0 else "Uncategorized"

        return ProductShopRead(
            id=product.id, price=safe_price, discount_value=safe_discount_val,
            discount_percentage=safe_discount_perc, final_price=safe_final_price, quantity=safe_quantity,
            sku=item.short_item_no, ar_name=item.ar_name, en_name=item.en_name,
            description=item.description, Brand_Name=item.Brand_Name,
            header=item.header, sub_header=item.sub_header,
            usage=getattr(item, 'usage', None), 
            warning=getattr(item, 'warning', None),
            
            # 👈 3. قرأنا الداتا من الـ item (الداتا بيز) وحطيناها في المتغيرات
            dosage=getattr(item, 'dosage', None),
            usage_instructions=getattr(item, 'usage_instructions', None),
            
            img_url1=img1,
            img_url2=images_list[1] if len(images_list) > 1 else None,
            img_url3=images_list[2] if len(images_list) > 2 else None,
            img_url4=images_list[3] if len(images_list) > 3 else None,
            
            # 👈 4. بعتنا الصور كلها كـ Array للفرونت إند
            images=images_list, 
            
            category=cat_name
        )