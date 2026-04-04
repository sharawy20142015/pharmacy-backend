import asyncio
import sys
import os
from sqlalchemy import text

# إضافة مسار المشروع عشان الاستيراد يشتغل صح
sys.path.append(os.getcwd())

# استيراد المحرك والموديلات
from app.db.session import async_engine
from app.db.base import Base
# استيراد كل الموديلات عشان Base يشوفهم
from app.models import * 
async def reset_database():
    print("🗑️  Step 1: Dropping all existing tables...")
    async with async_engine.begin() as conn:
        # تعطيل القيود مؤقتاً في SQL Server عشان ميعملش Foreign Key error وقت المسح
        await conn.execute(text("EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL'"))
        
        # مسح الجداول
        await conn.run_sync(Base.metadata.drop_all)
        
        # مسح جدول Alembic لو موجود عشان نصفر العداد
        await conn.execute(text("IF OBJECT_ID('alembic_version', 'U') IS NOT NULL DROP TABLE alembic_version"))
        
        print("✅ Tables deleted successfully.")

    print("🏗️  Step 2: Creating new tables with the new String-based relationships...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("🎉 Database has been reset! All columns (including short_item_no) are now synced.")

if __name__ == "__main__":
    # حل مشكلة الـ Windows Event Loop
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    try:
        asyncio.run(reset_database())
    except Exception as e:
        print(f"❌ Error during reset: {e}")