# app/db/base.py
from sqlalchemy.orm import declarative_base

# 1. تعريف الـ Base
Base = declarative_base()

# 2. استيراد كل الجداول هنا (Import ALL models)
# ده اللي بيخلي Alembic يشوفهم وما يمسحهمش
from app.models.Short_Item_No import ShortItemNo
from app.models.Category import Category
from app.models.product import Product
from app.models.ProductImage import ProductImage # الجديد
from app.models.Tag import Tag # الجديد
from app.models.Sales import Sales
from app.models.Purchase import Purchase
from app.models.Warehouse import Warehouse
from app.models.logistics import Trip
from app.models.supplier import Supplier
from app.models.Classification import Classification
from app.models.Return_Sales import ReturnSales
from app.models.Banner import Banner
from app.modules.orders.models import *
from app.modules.shipping.models import *