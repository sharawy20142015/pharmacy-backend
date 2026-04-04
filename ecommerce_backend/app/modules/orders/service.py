# E:\Sharawy\PharmacyApp\ecommerce_backend\app\modules\orders\service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from datetime import datetime
from decimal import Decimal

from app.modules.orders.models import Order, OrderStatus, OrderItem
from app.models.product import Product
from app.models.user import Customer, PointsTransaction, PointTransactionType 

class OrderService:
    @staticmethod
    async def create_order(
        db: AsyncSession, 
        customer_id: int | None, 
        cart_items: list, 
        shipping_data: dict,
        shipping_fees: float,
        points_discount: float,
        used_points: int,
        coupon_discount: float = 0.0
    ):
        total_raw = Decimal('0.0')
        order_items_to_add = []
        
        for item in cart_items:
            # البحث عن المنتج باستخدام الـ ID (لأنه أضمن وأسرع)
            query = select(Product).where(Product.id == int(item['product_id']))
            res = await db.execute(query)
            product = res.scalars().first()
            
            if not product:
                raise HTTPException(status_code=404, detail=f"المنتج رقم {item['product_id']} غير موجود")
            
            qty_requested = Decimal(str(item['quantity']))
            
            # 🟢 [التحقق من المخزون]
            if product.stock_quantity < qty_requested:
                raise HTTPException(
                    status_code=400, 
                    detail=f"الكمية المطلوبة غير متوفرة. المتاح من الصنف هو {product.stock_quantity} فقط"
                )

            unit_price = Decimal(str(product.final_price))
            subtotal = unit_price * qty_requested
            total_raw += subtotal
            
            order_items_to_add.append(OrderItem(
                product_id=product.id,
                quantity=qty_requested,
                unit_price=unit_price,
                subtotal=subtotal
            ))

            # 🟢 [خصم الكمية من المخزن فوراً عند الطلب]
            product.stock_quantity -= qty_requested
        
        s_fees = Decimal(str(shipping_fees))
        p_disc = Decimal(str(points_discount))
        c_disc = Decimal(str(coupon_discount))
        
        total_final = (total_raw + s_fees) - (p_disc + c_disc)
        
        new_order = Order(
            customer_id=customer_id,
            order_number=f"ORD-{int(datetime.utcnow().timestamp())}",
            total_raw_amount=total_raw,
            shipping_fees=s_fees,
            points_discount=p_disc,
            used_points=used_points,
            coupon_discount=c_disc,
            total_final_amount=max(Decimal('0.0'), total_final),
            status=OrderStatus.PENDING,
            date=datetime.utcnow(),
            **shipping_data
        )
        
        new_order.items = order_items_to_add
        db.add(new_order)

        # سحب النقاط من رصيد العميل
        if customer_id and used_points > 0:
            customer = await db.get(Customer, customer_id)
            if customer:
                if customer.total_points < used_points:
                    raise HTTPException(status_code=400, detail="رصيد النقاط غير كافٍ")
                
                customer.total_points -= used_points
                pt_transaction = PointsTransaction(
                    customer_id=customer_id,
                    points=-used_points,
                    transaction_type=PointTransactionType.REDEEMED,
                    status="completed",
                    is_confirmed=True,
                    description=f"خصم نقاط لاستخدامها في الطلب {new_order.order_number}"
                )
                db.add(pt_transaction)
        
        try:
            await db.commit()
            await db.refresh(new_order)
            return new_order
        except Exception as e:
            await db.rollback()
            print(f"❌ Database Error: {str(e)}")
            raise HTTPException(status_code=500, detail="حدث خطأ تقني أثناء حفظ الطلب")

    @staticmethod
    async def update_status(db: AsyncSession, order_id: int, new_status: OrderStatus):
        # تحميل الطلب مع العناصر والمنتجات لضمان القدرة على تعديل المخزن
        result = await db.execute(
            select(Order)
            .options(selectinload(Order.items).selectinload(OrderItem.product))
            .where(Order.id == order_id)
        )
        order = result.scalars().first()
        
        if not order:
            raise HTTPException(status_code=404, detail="الطلب غير موجود")

        # منع تحديث حالة طلب منتهي أو ملغي
        if order.status in [OrderStatus.DELIVERED, OrderStatus.CANCELLED]:
            raise HTTPException(status_code=400, detail="لا يمكن تغيير حالة طلب منتهي أو ملغي")

        now = datetime.utcnow()
        if new_status == OrderStatus.PROCESSING:
            order.confirmed_at = now
        elif new_status == OrderStatus.SHIPPED:
            order.shipped_at = now
            
        elif new_status == OrderStatus.DELIVERED:
            order.delivered_at = now
            order.is_paid = True 
            # إضافة النقاط المكتسبة (1 نقطة لكل 10 جنيه)
            earned_points = int(order.total_final_amount / 10) 
            if order.customer_id and earned_points > 0:
                customer = await db.get(Customer, order.customer_id)
                if customer:
                    customer.total_points += earned_points
                    pt_transaction = PointsTransaction(
                        customer_id=order.customer_id,
                        points=earned_points,
                        transaction_type=PointTransactionType.EARNED,
                        order_id=order.id,
                        status="completed",
                        is_confirmed=True,
                        description=f"نقاط مكتسبة من الطلب {order.order_number}"
                    )
                    db.add(pt_transaction)

        # 🟢 [إرجاع المخزن والنقاط في حالة الإلغاء]
        elif new_status == OrderStatus.CANCELLED:
            # 1. إرجاع النقاط للعميل
            if order.customer_id and order.used_points > 0:
                customer = await db.get(Customer, order.customer_id)
                if customer:
                    customer.total_points += order.used_points
                    pt_transaction = PointsTransaction(
                        customer_id=order.customer_id,
                        points=order.used_points,
                        transaction_type=PointTransactionType.REFUNDED,
                        order_id=order.id,
                        status="completed",
                        is_confirmed=True,
                        description=f"استرجاع نقاط بسبب إلغاء الطلب {order.order_number}"
                    )
                    db.add(pt_transaction)
            
            # 2. إرجاع الكميات المحجوزة للمخزن
            for item in order.items:
                if item.product:
                    item.product.stock_quantity += item.quantity

        order.status = new_status
        
        try:
            await db.commit()
            await db.refresh(order)
            return order
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"فشل تحديث الحالة: {str(e)}")