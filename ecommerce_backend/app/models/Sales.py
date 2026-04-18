from sqlalchemy import Column, String, ForeignKey, Integer, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 

class Sales(Base):
    __tablename__ = 'Sales'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    product_id = Column(Integer, ForeignKey('Product.id'), nullable=False)
    product = relationship('Product', backref='sales_orders')
    
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=True)
    customer_info = relationship("Customer", back_populates="sales_orders")

    quantity = Column(Numeric(18, 2), default=0.00)
    um = Column(String(10))
    unit_price = Column(Numeric(18, 2), default=0.00)
    extended_price = Column(Numeric(18, 2), default=0.00) 
    
    customer_code = Column(String(20))
    customer_name = Column(String(200))
    customer_governates = Column(String(50))
    customer_city = Column(String(50))
    customer_location = Column(Text)
    phone_number = Column(String(20))
    
    shipping_fees = Column(Numeric(18, 2), default=0.00)
    
    trips = relationship("Trip", back_populates="sales_order")

    def __repr__(self):
        return f"<Sales(id={self.id}, product_id={self.product_id}, qty={self.quantity})>"