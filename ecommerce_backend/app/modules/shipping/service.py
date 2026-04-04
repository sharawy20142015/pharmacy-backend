from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from decimal import Decimal
import math
from .models import City, Governorate

class ShippingService:
    # قواعد الشحن الخاصة بالصيدلية
    FREE_SHIPPING_THRESHOLD = Decimal('1000.00') # شحن مجاني لو الطلب عدى 1000 جنيه
    BASE_ALLOWED_WEIGHT = Decimal('2.0')         # الوزن الأساسي المسموح (2 كجم)
    EXTRA_WEIGHT_FEE = Decimal('15.00')          # سعر كل كيلو زيادة

    @classmethod
    async def calculate_shipping(
        cls, 
        db: AsyncSession, 
        city_id: int, 
        cart_items: list, 
        cart_subtotal: float
    ) -> float:
        
        cart_subtotal_dec = Decimal(str(cart_subtotal))

        # 1. شحن مجاني للمبالغ الكبيرة
        if cart_subtotal_dec >= cls.FREE_SHIPPING_THRESHOLD:
            return 0.0

        # 2. جلب بيانات المدينة والمحافظة
        query = select(City).join(Governorate).where(City.id == city_id)
        result = await db.execute(query)
        city = result.scalars().first()

        if not city:
            raise ValueError("المدينة غير مسجلة في نطاق التوصيل")

        # 3. تحديد التسعيرة (لو المدينة ليها سعر خاص خده، لو لأ خد سعر المحافظة)
        if city.custom_shipping_fee is not None:
            base_fee = Decimal(str(city.custom_shipping_fee))
        else:
            base_fee = Decimal(str(city.governorate.base_shipping_fee))

        # 4. حساب الوزن (لو المنتجات فيها وزن)
        total_weight = Decimal('0.0')
        for item in cart_items:
            item_weight = Decimal(str(item.get('weight', 0.0)))
            qty = Decimal(str(item.get('quantity', 1)))
            total_weight += (item_weight * qty)

        # 5. إضافة تسعيرة الوزن الزائد
        extra_weight_fee = Decimal('0.0')
        if total_weight > cls.BASE_ALLOWED_WEIGHT:
            extra_kg = total_weight - cls.BASE_ALLOWED_WEIGHT
            extra_kg_rounded = Decimal(math.ceil(extra_kg)) 
            extra_weight_fee = extra_kg_rounded * cls.EXTRA_WEIGHT_FEE

        total_shipping_fee = base_fee + extra_weight_fee
        return float(total_shipping_fee)