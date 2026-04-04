from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from .models import Governorate, City

# قائمة شاملة لأهم المحافظات والمدن (تقدر تزود عليها)
INITIAL_LOCATIONS = [
    {
        "name_ar": "القاهرة", "name_en": "Cairo", "base_fee": 45.00,
        "cities": [
            {"name_ar": "مدينة نصر", "name_en": "Nasr City"},
            {"name_ar": "المعادي", "name_en": "Maadi"},
            {"name_ar": "التجمع الخامس", "name_en": "New Cairo"}
        ]
    },
    {
        "name_ar": "الجيزة", "name_en": "Giza", "base_fee": 50.00,
        "cities": [
            {"name_ar": "الدقي", "name_en": "Dokki"},
            {"name_ar": "6 أكتوبر", "name_en": "6th of October", "custom_fee": 60.00}
        ]
    },
    {
        "name_ar": "الشرقية", "name_en": "Al Sharqia", "base_fee": 55.00,
        "cities": [
            {"name_ar": "الزقازيق", "name_en": "Zagazig"},
            {"name_ar": "العاشر من رمضان", "name_en": "10th of Ramadan", "custom_fee": 65.00},
            {"name_ar": "بلبيس", "name_en": "Belbeis"}
        ]
    }
]

async def auto_seed_shipping(db=None):
    """وظيفة لإضافة البيانات تلقائياً عند تشغيل السيرفر"""
    should_close = False
    if db is None:
        db = AsyncSessionLocal()
        should_close = True
    
    try:
        # تأكد لو فيه داتا أصلاً
        res = await db.execute(select(Governorate).limit(1))
        if res.scalars().first():
            return

        print("🚚 Seeding Shipping Data...")
        for gov in INITIAL_LOCATIONS:
            new_gov = Governorate(
                name_ar=gov["name_ar"],
                name_en=gov["name_en"],
                base_shipping_fee=gov["base_fee"]
            )
            db.add(new_gov)
            await db.flush()

            for city in gov["cities"]:
                new_city = City(
                    governorate_id=new_gov.id,
                    name_ar=city["name_ar"],
                    name_en=city["name_en"],
                    custom_shipping_fee=city.get("custom_fee")
                )
                db.add(new_city)
        
        await db.commit()
        print("✅ Shipping Data Seeded Successfully!")
    finally:
        if should_close:
            await db.close()