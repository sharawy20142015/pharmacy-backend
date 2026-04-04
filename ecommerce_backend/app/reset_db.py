import asyncio
import sys
import os

# إضافة المسار الحالي عشان نقدر نستورد الـ app
sys.path.append(os.getcwd())

from app.app.db.session import async_engine
from app.db.base import Base
# ضروري جداً نستورد الموديلات عشان Base يعرف إن فيه جداول
from app.modelss import product, user, order, discount 

async def reset_database():
    print("🗑️  Deleting old models...")
    async with async_engine.begin() as conn:
        # حذف كل الجداول (User, Product, etc.)
        await conn.run_sync(Base.metadata.drop_all)
    print("✅ Old models deleted.")

    print("🏗️  Creating new models...")
    async with async_engine.begin() as conn:
        # إنشاء الجداول من جديد بناءً على كود الـ modelss
        await conn.run_sync(Base.metadata.create_all)
    
    print("🎉 Database reset successfully! All columns are synced.")

if __name__ == "__main__":
    # تشغيل الدالة (ويندوز أحياناً بيحتاج Loop Policy معين، بس ده الافتراضي)
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(reset_database())