from sqlalchemy import Column, String, Integer, Text, ForeignKey, Table
from sqlalchemy.orm import relationship, backref
from app.db.base import Base 

# ✅ التعديل هنا: الجدول الوسيط لازم يطابق نوع الـ Primary Key الجديد
product_category_association = Table(
    'product_category_link',
    Base.metadata,
    # تم تغيير short_item_id إلى short_item_no وتغيير النوع لـ String(40)
    Column('short_item_no', String(40), ForeignKey('ShortItemNo.short_item_no'), primary_key=True),
    Column('category_id', Integer, ForeignKey('Category.id'), primary_key=True)
)

class Category(Base):
    __tablename__ = "Category"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True)
    parent_id = Column(Integer, ForeignKey('Category.id'))
    level = Column(Integer, default=0, index=True)
    img_url = Column(Text, nullable=True)

    # العلاقة مع الأصناف (Many-to-Many)
    items = relationship(
        "ShortItemNo",
        secondary=product_category_association,
        back_populates="categories"
    )

    # علاقة الأقسام الفرعية (Self-referential)
    sub_categories = relationship(
        "Category",
        backref=backref('parent', remote_side=[id]),
        cascade="all, delete"
    )

    def __repr__(self):
        return f"<Category(name={self.name}, level={self.level})>"

    def __str__(self):
        return self.name