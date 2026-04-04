from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
from fastapi import HTTPException, status
from datetime import datetime

# استيراد الموديلات من مساراتها الصحيحة
from app.modules.orders.models import Order, OrderItem, OrderStatus
from app.models.user import Customer, PointsTransaction
from app.models.product import Product
from app.models.Short_Item_No import ShortItemNo

class OrderService:

    @classmethod
    async def create_order(
        cls, 
        db: AsyncSession, 
        customer_id: int, 
        cart_items: list, 
        shipping_data: dict, 
        shipping_fees: float = 0, 
        coupon_code: str = None,
        points_to_redeem: int = 0  # إضافة خيار خصم النقاط للمستخدم
    ):
        """
        إنشاء طلب جديد:
        1. التحقق من المنتجات وحساب السعر.
        2. خصم النقاط (Redeem) إن وجدت.
        3. حساب النقاط المكتسبة (Earned) كـ Pending.
        """
        try:
            total_items_price = 0
            order_items = []
            earned_points = 0

            # 1. معالجة عناصر السلة
            for item in cart_items:
                # البحث عن المنتج (Product) وتفاصيله (ShortItemNo)
                product_res = await db.execute(
                    select(Product).filter(Product.id == item['product_id'])
                )
                product = product_res.scalars().first()
                
                if not product:
                    raise HTTPException(status_code=404, detail=f"المنتج ID {item['product_id']} غير موجود")

                # السعر بعد الخصم إن وجد
                price = float(product.final_price or product.price)
                qty = float(item['quantity'])
                subtotal = price * qty
                total_items_price += subtotal
                
                # حساب نقاط تقديرية (مثلاً 1% من قيمة المنتج)
                earned_points += int(subtotal * 0.01) 

                order_items.append(OrderItem(
                    product_id=product.id,
                    quantity=qty,
                    unit_price=price,
                    subtotal=subtotal
                ))

            # 2. منطق خصم النقاط (Loyalty Redemption)
            points_discount_value = 0
            if points_to_redeem > 0 and customer_id:
                cust_res = await db.execute(select(Customer).filter(Customer.id == customer_id))
                customer = cust_res.scalars().first()
                
                if customer and customer.total_points >= points_to_redeem:
                    # افتراضياً: كل 10 نقاط تساوي 1 جنيه (يمكنك تغيير النسبة)
                    points_discount_value = points_to_redeem / 10 
                    # خصم النقاط فوراً من رصيد العميل
                    customer.total_points -= points_to_redeem
                else:
                    raise HTTPException(status_code=400, detail="رصيد النقاط غير كافٍ")

            # 3. حساب الإجمالي النهائي
            total_final = (total_items_price + shipping_fees) - points_discount_value
            if total_final < 0: total_final = 0

            # 4. إنشاء كائن الطلب (Order)
            new_order = Order(
                customer_id=customer_id,
                order_number=f"ORD-{int(datetime.now().timestamp())}",
                total_raw_amount=total_items_price,
                shipping_fees=shipping_fees,
                points_discount=points_discount_value,  # القيمة المالية المخصومة
                used_points=points_to_redeem,           # عدد النقاط المستخدمة
                total_final_amount=total_final,
                status=OrderStatus.PENDING,
                # حقول الشحن
                shipping_first_name=shipping_data.get("first_name"),
                shipping_last_name=shipping_data.get("last_name"),
                shipping_governorate=shipping_data.get("governorate"),
                shipping_city=shipping_data.get("city"),
                shipping_details=shipping_data.get("details"),
                shipping_phone=shipping_data.get("phone"),
                payment_method="Cash",
                is_paid=False
            )
            new_order.items = order_items
            
            db.add(new_order)
            await db.flush() # للحصول على id الطلب للربط

            # 5. تسجيل النقاط "المكتسبة" (Earned Points) كـ Pending
            if customer_id and earned_points > 0:
                new_tx = PointsTransaction(
                    customer_id=customer_id,
                    points=earned_points,
                    transaction_type="EARNED",
                    order_id=new_order.id,
                    description=f"نقاط الطلب {new_order.order_number} - قيد الانتظار",
                    status="pending",
                    is_confirmed=False
                )
                db.add(new_tx)

            await db.commit()
            await db.refresh(new_order)
            return new_order

        except Exception as e:
            await db.rollback()
            print(f"❌ Error in OrderService Create: {str(e)}")
            raise e

    @classmethod
    async def update_status(cls, db: AsyncSession, order_id: int, new_status: OrderStatus):
        """
        تحديث حالة الطلب وتأكيد النقاط المكتسبة عند التسليم
        """
        result = await db.execute(select(Order).filter(Order.id == order_id))
        order = result.scalars().first()

        if not order:
            raise HTTPException(status_code=404, detail="الطلب غير موجود")

        if order.status == new_status:
            return order

        order.status = new_status

        # إذا تم التسليم (DELIVERED)، يتم تحويل نقاط الـ Pending إلى رصيد حقيقي
        if new_status == OrderStatus.DELIVERED:
            await cls._confirm_points_logic(db, order)
            order.is_paid = True

        # إذا تم الإلغاء (CANCELLED)، يتم إلغاء النقاط المنتظرة وإعادة النقاط المستخدمة (إن وجدت)
        if new_status == OrderStatus.CANCELLED:
            await cls._cancel_points_logic(db, order)

        await db.commit()
        await db.refresh(order)
        return order

    @classmethod
    async def _confirm_points_logic(cls, db: AsyncSession, order: Order):
        """تأكيد النقاط المكتسبة وإضافتها لرصيد العميل النهائي"""
        tx_res = await db.execute(
            select(PointsTransaction).filter(
                PointsTransaction.order_id == order.id,
                PointsTransaction.status == "pending",
                PointsTransaction.transaction_type == "EARNED"
            )
        )
        transaction = tx_res.scalars().first()

        if transaction:
            transaction.status = "confirmed"
            transaction.is_confirmed = True
            
            # تحديث رصيد العميل
            await db.execute(
                update(Customer)
                .where(Customer.id == order.customer_id)
                .values(total_points=Customer.total_points + transaction.points)
            )

    @classmethod
    async def _cancel_points_logic(cls, db: AsyncSession, order: Order):
        """إلغاء النقاط المنتظرة وإعادة النقاط المستخدمة في الخصم للعميل"""
        # 1. إلغاء النقاط المكتسبة
        await db.execute(
            update(PointsTransaction)
            .where(PointsTransaction.order_id == order.id)
            .values(status="cancelled", is_confirmed=False)
        )
        
        # 2. إعادة النقاط التي استخدمها العميل للخصم (لأن الطلب ألغي)
        if order.used_points > 0:
            await db.execute(
                update(Customer)
                .where(Customer.id == order.customer_id)
                .values(total_points=Customer.total_points + order.used_points)
            )