from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.db.base import Base 
from app.models.Category import product_category_association

class ShortItemNo(Base):
    __tablename__ = "ShortItemNo"
    
    # الـ SKU هو الـ Primary Key الوحيد والأساسي
    short_item_no = Column(String(40), primary_key=True, nullable=False, index=True)
    
    ar_name = Column(String(100), nullable=True)
    en_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    Brand_Name = Column(String(100), nullable=True, index=True)
    header = Column(String(100), nullable=True)
    sub_header = Column(String(100), nullable=True)

    # العلاقات
    additional_images = relationship("ProductImage", back_populates="item", cascade="all, delete-orphan")
    products = relationship('Product', back_populates='item_details', cascade="all, delete-orphan")
    purchases = relationship('Purchase', back_populates='item_details')
    return_sales = relationship('ReturnSales', back_populates='item_details')
    classifications = relationship('Classification', back_populates='item_details')

    categories = relationship(
        "Category",
        secondary=product_category_association,
        back_populates="items"
    )

    def __repr__(self):
        return str(self.short_item_no)