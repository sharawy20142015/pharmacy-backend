# app/models/Tag.py

from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

# 1. الجدول الوسيط (Association Table)
# ده اللي بيخزن إن المنتج رقم 5 واخد التاج رقم 1 ورقم 3
product_tags_association = Table(
    'product_tags_link',
    Base.metadata,
    Column('product_id', Integer, ForeignKey('Product.id'), primary_key=True), # تأكد إن اسم جدول المنتجات عندك Product
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

# 2. كلاس التاج نفسه
class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    name = Column(String(50), nullable=False, unique=True)  # الاسم (مثلاً: New Arrival)
    slug = Column(String(50), nullable=False, unique=True)  # للاستخدام في اللينك (new-arrival)
    color = Column(String(20), default="#000000")           # لون الخلفية (اختياري للفرونت إند)

    # العلاقة العكسية عشان تقدر تجيب كل المنتجات اللي تحت تاج معين
    products = relationship(
        "Product",
        secondary=product_tags_association,
        back_populates="tags"
    )

    def __repr__(self):
        return self.name