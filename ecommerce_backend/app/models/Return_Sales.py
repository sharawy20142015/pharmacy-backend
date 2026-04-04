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
    
    # 👇 التعديل الجوهري هنا: تغيير النوع لـ String والربط بالعمود المخصص
    short_item_no = Column(String(20), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    # 👇 تحديد الـ primaryjoin لأننا لا نربط بالـ ID (Primary Key)
    item_details = relationship(
        'ShortItemNo',
        primaryjoin="ReturnSales.short_item_no == ShortItemNo.short_item_no"
    )

    quantity = Column(Numeric(18, 2), default=0.00)
    um = Column(String(10))
    unit_price = Column(Numeric(18, 2), default=0.00)
    extended_price = Column(Numeric(18, 2), default=0.00)
    
    # بيانات العميل
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
        # تحديث الـ repr ليعرض الكود النصي بدل الـ id
        return f"<ReturnSales(id={self.id}, item_no={self.short_item_no}, qty={self.quantity})>"