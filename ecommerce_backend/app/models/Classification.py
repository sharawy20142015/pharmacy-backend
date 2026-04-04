from sqlalchemy import Column, String, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from app.db.base import Base 

class Classification(Base):
    __tablename__ = 'Classification'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # الربط بالصنف
    short_item_no = Column(String(20), ForeignKey('ShortItemNo.short_item_no'), nullable=False)
    
    # تعديل العلاقة: شلنا back_populates عشان الـ Error يختفي
    item_details = relationship("ShortItemNo")

    classification_type = Column(String(40), nullable=False) 
    img_url = Column(Text, nullable=False)

    def __repr__(self):
        return f"<Classification(id={self.id}, type={self.classification_type})>"