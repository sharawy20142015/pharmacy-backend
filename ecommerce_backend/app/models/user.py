import random
import string
import enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

# --- دالة مساعدة لإنشاء كود عميل تلقائي ---
def generate_customer_code():
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"CUST-{suffix}"

# --- أنواع أدوار المستخدمين (Roles) ---
class UserRole(str, enum.Enum):
    ADMIN = "admin"        # مدير النظام (صلاحيات كاملة)
    STAFF = "staff"        # موظف (تجهيز أوردرات وشحن)
    CUSTOMER = "customer"  # عميل عادي

# --- أنواع حركات النقاط ---
class PointTransactionType(enum.Enum):
    EARNED = "EARNED"         # كسب نقاط من شراء
    REDEEMED = "REDEEMED"     # صرف نقاط كخصم
    REFUNDED = "REFUNDED"     # استرجاع نقاط بسبب إلغاء أوردر
    BONUS = "BONUS"           # نقاط هدية

# ==========================================
# 1. جداول المصادقة والهوية (Auth & Identity)
# ==========================================
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # الإيميل nullable=True ليقبل العملاء الزوار أو التسجيل السريع بالهاتف لاحقاً
    email = Column(String(200), unique=True, index=True, nullable=True)
    
    name = Column(String(200), nullable=True) 
    avatar_url = Column(Text, nullable=True)  
    password = Column(String(255), nullable=True) 
    
    # 👇 الحقل الجديد والمهم جداً للسيناريو بتاعنا 👇
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER, nullable=False, index=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # --- العلاقات ---
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    customer = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(email={self.email}, name={self.name}, role={self.role})>"


class SocialAccount(Base):
    __tablename__ = 'social_accounts'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    provider = Column(String(50), nullable=False) # مثل 'google'
    provider_account_id = Column(String(255), nullable=False, index=True) 
    
    # --- العلاقات ---
    user = relationship("User", back_populates="social_accounts")


# ==========================================
# 2. جدول بيانات العميل (Profile & Loyalty Data) 
# ==========================================
class Customer(Base):
    __tablename__ = 'customers' 

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    
    customer_code = Column(String(20), unique=True, nullable=False, default=generate_customer_code, index=True)
    phone = Column(String(20), nullable=True) 
    
    # --- نظام الولاء والأمراض المزمنة ---
    total_points = Column(Integer, default=0) 
    is_chronic = Column(Boolean, default=False, index=True) 
    chronic_vip_id = Column(String(50),  nullable=True) 
    special_discount_percentage = Column(Numeric(5, 2), default=0.00) 
    has_free_shipping = Column(Boolean, default=False) 
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # --- العلاقات ---
    user = relationship("User", back_populates="customer")
    addresses = relationship("Address", back_populates="customer", cascade="all, delete-orphan")
    points_history = relationship("PointsTransaction", back_populates="customer", cascade="all, delete-orphan")
    
    # علاقات العمليات التجارية (تأكد من مطابقة أسماء الكلاسات في ملفاتها)
    orders = relationship("Order", back_populates="customer_info")
    sales_orders = relationship("Sales", back_populates="customer_info")

    def __repr__(self):
        return f"<Customer(code={self.customer_code}, phone={self.phone})>"


# ==========================================
# 3. جدول العناوين (Addresses)
# ==========================================
class Address(Base):
    __tablename__ = 'addresses'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    
    governorate = Column(String(200), nullable=False)
    city = Column(String(200), nullable=False)
    details = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False) 
    is_default = Column(Boolean, default=False) 

    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="addresses")


# ==========================================
# 4. سجل حركات النقاط (Points Ledger)
# ==========================================
class PointsTransaction(Base):
    __tablename__ = 'points_transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    
    points = Column(Integer, nullable=False) 
    transaction_type = Column(Enum(PointTransactionType), nullable=False)
    
    order_id = Column(Integer, nullable=True) # ربط النقاط بالأوردر الذي تسبب فيها
    status = Column(String(20), default="pending") 
    is_confirmed = Column(Boolean, default=False) 
    
    description = Column(String(255), nullable=True) 
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="points_history")