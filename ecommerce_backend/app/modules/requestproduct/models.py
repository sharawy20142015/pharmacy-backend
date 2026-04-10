import string
import random
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from app.db.base import Base
from datetime import datetime

def generate_order_number():
    # بيولد رقم عشوائي زي REQ-7X2W9
    chars = string.ascii_uppercase + string.digits
    code = ''.join(random.choice(chars) for _ in range(5))
    return f"REQ-{code}"

class ProductRequest(Base):
    __tablename__ = "product_requests"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, default=generate_order_number)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(Text, nullable=False)
    product_details = Column(Text, nullable=False)
    # الحالات المسموح بها
    status = Column(String(50), default="pending") 
    created_at = Column(DateTime, default=datetime.utcnow)