from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, String, Boolean, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from app.models.Tag import product_tags_association
from app.db.base import Base 

class Product(Base):
    __tablename__ = 'Product'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(150), unique=True, index=True, nullable=True) 

    # 1. تأكد أن العمود المعرف هنا كـ ForeignKey مطابق تماماً لنوع العمود في جدول ShortItemNo
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False, index=True)
    
    # 2. تحديث العلاقة: إضافة foreign_keys و uselist=False إذا كانت علاقة واحد لواحد
    item_details = relationship(
        'ShortItemNo', 
        back_populates='products',
        primaryjoin="Product.short_item_no == ShortItemNo.short_item_no",
        foreign_keys=[short_item_no] # صراحةً نخبر SQLAlchemy بالعمود المستخدم للربط
    )

    stock_quantity = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), index=True) 

    price = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False)
    discount_value = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False)
    discount_percentage = Column(Numeric(5, 2), default=0.00, server_default=text("0.00"), nullable=False)
    final_price = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), index=True)

    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    classification=Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # === Proxies ===
    name = association_proxy('item_details', 'ar_name')
    en_name = association_proxy('item_details', 'en_name')
    # ... بقية الـ proxies

    tags = relationship(
        "Tag",
        secondary=product_tags_association,
        back_populates="products"
    )

    def calculate_final_price(self):
        p = self.price or 0
        dp = self.discount_percentage or 0
        dv = self.discount_value or 0
        
        if dp > 0:
            amt = p * (dp / 100)
        else:
            amt = dv
        
        self.final_price = max(0, p - amt)
        return self.final_price

    def __repr__(self):
        return f"<Product(id={self.id}, sku={self.short_item_no})>"