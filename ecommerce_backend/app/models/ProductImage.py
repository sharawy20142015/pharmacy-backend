from sqlalchemy import Column, Integer, Text, ForeignKey, Boolean, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 1. توحيد الطول ليكون 40 مثل الجدول الرئيسي
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    img_url = Column(Text, nullable=False)
    is_main = Column(Boolean, default=False)
    alt_text = Column(String(100), nullable=True)

    # 2. إضافة foreign_keys هنا أيضاً ضروري جداً للـ sqladmin
    item = relationship(
        "ShortItemNo", 
        back_populates="additional_images",
        primaryjoin="ProductImage.short_item_no == ShortItemNo.short_item_no",
        foreign_keys=[short_item_no] # <--- السطر ده هو اللي هيشيل الـ KeyError
    )