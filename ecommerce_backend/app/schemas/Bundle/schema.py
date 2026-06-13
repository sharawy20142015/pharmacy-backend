# app/schemas/Bundle/schema.py

from pydantic import BaseModel, model_validator
from typing import List, Optional
from decimal import Decimal

# 1️⃣ شكل المنتج الذكي (يقوم بسحب الصور والأسماء والعلاقات بدون Loops في الراوتر)
class BundleItemResponse(BaseModel):
    short_item_no: str
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    original_price: Decimal
    bundle_final_price: Decimal
    quantity: int
    discount_percentage: Decimal
    discount_value: Decimal
    image: Optional[str] = None

    class Config:
        from_attributes = True

    @model_validator(mode="before")
    @classmethod
    def map_from_orm_efficiently(cls, data):
        # لو البيانات داخلة ككائن SQLAlchemy (ORM) بنفكها طيران بسرعة الـ Core
        if hasattr(data, "product") and data.product:
            prod = data.product
            details = prod.item_details
            
            # قنص الصورة الرئيسية (is_main == True) بدون Loops تقليدية
            prod_img_url = None
            if details and details.additional_images:
                main_img_obj = next((img for img in details.additional_images if img.is_main), None)
                prod_img_url = main_img_obj.img_url if main_img_obj else details.additional_images[0].img_url

            return {
                "short_item_no": data.short_item_no,
                "name_ar": prod.name,          # بيقرا من الـ association proxy مباشرة
                "name_en": prod.en_name,       # بيقra من الـ association proxy مباشرة
                "original_price": prod.price,
                "bundle_final_price": data.get_bundle_item_final_price(), # دالة الحساب الذكية
                "quantity": data.quantity,
                "discount_percentage": data.discount_percentage,
                "discount_value": data.discount_value,
                "image": prod_img_url
            }
        return data


# 2️⃣ شكل الباقة النهائي المطور للأداء
class BundleResponse(BaseModel):
    id: int
    slug: str
    name_ar: str
    name_en: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Decimal
    discount_fixed: Decimal
    final_price: Decimal
    is_active: bool
    products: List[BundleItemResponse]

    class Config:
        from_attributes = True

    @model_validator(mode="before")
    @classmethod
    def map_bundle_from_orm(cls, data):
        if hasattr(data, "bundle_items"):
            return {
                "id": data.id,
                "slug": data.slug,
                "name_ar": data.name_ar,
                "name_en": data.name_en,
                "description": data.description,
                "image_url": data.image_url,
                "price": data.price,
                "discount_fixed": data.discount_fixed,
                "final_price": data.final_price,
                "is_active": data.is_active,
                "products": data.bundle_items # بنباصي اللستة علطول لـ Pydantic وهو بيفكها داخلياً
            }
        return data