# E:\Sharawy\PharmacyApp\ecommerce_backend\app\modules\orders\service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from datetime import datetime
from decimal import Decimal

from app.modules.orders.models import Order, OrderStatus, OrderItem
# 🟢 تم التحديث: استيراد موديلات الباقات Bundle و BundleItem للتعامل مع التفكيك الديناميكي
from app.models.product import Product, Bundle, BundleItem
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
            # 🟢 1. فحص هل العنصر القادم من السلة هو باقة مجمعة محمية؟
            is_bundle = item.get("is_bundle", False)
            
            if is_bundle:
                # 🟢 منطق تفكيك الباقات الذكي لايف لحماية الأرباح والمخزن بالملي
                bundle_id_str = str(item['product_id'])
                bundle_slug = bundle_id_str.replace("bundle_", "") # قنص الـ slug الحقيقي للباقة
                
                # جلب بيانات الباقة ومكوناتها والعلاقات بسرعة من الذاكرة
                bundle_query = (
                    select(Bundle)
                    .where(Bundle.slug == bundle_slug)
                    .options(
                        selectinload(Bundle.bundle_items)
                        .selectinload(BundleItem.product)
                        .selectinload(Product.item_details)
                    )
                )
                bundle_res = await db.execute(bundle_query)
                bundle_obj = bundle_res.scalar_one_or_none()
                
                if not bundle_obj:
                    raise HTTPException(status_code=404, detail=f"الباقة الحصرية ذات الرمز {bundle_slug} غير موجودة")
                
                bundle_qty = Decimal(str(item['quantity']))
                
                # اللوب على المنتجات المحددة والمنتقاة فقط من قبل العميل (مثل 2 من أصل 6)
                for selected_sku in item.get("bundle_items", []):
                    # مطابقة الـ SKU المبعوث مع كائنات الـ ORM المكيشة داخل الباقة
                    matching_bi = next((bi for bi in bundle_obj.bundle_items if bi.short_item_no == selected_sku), None)
                    
                    if not matching_bi or not matching_bi.product:
                        raise HTTPException(
                            status_code=404, 
                            detail=f"المنتج ذو الكود {selected_sku} غير متوفر أو تم تعطيله داخل هذه الباقة"
                        )
                        
                    product = matching_bi.product
                    item_qty_per_bundle = Decimal(str(matching_bi.quantity or 1))
                    total_qty_requested = bundle_qty * item_qty_per_bundle
                    
                    # [التحقق من المخزون للمكون الفرعي بداخل الباقة]
                    if product.stock_quantity < total_qty_requested:
                        p_name = product.item_details.ar_name if product.item_details else selected_sku
                        raise HTTPException(
                            status_code=400,
                            detail=f"عفواً، الكمية المطلوبة من الصنف '{p_name}' داخل الباقة غير متوفرة. المتاح بالمخزن هو {product.stock_quantity} فقط"
                        )
                        
                    # قراءة السعر التوفيري الخاص بالصنف جوه الباقة بالملي
                    unit_price = Decimal(str(matching_bi.get_bundle_item_final_price()))
                    subtotal = unit_price * total_qty_requested
                    total_raw += subtotal
                    
                    order_items_to_add.append(OrderItem(
                        product_id=product.id,
                        quantity=total_qty_requested,
                        unit_price=unit_price,
                        subtotal=subtotal
                    ))
                    
                    # [خصم الكمية من المخزن فوراً للمكون الفرعي للباقة]
                    product.stock_quantity -= total_qty_requested
            else:
                # 🟢 2. الصنف العادي المسالم الافتراضي (القديم والمؤمن)
                query = select(Product).where(Product.id == int(item['product_id']))
                res = await db.execute(query)
                product = res.scalars().first()
                
                if not product:
                    raise HTTPException(status_code=404, detail=f"المنتج رقم {item['product_id']} غير موجود")
                
                qty_requested = Decimal(str(item['quantity']))
                
                # [التحقق من المخزون للمنتج العادي]
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

                # [خصم الكمية من المخزن فوراً عند الطلب للمنتج العادي]
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

        # [إرجاع المخزن والنقاط في حالة الإلغاء]
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