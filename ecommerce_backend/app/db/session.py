# app/db/session.py
import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from dotenv import load_dotenv

# 1. تحديد مسار المشروع الرئيسي ديناميكياً
# الملف الحالي: ecommerce_backend/app/db/session.py
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 2. تحميل ملف البيئة (production أو development)
ENV = os.getenv("ENV", "development")
env_filename = f".env.{ENV}"
dotenv_path = BASE_DIR / env_filename

print(f"🔍 DEBUG: Loading environment variables from: {dotenv_path}")

# تحميل الملف
load_dotenv(dotenv_path=dotenv_path)

# 3. قراءة المتغيرات من ملف الـ .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_DRIVER = os.getenv("DB_DRIVER")

# 4. التحقق من وجود البيانات الأساسية
if not DB_PASSWORD:
    raise ValueError(f"❌ Error: DB_PASSWORD is missing in {env_filename}")

if not DB_DRIVER:
    raise ValueError(f"❌ Error: DB_DRIVER is missing in {env_filename}")

# تشفير الباسورد والدرايفر للتعامل مع الرموز الخاصة والمسافات
encoded_password = quote_plus(DB_PASSWORD)
if " " in DB_DRIVER:
    encoded_driver = quote_plus(DB_DRIVER)
else:
    encoded_driver = DB_DRIVER

# 5. تكوين الرابط بشكل مرن (يدعم Postgres و SQL Server)
if "postgresql" in DB_DRIVER:
    # تنسيق رابط PostgreSQL (المستخدم في السيرفر EC2)
    ASYNC_CONN_STR = f"postgresql+asyncpg://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    print(f"🚀 MODE: [Production] - Connecting to PostgreSQL at {DB_HOST}")
else:
    # تنسيق رابط SQL Server (المستخدم غالباً في Windows Development)
    ASYNC_CONN_STR = (
        f"mssql+aioodbc://{DB_USER}:{encoded_password}@"
        f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
        f"?driver={encoded_driver}&encrypt=no&TrustServerCertificate=yes"
    )
    print(f"🛠️ MODE: [Development] - Connecting to SQL Server at {DB_HOST}")

# 6. إنشاء المحرك (Engine)
async_engine = create_async_engine(
    ASYNC_CONN_STR,
    echo=False,  # اجعلها True لو حابب تشوف استعلامات الـ SQL في التيرمينال
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_pre_ping=True
)

# 7. إعداد مصنع الجلسات (Session Factory)
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