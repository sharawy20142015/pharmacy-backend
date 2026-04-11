# E:\Sharawy\PharmacyApp\ecommerce_backend\app\admin_portal.py

import random
import string
from pathlib import Path
from sqladmin import Admin, ModelView, BaseView, expose
from starlette.responses import RedirectResponse, StreamingResponse
from sqlalchemy import select
from datetime import datetime

from wtforms import Form, StringField
from wtforms.validators import DataRequired
# استيراد المحرك وجلسة قاعدة البيانات
from app.db.session import async_engine, AsyncSessionLocal

# استيراد موديول الـ Bulk الجديد
from app.modules.bulk_manager.services import BulkService
from app.modules.bulk_manager.template_factory import create_bulk_template

# تحديد مسار مجلد القوالب
BASE_DIR = Path(__file__).resolve().parent
templates_dir = BASE_DIR / "templates"

# --- دالة توليد SKU تلقائي ---
def simple_generate_sku():
    digits = ''.join(random.choices(string.digits, k=6))
    return f"SKU{digits}"

# ==========================================
# دالة إعداد لوحة التحكم (Setup)
# ==========================================

def setup_admin(app, authentication_backend):
    # استيراد الموديلات
    from app.models.user import User, Customer, PointsTransaction
    from app.models import (
        ShortItemNo, Purchase, Sales, Trip, Category, 
        Warehouse, Supplier, ReturnSales, 
        Classification, Product, ProductImage, Banner, 
        Tag, Coupon
    )
    from app.modules.orders.models import Order, OrderItem, OrderStatus

    admin = Admin(
        app=app, 
        engine=async_engine, 
        authentication_backend=authentication_backend,
        templates_dir=str(templates_dir), 
        title="Sharawy Pharmacy Admin",
        base_url="/admin",
        logo_url="https://cdn-icons-png.flaticon.com/512/883/883356.png"
    )

    # ==========================================
    # 1. إدارة المستخدمين والولاء
    # ==========================================
    class UserAdmin(ModelView, model=User):
        name_plural = "Users & Permissions"
        category = "User Management"
        icon = "fa-solid fa-user-shield"
        column_list = [User.id, User.name, User.email, User.role, User.is_active]
        column_searchable_list = [User.name, User.email]

    class CustomerAdmin(ModelView, model=Customer):
        name_plural = "Loyalty Profiles"
        category = "User Management"
        icon = "fa-solid fa-users"
        column_list = [Customer.id, Customer.customer_code, Customer.total_points, Customer.is_chronic]
        column_searchable_list = [Customer.customer_code, Customer.phone]

    # ==========================================
    # 2. إدارة المبيعات والطلبات
    # ==========================================
    class OrderAdmin(ModelView, model=Order):
        name_plural = "1. Customer Orders"
        category = "Order Management"
        icon = "fa-solid fa-cart-shopping"
        column_list = [Order.order_number, Order.shipping_first_name, Order.total_final_amount, Order.status, Order.date]
        column_sortable_list = [Order.date, Order.total_final_amount]
        column_searchable_list = [Order.order_number, Order.shipping_phone]
        
        column_formatters = {
            Order.status: lambda m, a: f"🕒 {m.status.value}" if m.status == OrderStatus.PENDING 
            else f"🚚 {m.status.value}" if m.status == OrderStatus.SHIPPED
            else f"✅ {m.status.value}"
        }

    class OrderItemAdmin(ModelView, model=OrderItem):
        name_plural = "2. Order Items"
        category = "Order Management"
        icon = "fa-solid fa-list-ul"
        column_list = [OrderItem.order, OrderItem.product, OrderItem.quantity, OrderItem.unit_price, OrderItem.subtotal]

    class CouponAdmin(ModelView, model=Coupon):
        name_plural = "3. Discount Coupons"
        category = "Order Management"
        icon = "fa-solid fa-ticket"
        column_list = [Coupon.code, Coupon.discount_type, Coupon.discount_value, Coupon.is_active]

    # ==========================================
    # 3. إدارة المخازن والأصناف (المكان الجديد للرفع)
    # ==========================================
    class BulkUploadAdmin(BaseView):
        name = "Bulk Import (رفع إكسيل)"
        icon = "fa-solid fa-file-import"
        category = "Inventory"

        @expose("/bulk-upload", methods=["GET"])
        async def bulk_upload_page(self, request):
            return await self.templates.TemplateResponse(request, "bulk_upload.html")

        @expose("/download-template", methods=["GET"])
        async def download_template(self, request):
            file_stream = create_bulk_template()
            return StreamingResponse(
                file_stream,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                headers={"Content-Disposition": "attachment; filename=sharawy_template.xlsx"}
            )

        @expose("/process-upload", methods=["POST"])
        async def process_upload(self, request):
            form = await request.form()
            file = form.get("excel_file")
            if not file or not file.filename:
                return RedirectResponse(url="/admin/bulk-upload?error=No file")
            
            content = await file.read()
            async with AsyncSessionLocal() as db:
                result = await BulkService.process_excel(content, db)
                return await self.templates.TemplateResponse(request, "bulk_upload.html", {"result": result})

    class ShortItemAdmin(ModelView, model=ShortItemNo):
        name_plural = "Catalog (الأصناف)"
        category = "Inventory"
        icon = "fa-solid fa-box-archive"
        column_list = [ShortItemNo.id, ShortItemNo.short_item_no, ShortItemNo.ar_name, "Brand_Name"]
        column_searchable_list = [ShortItemNo.short_item_no, ShortItemNo.ar_name]
        form_columns = ['short_item_no', 'ar_name', 'en_name', 'header', 'sub_header', 'Brand_Name', 'categories', 'description']
        inline_models = [ProductImage, Product] # إضافة صور وأسعار الصنف في نفس الشاشة
        form_args = {"short_item_no": {"default": simple_generate_sku}}

    class CategoryAdmin(ModelView, model=Category):
        name_plural = "Categories (الأقسام)"
        category = "Inventory"
        icon = "fa-solid fa-layer-group"
        column_list = [Category.id, Category.name, "slug", Category.level]
        form_columns = ['name', 'slug', 'level', 'img_url', 'sub_categories', 'parent']

    # ==========================================
    # 4. إدارة الأسعار والتاجات
    # ==========================================

    class ProductBaseForm(Form):
        # هنا بنبني الحقل بإيدينا غصب عن SQLAdmin
        short_item_no = StringField("Short Item No", validators=[DataRequired()])
    class ProductAdmin(ModelView, model=Product):
        name_plural = "Product"
        category = "Sales & Pricing"
        icon = "fa-solid fa-tags"
        
        # ✅ السطر السحري اللي بيحل المشكلة: بنخليه يعتمد على الفورم اللي عملناه
        form_base_class = ProductBaseForm
        
        # الترتيب بتاعك زي ما هو
        form_columns = [
            "short_item_no", 
            "tags",
            "slug",
            "stock_quantity",
            "price",
            "discount_value",
            "discount_percentage",
            "is_active",
            "is_featured",
            "is_new_arrival",
            "classification"
        ]
        
        column_list = [Product.id, "short_item_no", "price", "discount_percentage", "final_price", "stock_quantity"]
        column_searchable_list = ["short_item_no"]
        
        async def on_model_change(self, data, model, is_created, request):
            model.calculate_final_price()













        
    class TagAdmin(ModelView, model=Tag):
        name_plural = "Product Tags"
        category = "Sales & Pricing"
        icon = "fa-solid fa-tag"
        column_list=["name",'slug']
        form_columns=["name",'slug']
    # ==========================================
    # 5. اللوجستيات والتسويق
    # ==========================================
    class TripAdmin(ModelView, model=Trip):
        name_plural = "Shipping Trips"
        category = "Logistics"
        icon = "fa-solid fa-truck"
        column_list = [Trip.id, Trip.transaction_type, Trip.status, Trip.shipping_fees]

    class SupplierAdmin(ModelView, model=Supplier):
        name_plural = "Suppliers"
        category = "Logistics"
        icon = "fa-solid fa-handshake"

    class BannerAdmin(ModelView, model=Banner):
        name_plural = "Banners"
        category = "Marketing"
        icon = "fa-solid fa-image"

    # --- تسجيل الصفحات بالترتيب ---
    admin.add_view(UserAdmin)
    admin.add_view(CustomerAdmin)
    admin.add_view(OrderAdmin)
    admin.add_view(OrderItemAdmin)
    admin.add_view(CouponAdmin)
    admin.add_view(BulkUploadAdmin)
    admin.add_view(ShortItemAdmin)
    admin.add_view(CategoryAdmin)
    admin.add_view(ProductAdmin)
    admin.add_view(TagAdmin)
    admin.add_view(TripAdmin)
    admin.add_view(SupplierAdmin)
    admin.add_view(BannerAdmin)

    return admin