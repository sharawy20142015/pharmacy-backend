# E:\Sharawy\PharmacyApp\ecommerce_backend\app\models\Order.py

from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey, Enum, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(Base):
    __tablename__ = 'Orders'

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_number = Column(String(50), unique=True, index=True) # تم التوسيع لـ 50
    date = Column(DateTime, default=datetime.utcnow)
    
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    customer_info = relationship("Customer", back_populates="orders")

    # بيانات الشحن (Snapshot)
    shipping_first_name = Column(String(50))
    shipping_last_name = Column(String(50))
    shipping_governorate = Column(String(200))
    shipping_city = Column(String(200))
    shipping_details = Column(Text)
    shipping_phone = Column(String(20))

    # --- الحسابات المالية ---
    total_raw_amount = Column(Numeric(18, 2), default=0.00) 
    shipping_fees = Column(Numeric(18, 2), default=0.00)
    coupon_discount = Column(Numeric(18, 2), default=0.00) 
    
    # 👇 الحقول الجديدة الخاصة بخصم النقاط (Loyalty System) 👇
    points_discount = Column(Numeric(18, 2), default=0.00) # القيمة المالية المخصومة مقابل النقاط
    used_points = Column(Integer, default=0)               # عدد النقاط التي تم سحبها من العميل
    
    total_final_amount = Column(Numeric(18, 2), default=0.00) 

    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING, index=True)
    payment_method = Column(String(20), default="Cash")
    is_paid = Column(Boolean, default=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    coupon_id = Column(Integer, ForeignKey('coupons.id'), nullable=True)


class OrderItem(Base):
    __tablename__ = 'OrderItems'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey('Orders.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('Product.id'), nullable=False)
    
    quantity = Column(Numeric(18, 2), nullable=False)
    unit_price = Column(Numeric(18, 2), nullable=False) 
    subtotal = Column(Numeric(18, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")








