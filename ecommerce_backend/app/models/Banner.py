from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    image_url = Column(Text, nullable=False)
    title = Column(String(100), nullable=True)
    subtitle = Column(String(150), nullable=True)
    
    # ❌ شيلنا الـ section القديم اللي كان String
    # section = Column(String(50), ... ) 

    # ✅ ضفنا الربط بالـ Category
    # ده اللي هيخلي الـ Dropdown يظهر
    category_id = Column(Integer, ForeignKey('Category.id'), nullable=True)
    category = relationship("Category") 

    # حقول إضافية
    target_screen = Column(String(50), nullable=True, default="Shop") 
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __str__(self):
        # عشان لما يظهر في الأدمن يكتب اسم البانر واسم القسم
        cat_name = self.category.name if self.category else "No Category"
        return f"{self.title} - {cat_name}"