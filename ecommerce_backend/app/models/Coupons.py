from sqlalchemy import Column, Integer, Numeric, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base

class Coupon(Base):
    __tablename__ = 'coupons'

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(20), unique=True, index=True, nullable=False) # (EID2026, SUMMER50)
    
    discount_type = Column(Enum("Percentage", "Fixed", name="coupon_type"))
    discount_value = Column(Numeric(18, 2), nullable=False)
    
    min_order_amount = Column(Numeric(18, 2), default=0.00) # الحد الأدنى للطلب عشان الكوبون يشتغل
    max_discount_limit = Column(Numeric(18, 2), nullable=True) # أقصى مبلغ خصم (لو نسبة)
    
    valid_from = Column(DateTime, default=datetime.utcnow)
    valid_to = Column(DateTime, nullable=False) # تاريخ انتهاء الكوبون
    
    usage_limit = Column(Integer, default=100) # أقصى عدد مرات استخدام للكوبون ككل
    used_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    def is_valid(self, current_amount):
        now = datetime.utcnow()
        if not self.is_active or now < self.valid_from or now > self.valid_to:
            return False
        if current_amount < self.min_order_amount:
            return False
        if self.used_count >= self.usage_limit:
            return False
        return True