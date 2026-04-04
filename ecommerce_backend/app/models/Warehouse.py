from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, String, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class TransactionType(str, enum.Enum):
    PURCHASE = "purchase"                  
    SALE = "sale"                          
    RETURN_FROM_CUSTOMER = "return_from_customer" 
    RETURN_TO_SUPPLIER = "return_to_supplier"     
    ADJUSTMENT = "adjustment"              

class Warehouse(Base):
    __tablename__ = 'warehouse'

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey('Product.id'), nullable=False, index=True)
    product = relationship('Product', backref='warehouse_records')

    transaction_type = Column(Enum(TransactionType), nullable=False, index=True)
    quantity = Column(Numeric(18, 2), nullable=False)
    balance_after = Column(Numeric(18, 2), nullable=True)

    unit_cost = Column(Numeric(18, 2), default=0.00)
    unit_price = Column(Numeric(18, 2), default=0.00)
    discount_value = Column(Numeric(18, 2), default=0.00)      # خصم مبلغ ثابت (مثلاً 50 جنيه)
    discount_percentage = Column(Numeric(5, 2), default=0.00)  # خصم نسبة (مثلاً 10%)
    
    final_price = Column(Numeric(18, 2), default=0.00, index=True) # السعر بعد الخصم
    document_type = Column(String(50), index=True, nullable=True) 
    document_id = Column(Integer, index=True, nullable=True)      
    
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_by = Column(Integer, nullable=True) 

    def __repr__(self):
        return f"<Warehouse(id={self.id}, type={self.transaction_type}, qty={self.quantity})>"