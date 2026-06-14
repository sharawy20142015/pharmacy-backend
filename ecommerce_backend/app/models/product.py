from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey, Boolean, text, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from app.models.Tag import product_tags_association
from app.db.base import Base 

# ==========================================
# 1. الجدول الوسيط (BundleItem)
# ==========================================
class BundleItem(Base):
    __tablename__ = 'BundleItem'
    
    # 🟢 الربط هنا هيشتغل زي الفل لأننا خلينا العواميد اللي بيشاور عليها Unique
    bundle_name = Column(String(150), ForeignKey('Bundle.name_en', ondelete='CASCADE'), primary_key=True)
    short_item_no = Column(String(40), ForeignKey('Product.short_item_no', ondelete='CASCADE'), primary_key=True)
    
    quantity = Column(Integer, default=1, server_default=text("1"), nullable=False) 
    
    # نسبة الخصم الخاصة بالمنتج جوه الباقة (مثال: 10.00 لـ 10%)
    discount_percentage = Column(Numeric(5, 2), default=0.00, server_default=text("0.00"), nullable=False)
    
    # قيمة الخصم المباشرة بالجنيه للمنتج جوه الباقة (مثال: 25.00 لـ 25 جنيه)
    discount_value = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False)

    # العلاقات 
    product = relationship(
        'Product', 
        back_populates='bundle_links',
        primaryjoin="BundleItem.short_item_no == Product.short_item_no"
    )
    bundle = relationship(
        'Bundle', 
        back_populates='bundle_items',
        primaryjoin="BundleItem.bundle_name == Bundle.name_en"
    )

    def get_bundle_item_final_price(self):
        """دالة سحرية تحسب لك سعر المنتج ده 'جوه الباقة' بعد تطبيق الخصم المحدد له"""
        base_price = float(self.product.price or 0)
        dp = float(self.discount_percentage or 0)
        dv = float(self.discount_value or 0)
        
        if dp > 0:
            discount_amount = base_price * (dp / 100)
        else:
            discount_amount = dv
            
        return max(0, base_price - discount_amount)

# ==========================================
# 2. جدول المنتجات (Product)
# ==========================================
class Product(Base):
    __tablename__ = 'Product'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(150), unique=True, index=True, nullable=True) 

    # 🟢 هنا التعديل السحري: unique=True (عشان يقبل يتربط بيه كـ Foreign Key)
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False, index=True, unique=True)
    
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

    name = association_proxy('item_details', 'ar_name')
    en_name = association_proxy('item_details', 'en_name')

    tags = relationship(
        "Tag",
        secondary=product_tags_association,
        back_populates="products"
    )

    bundle_links = relationship(
        'BundleItem', 
        back_populates='product', 
        primaryjoin="Product.short_item_no == BundleItem.short_item_no",
        cascade="all, delete-orphan"
    )

    def calculate_final_price(self):
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

# ==========================================
# 3. جدول العروض/الباقات (Bundle)
# ==========================================
class Bundle(Base):
    __tablename__ = 'Bundle'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(150), unique=True, index=True, nullable=False) 
    
    name_ar = Column(String(150), nullable=False) 
    # 🟢 unique=True هنا ضرورية عشان BundleItem يقدر يشاور عليها
    name_en = Column(String(150), nullable=False, unique=True, index=True) 
    
    # تعديل العواميد لتصبح Text لتطابق الـ SQL TEXT وتمنع أخطاء الـ Length
    description = Column(Text)  
    image_url = Column(Text)  
    
    price = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False) 
    discount_fixed = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), nullable=False) 
    final_price = Column(Numeric(18, 2), default=0.00, server_default=text("0.00"), index=True) 
    
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bundle_items = relationship(
        'BundleItem', 
        back_populates='bundle', 
        primaryjoin="Bundle.name_en == BundleItem.bundle_name",
        cascade="all, delete-orphan"
    )
    
    products = association_proxy('bundle_items', 'product')

    def __repr__(self):
        return f"<Bundle(name={self.name_en}, final_price={self.final_price})>"