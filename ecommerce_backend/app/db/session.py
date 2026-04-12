# app/db/session.py
import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from dotenv import load_dotenv

# 1. تحديد مسار المشروع الرئيسي ديناميكياً
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 2. تحميل ملف البيئة (production أو development)
ENV = os.getenv("ENV", "development")
env_filename = f".env.{ENV}"
dotenv_path = BASE_DIR / env_filename

print(f"🔍 DEBUG: Loading environment variables from: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

# 3. قراءة المتغيرات من ملف الـ .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT") # تأكد أن هذا 6543 في ملف الـ .env.production
DB_NAME = os.getenv("DB_NAME")
DB_DRIVER = os.getenv("DB_DRIVER")

# 4. التحقق من وجود البيانات الأساسية
if not DB_PASSWORD or not DB_DRIVER:
    raise ValueError(f"❌ Error: Required DB variables are missing in {env_filename}")

# تشفير البيانات للتعامل مع الرموز الخاصة
encoded_password = quote_plus(DB_PASSWORD)
encoded_driver = quote_plus(DB_DRIVER) if " " in DB_DRIVER else DB_DRIVER

# 5. تكوين الرابط بشكل مرن
if "postgresql" in DB_DRIVER:
    # رابط PostgreSQL لـ Supabase
    ASYNC_CONN_STR = f"postgresql+asyncpg://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    print(f"🚀 MODE: [Production] - Connecting to Supabase Pooler at {DB_HOST}:{DB_PORT}")
else:
    # رابط SQL Server للتطوير المحلي
    ASYNC_CONN_STR = (
        f"mssql+aioodbc://{DB_USER}:{encoded_password}@"
        f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
        f"?driver={encoded_driver}&encrypt=no&TrustServerCertificate=yes"
    )
    print(f"🛠️ MODE: [Development] - Connecting to SQL Server at {DB_HOST}")

# 6. إنشاء المحرك (Engine) بإعدادات الضغط العالي
async_engine = create_async_engine(
    ASYNC_CONN_STR,
    echo=False,
    # 🟢 إعدادات المسبح (Pool) لضمان تحمل +100 مستخدم
    pool_size=50,          # عدد الاتصالات الثابتة المفتوحة
    max_overflow=50,       # اتصالات إضافية تفتح وقت الذروة (الإجمالي 100)
    pool_timeout=30,       # مدة انتظار العميل قبل فشل الاتصال
    pool_pre_ping=True,    # التحقق من سلامة الاتصال قبل استخدامه
    
    # 🔴 إعدادات ضرورية لـ Supabase Pooler (بورت 6543) 🔴
    # تمنع خطأ "prepared statement does not exist"
    connect_args={
        "prepared_statement_cache_size": 0,
        "statement_cache_size": 0
    } if "postgresql" in DB_DRIVER else {}
)

# 7. إعداد مصنع الجلسات
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 8. دالة الحصول على قاعدة البيانات (Dependency Injection)
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()