from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.db.base import Base

class Governorate(Base):
    __tablename__ = 'governorates'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name_ar = Column(String(50), nullable=False, unique=True)
    name_en = Column(String(50), nullable=False, unique=True)
    
    # السعر الأساسي للمحافظة
    base_shipping_fee = Column(Numeric(10, 2), default=50.00)
    is_active = Column(Boolean, default=True)

    cities = relationship("City", back_populates="governorate", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Governorate(name={self.name_ar})>"

class City(Base):
    __tablename__ = 'cities'

    id = Column(Integer, primary_key=True, autoincrement=True)
    governorate_id = Column(Integer, ForeignKey('governorates.id'), nullable=False)
    
    name_ar = Column(String(50), nullable=False)
    name_en = Column(String(50), nullable=False)
    
    # تسعيرة خاصة للمدينة (لو كانت نائية مثلاً)، لو Null هنستخدم سعر المحافظة
    custom_shipping_fee = Column(Numeric(10, 2), nullable=True)
    is_active = Column(Boolean, default=True)

    governorate = relationship("Governorate", back_populates="cities")

    def __repr__(self):
        return f"<City(name={self.name_ar})>"