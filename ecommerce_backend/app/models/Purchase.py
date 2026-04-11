from sqlalchemy import Column, String, ForeignKey, Integer, Numeric, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import string
import random
from app.db.base import Base 

def generate_auto_po():
    now = datetime.now()
    suffix = ''.join(random.choices(string.ascii_uppercase, k=2))
    return f"PO-{now.strftime('%Y%m%d%H%M%S')}-{suffix}"

class Purchase(Base):
    __tablename__ = 'Purchase'
    
    purchase_id = Column(Integer, primary_key=True, autoincrement=True)
    purchase_order_no = Column(String(50), unique=True, nullable=False, default=generate_auto_po) 
    date = Column(DateTime, default=datetime.utcnow)
    
    # 🔴 التعديل هنا: غيرنا النوع لـ String(40) والربط بالـ Primary Key الجديد
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    # العلاقة بجدول الأصناف
    item_details = relationship('ShortItemNo', back_populates='purchases')
    
    supplier_id = Column(Integer, ForeignKey('Supplier.id'), nullable=True)
    supplier_info = relationship("Supplier", back_populates="purchase_orders")

    supplier_code = Column(String(20))
    supplier_name = Column(String(100))
    
    quantity = Column(Numeric(18, 2), default=0.00)
    um = Column(String(10))
    unit_cost = Column(Numeric(18, 2), default=0.00)
    unit_price = Column(Numeric(18, 2), default=0.00)
    extended_cost = Column(Numeric(18, 2), default=0.00)
    extended_price = Column(Numeric(18, 2), default=0.00)
    
    invoice_num = Column(String(30), nullable=True)
    trips = relationship("Trip", back_populates="purchase_order")

    def __repr__(self):
        return f"<Purchase(id={self.purchase_id}, po={self.purchase_order_no}, sku={self.short_item_no})>"