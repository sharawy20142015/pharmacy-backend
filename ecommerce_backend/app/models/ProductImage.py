from sqlalchemy import Column, Integer, Text, ForeignKey, Boolean, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 1. الربط مباشرة بالـ Primary Key الجديد (short_item_no) بطول 40
    # النوع والطول لازم يكونوا متطابقين تماماً مع الجدول الرئيسي لتجنب إيرور الـ SQL Server
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    img_url = Column(Text, nullable=False)
    is_main = Column(Boolean, default=False)
    alt_text = Column(String(100), nullable=True)

    # 2. العلاقة أصبحت مباشرة وبسيطة (Standard Relationship)
    # sqladmin هيفهمها لوحده ومش هيطلع KeyError لأن الربط بالـ PK الفعلي
    item = relationship(
        "ShortItemNo", 
        back_populates="additional_images"
    )

    def __str__(self):
        # دي بتخلي الصورة تظهر بشكل نظيف في لوحة التحكم (اسم الصنف + الرابط)
        status = "Main" if self.is_main else "Extra"
        return f"[{status}] {self.short_item_no} - {self.img_url[:30]}..."

    def __repr__(self):
        return f"<ProductImage(sku={self.short_item_no}, is_main={self.is_main})>"