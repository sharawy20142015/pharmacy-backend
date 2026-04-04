# app/models/__init__.py
from app.db.base import Base

# --- الأصناف والمخزون ---
from .Short_Item_No import ShortItemNo
from .Category import Category
from .product import Product
from .ProductImage import ProductImage
from .Tag import Tag
from .Warehouse import Warehouse, TransactionType 

# --- نظام الطلبات الجديد (E-commerce Core) ---
# تأكد من إنشاء ملفات لهذه الكلاسات كما صممناها في الخطوة السابقة
from .Coupons import Coupon

# --- المبيعات والمشتريات القديمة (لأغراض الأرشفة أو النظام الداخلي) ---
from .Sales import Sales
from .Purchase import Purchase
from .Return_Sales import ReturnSales

# --- اللوجستيات والعملاء ---
from .logistics import Trip
from .supplier import Supplier

# --- التسويق والعرض ---
from .Classification import Classification
from .Banner import Banner

from .user import *