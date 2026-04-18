from sqlalchemy import Column, String, Integer, Text, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from app.db.base import Base 

# ✅ الجدول الوسيط (Many-to-Many): لربط الأصناف بالأقسام
# تم ضبطه ليدعم short_item_no كـ String(40) ليتوافق مع الجدول الرئيسي
product_category_association = Table(
    'product_category_link',
    Base.metadata,
    Column('short_item_no', String(40), ForeignKey('ShortItemNo.short_item_no'), primary_key=True),
    Column('category_id', Integer, ForeignKey('Category.id'), primary_key=True)
)

class Category(Base):
    __tablename__ = "Category"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 🚀 إضافة index=True لسرعة جلب المنتجات حسب اسم القسم
    name = Column(String(200), nullable=False, index=True)
    
    # الـ Slug مهم جداً للروابط (URL) وعليه Index فعلاً لسرعة البحث
    slug = Column(String(200), unique=True, index=True)
    
    # الربط الذاتي (Self-referential) للأقسام الرئيسية والفرعية
    parent_id = Column(Integer, ForeignKey('Category.id'), index=True)
    
    # المستوى (0 رئيسي، 1 فرعي، إلخ) - عليه Index للفلترة السريعة في الهوم بيج
    level = Column(Integer, default=0, index=True)
    
    img_url = Column(Text, nullable=True)

    # --- العلاقات (Relationships) ---

    # العلاقة مع الأصناف (Many-to-Many)
    items = relationship(
        "ShortItemNo",
        secondary=product_category_association,
        back_populates="categories"
    )

    # علاقة الأقسام الفرعية (تلقائياً بتجيب الأبناء)
    sub_categories = relationship(
        "Category",
        backref=backref('parent', remote_side=[id]),
        cascade="all, delete"
    )

    def __repr__(self):
        return f"<Category(name={self.name}, level={self.level})>"

    def __str__(self):
        # ده اللي هيظهر في لوحة التحكم (SQLAdmin)
        prefix = "📁 " if self.level == 0 else "  ↳ 📄 "
        return f"{prefix}{self.name}"