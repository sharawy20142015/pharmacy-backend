# E:\Sharawy\PharmacyApp\ecommerce_backend\app\modules\orders\router.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
from datetime import datetime

from app.db.session import get_db
# استيراد السيرفيس من نفس المجلد لضمان استخدام النسخة المعدلة
from .service import OrderService 
from app.modules.orders.models import OrderStatus, Order, OrderItem 
from app.models.product import Product 
from .schemas import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["Orders Management"])

# ==========================================
# 1. إنشاء طلب جديد (POST /orders/create)
# ==========================================
@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_new_order(payload: OrderCreate, db: AsyncSession = Depends(get_db)):
    try:
        # تحويل عناصر السلة القادمة من الموبايل إلى قائمة قواميس للمعالجة
        cart_items_dict = [
            {"product_id": item.product_id, "quantity": item.quantity} 
            for item in payload.cart_items
        ]
        
        # 🟢 تجميع بيانات الشحن والدفع لإرسالها للسيرفيس
        shipping_data = {
            "shipping_first_name": payload.shipping_first_name,
            "shipping_last_name": payload.shipping_last_name or "",
            "shipping_governorate": payload.shipping_governorate,
            "shipping_city": payload.shipping_city,
            "shipping_details": payload.shipping_details,
            "shipping_phone": payload.shipping_phone,
            "payment_method": payload.payment_method  # 👈 إضافة وسيلة الدفع هنا
        }

        # حساب خصم النقاط (تحويل النقاط لقيمة مالية)
        calculated_points_discount = float((payload.points_to_redeem or 0) * 0.01)

        # 🟢 استدعاء السيرفيس وتمرير المعاملات المطلوبة
        new_order = await OrderService.create_order(
            db=db,
            customer_id=payload.customer_id,
            cart_items=cart_items_dict,
            shipping_data=shipping_data,
            shipping_fees=payload.shipping_fees,
            points_discount=calculated_points_discount,  # الخصم المالي
            used_points=payload.points_to_redeem or 0,    # عدد النقاط المخصومة من الرصيد
            coupon_discount=0.0                           # يمكن تطويرها لاحقاً
        )

        return {
            "status": "success", 
            "order_number": new_order.order_number,
            "order_id": new_order.id
        }
    except HTTPException as http_err:
        # إعادة إرسال أخطاء الـ Validation أو المخزن كما هي
        raise http_err
    except Exception as e:
        print(f"❌ Error during order creation: {str(e)}")
        raise HTTPException(
            status_code=400, 
            detail=f"فشل في إنشاء الطلب: {str(e)}"
        )


# ==========================================
# 2. لوحة تحكم الأدمن (Dashboard - جلب كل الطلبات)
# ==========================================
@router.get("/admin/all")
async def get_all_orders_for_admin(db: AsyncSession = Depends(get_db)):
    try:
        query = (
            select(Order)
            .options(
                selectinload(Order.items)
                .selectinload(OrderItem.product)
                .selectinload(Product.item_details)
            )
            .order_by(Order.date.desc())
        )
        
        result = await db.execute(query)
        orders = result.unique().scalars().all()

        formatted_orders = []
        for order in orders:
            full_name = f"{order.shipping_first_name or ''} {order.shipping_last_name or ''}".strip()
            full_address = f"{order.shipping_governorate or ''}, {order.shipping_city or ''}, {order.shipping_details or ''}".strip(", ")
            
            order_products = []
            for item in order.items:
                p_name = "منتج غير معروف"
                if item.product and item.product.item_details:
                    p_name = item.product.item_details.ar_name or item.product.item_details.en_name

                order_products.append({
                    "id": item.id,
                    "product_name": p_name,
                    "quantity": float(item.quantity),
                    "unit_price": float(item.unit_price),
                    "subtotal": float(item.subtotal)
                })
            
            formatted_orders.append({
                "id": str(order.id), 
                "order_number": order.order_number,
                "total_final_amount": float(order.total_final_amount),
                "status": order.status.value if hasattr(order.status, 'value') else order.status,
                "customer_name": full_name or "عميل زائر",
                "customer_phone": order.shipping_phone,
                "shipping_address": full_address,
                "date": order.date.isoformat() if order.date else None,
                "payment_method": order.payment_method or "Cash", # 👈 عرض وسيلة الدفع للأدمن
                "items_count": len(order.items),
                "shipping_fees": float(order.shipping_fees or 0),
                "coupon_discount": float(order.coupon_discount or 0),
                "points_discount": float(order.points_discount or 0),
                "items": order_products
            })

        return formatted_orders

    except Exception as e:
        print(f"❌ Error fetching admin orders: {str(e)}")
        raise HTTPException(status_code=500, detail="حدث خطأ في جلب البيانات")


# ==========================================
# 3. تحديث حالة الطلب (Cycle Management)
# ==========================================
@router.patch("/{order_id}/status")
async def update_order_status(order_id: int, status: OrderStatus, db: AsyncSession = Depends(get_db)):
    try:
        order = await OrderService.update_status(db, order_id, status)
        return {"message": f"Order {order.order_number} status updated to {status}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==========================================
# 4. جلب تاريخ طلبات العميل
# ==========================================
@router.get("/my-orders/{customer_id}", response_model=List[OrderRead])
async def get_customer_orders(customer_id: int, db: AsyncSession = Depends(get_db)):
    try:
        query = (
            select(Order)
            .where(Order.customer_id == customer_id)
            .options(selectinload(Order.items))
            .order_by(Order.date.desc())
        )
        result = await db.execute(query)
        return result.unique().scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء جلب تاريخ طلباتك")