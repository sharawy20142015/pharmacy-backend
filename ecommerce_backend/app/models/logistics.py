from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, Text, Enum, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 

class Trip(Base):
    __tablename__ = "trip"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    # 🔴 التعديل الجوهري: تغيير الربط من id إلى short_item_no
    # وتغيير النوع لـ String(40) ليطابق الجدول الرئيسي
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    purchase_id = Column(Integer, ForeignKey('Purchase.purchase_id'), nullable=True)
    sales_id = Column(Integer, ForeignKey('Sales.id'), nullable=True)
    
    # العلاقات
    item_details = relationship("ShortItemNo", backref="trips") # أضفنا backref لتسهيل الوصول من الجهتين
    purchase_order = relationship("Purchase", back_populates="trips")
    sales_order = relationship("Sales", back_populates="trips")
    
    pickup_governorate = Column(String(50))
    pickup_city = Column(String(50))
    drop_governorate = Column(String(50))
    drop_city = Column(String(50))  
    
    shipping_fees = Column(Numeric(18, 2), default=0.00)
    transaction_type = Column(Enum("Sales", "Purchase", name="trans_type")) 
    status = Column(String(20), default="Pending") # Pending, Shipped, Delivered, Cancelled
    notes = Column(Text)

    def __repr__(self):
        return f"<Trip(id={self.id}, item={self.short_item_no}, status={self.status})>"