from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey, Boolean, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from app.models.Tag import product_tags_association
from app.db.base import Base 

class Product(Base):
    __tablename__ = 'Product'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(150), unique=True, index=True, nullable=True) 

    # 1. الربط بالـ Primary Key الجديد (short_item_no) بطول 40
    # تأكد أن النوع والطول متطابقين تماماً مع الجدول الرئيسي
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False, index=True)
    
    # 2. العلاقة أصبحت بسيطة جداً لأننا نربط بالـ PK الفعلي
    # شلنا الـ primaryjoin اليدوي لأن SQLAlchemy هيفهمه لوحده دلوقتي
    item_details = relationship(
        'ShortItemNo', 
        back_populates='products'
    )

    stock_quantity = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), index=True) 

    price = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False)
    discount_value = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False)
    discount_percentage = Column(Numeric(5, 2), default=0.00, server_default=text("0.00"), nullable=False)
    final_price = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), index=True)

    is_active = Column(Boolean, default=True, index=True)
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    
    classification = Column(String(50))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # === Proxies ===
    # دول بيخلونا نوصل للاسم العربي والإنجليزي من كائن المنتج مباشرة
    name = association_proxy('item_details', 'ar_name')
    en_name = association_proxy('item_details', 'en_name')

    # علاقة التاجات (Many-to-Many)
    tags = relationship(
        "Tag",
        secondary=product_tags_association,
        back_populates="products"
    )

    def calculate_final_price(self):
        """دالة لحساب السعر النهائي بعد الخصم"""
        # تحويل القيم لـ float لضمان الحساب الصحيح
        p = float(self.price or 0)
        dp = float(self.discount_percentage or 0)
        dv = float(self.discount_value or 0)
        
        if dp > 0:
            amt = p * (dp / 100)
        else:
            amt = dv
        
        self.final_price = max(0, p - amt)
        return self.final_price

    def __repr__(self):
        return f"<Product(sku={self.short_item_no}, price={self.final_price})>"

    def __str__(self):
        return f"Price for {self.short_item_no}"