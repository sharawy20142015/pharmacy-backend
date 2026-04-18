from sqlalchemy import Column, Integer, Text, ForeignKey, Boolean, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 🚀 التعديل هنا: إضافة index=True لضمان سرعة الربط (Join) مع جدول الأصناف
    # الطول 40 والنوع String متطابقين تماماً مع الجدول الرئيسي ShortItemNo
    short_item_no = Column(
        String(40), 
        ForeignKey('ShortItemNo.short_item_no'), 
        nullable=False, 
        index=True  # 👈 أهم سطر لسرعة عرض صور المنتجات
    )
    
    img_url = Column(Text, nullable=False)
    is_main = Column(Boolean, default=False, index=True) # ضفنا Index هنا كمان عشان سرعة جلب الصورة الأساسية فقط
    alt_text = Column(String(200), nullable=True)

    # --- العلاقات (Relationships) ---
    
    # الربط المباشر مع الصنف (ShortItemNo)
    item = relationship(
        "ShortItemNo", 
        back_populates="additional_images"
    )

    def __str__(self):
        # تجميل شكل البيانات في لوحة التحكم (Admin Portal)
        status = "⭐ Main" if self.is_main else "🖼️ Extra"
        return f"{status} | SKU: {self.short_item_no}"

    def __repr__(self):
        return f"<ProductImage(sku={self.short_item_no}, is_main={self.is_main})>"