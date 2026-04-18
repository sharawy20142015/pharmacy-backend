from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base 
from app.models.Category import product_category_association

class ShortItemNo(Base):
    __tablename__ = "ShortItemNo"
    
    # الـ SKU هو الـ Primary Key الوحيد والأساسي - عليه Index فعلاً
    short_item_no = Column(String(40), primary_key=True, nullable=False, index=True)
    
    # 🚀 الـ Indexes الجديدة هنا عشان سرعة البحث بالاسم
    ar_name = Column(String(200), nullable=True, index=True) 
    en_name = Column(String(200), nullable=True, index=True)
    
    description = Column(Text, nullable=True)
    
    # الماركة - عليه Index فعلاً وده ممتاز للفلترة
    Brand_Name = Column(String(200), nullable=True, index=True)
    
    header = Column(String(200), nullable=True)
    sub_header = Column(String(200), nullable=True)

    # --- العلاقات (Relationships) ---
    
    # الصور الإضافية
    additional_images = relationship(
        "ProductImage", 
        back_populates="item", 
        cascade="all, delete-orphan"
    )
    
    # ربط الصنف بالأسعار والمخزن
    products = relationship(
        'Product', 
        back_populates='item_details', 
        cascade="all, delete-orphan"
    )
    
    # المشتريات والمبيعات (لأرشفة البيانات)
    purchases = relationship('Purchase', back_populates='item_details')
    return_sales = relationship('ReturnSales', back_populates='item_details')
    
    # التصنيفات (New Arrival / Offers)
    classifications = relationship('Classification', back_populates='item_details')

    # الأقسام (Many-to-Many)
    categories = relationship(
        "Category",
        secondary=product_category_association,
        back_populates="items"
    )

    def __repr__(self):
        return str(self.short_item_no)