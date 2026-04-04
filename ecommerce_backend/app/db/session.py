# app/db/session.py
import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from dotenv import load_dotenv

# 1. تحديد مسار المشروع الرئيسي ديناميكياً
# الملف الحالي: ecommerce_backend/app/db/session.py
# .parent -> app/db
# .parent -> app
# .parent -> ecommerce_backend (ده الـ Root اللي فيه ملف الـ .env)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 2. تحميل ملف البيئة
ENV = os.getenv("ENV", "development")
env_filename = f".env.{ENV}"
dotenv_path = BASE_DIR / env_filename

print(f"🔍 DEBUG: Loading environment variables from: {dotenv_path}")

# تحميل الملف
load_dotenv(dotenv_path=dotenv_path)

# 3. قراءة المتغيرات
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_DRIVER = os.getenv("DB_DRIVER")

# 4. التحقق من وجود البيانات (Data Validation) - خطوة مهمة جداً
if not DB_PASSWORD:
    raise ValueError(f"❌ Error: DB_PASSWORD is missing! Make sure {env_filename} exists and contains DB_PASSWORD.")

if not DB_DRIVER:
    raise ValueError(f"❌ Error: DB_DRIVER is missing in {env_filename}")

# معالجة الدرايفر
if " " in DB_DRIVER:
    encoded_driver = quote_plus(DB_DRIVER)
else:
    encoded_driver = DB_DRIVER

# تشفير الباسورد
encoded_password = quote_plus(DB_PASSWORD)

# 5. تكوين الرابط
ASYNC_CONN_STR = (
    f"mssql+aioodbc://{DB_USER}:{encoded_password}@"
    f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
    f"?driver={encoded_driver}&encrypt=no&TrustServerCertificate=yes"
)

# 6. إنشاء المحرك
async_engine = create_async_engine(
    ASYNC_CONN_STR,
    echo=True, # خليها True عشان نشوف الـ SQL في التيرمينال
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()