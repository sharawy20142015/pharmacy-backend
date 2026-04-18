from sqlalchemy import Column, String, Integer, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 

class Supplier(Base):
    __tablename__ = 'Supplier'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    supplier_code = Column(String(20), unique=True, nullable=False)
    supplier_name = Column(String(200), nullable=False)
    contact_person = Column(String(200)) # الشخص المسؤول
    phone_number = Column(String(15))
    email = Column(String(200))
    address = Column(Text)
    tax_number = Column(String(50)) # الرقم الضريبي (مهم للشركات)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # العلاقة مع المشتريات: المورد الواحد له فواتير شراء كثيرة
    purchase_orders = relationship("Purchase", back_populates="supplier_info")
    def __repr__(self):
        return f"<Supplier(name={self.supplier_name}, code={self.supplier_code})>"