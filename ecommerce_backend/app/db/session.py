# app/db/session.py
import os
from pathlib import Path
from urllib.parse import quote_plus
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from dotenv import load_dotenv

# 1. تحديد مسار المشروع الرئيسي (الـ Root اللي فيه ملفات الـ .env)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 2. تحديد نوع البيئة (Default: development)
# على السيرفر هتعمل export ENV=production عشان يلقط ملف .env.production
ENV = os.getenv("ENV", "development")
env_filename = f".env.{ENV}"
dotenv_path = BASE_DIR / env_filename

print(f"🔍 DEBUG: Loading environment variables from: {dotenv_path}")
load_dotenv(dotenv_path=dotenv_path)

# 3. قراءة المتغيرات من ملف الـ .env اللي تم تحميله
DB_TYPE = os.getenv("DB_TYPE", "mssql")  # mssql لجهازك، postgresql للسيرفر
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_DRIVER = os.getenv("DB_DRIVER")

# 4. التحقق من وجود كلمة السر (Validation)
if not DB_PASSWORD:
    raise ValueError(f"❌ Error: DB_PASSWORD is missing in {env_filename}")

# تشفير الباسورد عشان لو فيها رموز زي (@ أو #) ما تبوظش الـ URL
encoded_password = quote_plus(str(DB_PASSWORD))

# 5. بناء رابط الاتصال (Connection String) بذكاء
if DB_TYPE == "postgresql":
    # وضع الـ Production (AWS EC2 + PostgreSQL)
    # بنستخدم asyncpg لأنه الأسرع والأفضل مع FastAPI و Linux
    ASYNC_CONN_STR = (
        f"postgresql+asyncpg://{DB_USER}:{encoded_password}@"
        f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    print(f"🚀 MODE: [Production] - Connecting to PostgreSQL at {DB_HOST}")
else:
    # وضع الـ Development (Local PC + MSSQL)
    if not DB_DRIVER:
        raise ValueError(f"❌ Error: DB_DRIVER is missing in {env_filename}")
    
    encoded_driver = quote_plus(DB_DRIVER)
    ASYNC_CONN_STR = (
        f"mssql+aioodbc://{DB_USER}:{encoded_password}@"
        f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
        f"?driver={encoded_driver}&encrypt=no&TrustServerCertificate=yes"
    )
    print(f"💻 MODE: [Development] - Connecting to MSSQL at {DB_HOST}")

# 6. إنشاء المحرك (Engine) مع إعدادات الـ Pooling
async_engine = create_async_engine(
    ASYNC_CONN_STR,
    echo=False,          # خليها True بس وأنت بتعمل Debug للـ SQL
    pool_size=20,        # عدد الاتصالات المفتوحة جاهزة للشغل
    max_overflow=10,     # اتصالات إضافية عند الضغط الزايد
    pool_timeout=30,     # مدة الانتظار قبل ما يطلع Error لو الـ Pool مليان
    pool_pre_ping=True   # بيتأكد إن الاتصال "صاحي" قبل ما يبعت الداتا (مهم جداً للـ Timeout)
)

# 7. مصنع الجلسات (Sessionmaker)
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False, # عشان الموديل يفضل شغال معاك بعد الـ commit
)

# 8. الـ Dependency Injection (اللي بتستخدمه في الـ Routes)
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            print(f"⚠️ Database Error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()