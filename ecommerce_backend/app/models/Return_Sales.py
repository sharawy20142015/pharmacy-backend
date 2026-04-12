from sqlalchemy import Column, String, ForeignKey, Integer, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 

class ReturnSales(Base):
    __tablename__ = 'return_sales'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    # ربط بجدول المبيعات (اختياري)
    sales_id = Column(Integer, ForeignKey('Sales.id'), nullable=True)
    
    # 🔴 التعديل هنا: تم تغيير الطول لـ 40 ليتطابق مع ShortItemNo الجديد
    # والربط الآن بـ ForeignKey مباشر على الـ Primary Key (short_item_no)
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    # ✅ العلاقة أصبحت مباشرة (Standard Relationship)
    # شلنا الـ primaryjoin اليدوي لأن الربط أصبح بالـ PK الفعلي لجدول ShortItemNo
    item_details = relationship(
        'ShortItemNo',
        back_populates='return_sales'
    )

    quantity = Column(Numeric(18, 2), default=0.00)
    um = Column(String(10)) # وحدة القياس (Unit of Measure)
    unit_price = Column(Numeric(18, 2), default=0.00)
    extended_price = Column(Numeric(18, 2), default=0.00)
    
    # بيانات العميل (Snapshot لحالة العميل وقت المرتجع)
    customer_code = Column(String(20))
    customer_name = Column(String(100))
    customer_governates = Column(String(50))
    customer_city = Column(String(50))
    customer_location = Column(Text)
    phone_number = Column(String(20))
    
    # مصاريف الشحن والسبب
    shipping_fees = Column(Numeric(18, 2), default=0.00)
    reason_for_return = Column(Text) 

    def __repr__(self):
        return f"<ReturnSales(id={self.id}, item_no={self.short_item_no}, qty={self.quantity})>"

    def __str__(self):
        return f"Return: {self.short_item_no} - Qty: {self.quantity}"