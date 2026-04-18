from sqlalchemy import Column, String, ForeignKey, Integer, DateTime, Text, Numeric
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base 

class ReturnPurchase(Base):
    __tablename__ = 'return_purchase'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, default=datetime.utcnow)
    
    # ربط بأمر الشراء الأصلي (عشان لو هترجع من فاتورة معينة)
    purchase_id = Column(Integer, ForeignKey('Purchase.purchase_id'), nullable=True)
    
    # ✅ التعديل هنا: الربط بالمنتج الفعلي (إجباري) بدل الصنف العام
    product_id = Column(Integer, ForeignKey('Product.id'), nullable=False)
    
    # علاقة لجلب تفاصيل المنتج المرتجع بسهولة (زي السعر والاسم)
    product_details = relationship('Product')
    
    supplier_code = Column(String(20))
    supplier_name = Column(String(200))
    
    um = Column(String(3))
    quantity = Column(Numeric(18, 2), default=0.00) # الكمية Numeric للحفاظ على الدقة
    unit_cost = Column(Numeric(18, 2), default=0.00)
    extended_cost = Column(Numeric(18, 2), default=0.00)
    
    reason_for_return = Column(Text) # سبب المرتجع للمورد
    status = Column(String(20), default="Pending") # حالة المرتجع (تم الشحن، تم الاسترداد)

    def __repr__(self):
        # ✅ تحديث دالة الطباعة عشان تعرض الـ product_id الجديد
        return f"<ReturnPurchase(id={self.id}, product_id={self.product_id}, supplier={self.supplier_name}, qty={self.quantity})>"