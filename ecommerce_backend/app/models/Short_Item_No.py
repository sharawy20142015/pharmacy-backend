from sqlalchemy import Column, String, Integer, Text
from sqlalchemy.orm import relationship
from app.db.base import Base 
from app.models.Category import product_category_association

class ShortItemNo(Base):
    __tablename__ = "ShortItemNo"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    short_item_no = Column(String(40), unique=True, nullable=False, index=True)
    
    ar_name = Column(String(100), nullable=True)
    en_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    
    Brand_Name = Column(String(100), nullable=True, index=True)

    # ✅✅✅ ضيف السطرين دول هنا ضروري ✅✅✅
    header = Column(String(100), nullable=True)      # العنوان الرئيسي
    sub_header = Column(String(100), nullable=True)  # العنوان الفرعي

    # العلاقة الجديدة مع جدول الصور
    additional_images = relationship("ProductImage", back_populates="item", cascade="all, delete-orphan")

    # ضيف الـ primaryjoin هنا كمان عشان الـ Admin Portal يقدر يقرا العلاقة في الاتجاهين
    products = relationship(
        'Product', 
        back_populates='item_details', 
        cascade="all, delete-orphan",
        primaryjoin="Product.short_item_no == ShortItemNo.short_item_no" # السطر ده مهم جداً
    )   
    purchases = relationship('Purchase', back_populates='item_details')

    categories = relationship(
        "Category",
        secondary=product_category_association,
        back_populates="items"
    )

    def __repr__(self):
        return str(self.short_item_no) if self.short_item_no else "New Item"