from sqlalchemy import Column, String, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from app.db.base import Base 

class Classification(Base):
    __tablename__ = 'Classification'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 🔴 التعديل هنا: تم تغيير الطول لـ 40 ليتطابق مع الجدول الرئيسي ShortItemNo
    short_item_no = Column(String(40), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    # ✅ إضافة back_populates عشان الـ Admin Portal يقدر يشوف التصنيفات من جوه شاشة الصنف
    # وربطها بكلمة 'classifications' اللي ضفناها في موديل ShortItemNo
    item_details = relationship("ShortItemNo", back_populates="classifications")

    classification_type = Column(String(40), nullable=False) # مثل: 'Offer' أو 'New Arrival'
    img_url = Column(Text, nullable=False)

    def __repr__(self):
        return f"<Classification(type={self.classification_type}, sku={self.short_item_no})>"

    def __str__(self):
        return f"{self.classification_type} - {self.short_item_no}"