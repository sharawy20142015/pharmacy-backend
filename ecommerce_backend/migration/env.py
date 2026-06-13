import asyncio
from logging.config import fileConfig
import sys
import os
from pathlib import Path

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

# =======================================================
# 1. ضبط مسارات المشروع (System Path)
# =======================================================
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# =======================================================
# 2. استيراد إعدادات قاعدة البيانات والموديلز
# =======================================================
from app.db.session import ASYNC_CONN_STR
from app.db.base import Base 

# =======================================================
# 3. إعدادات Alembic (Logging & Config)
# =======================================================
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# ------------------------------------------------------------
# 🟢 التعديل الذكي: قراءة الرابط ديناميكياً وحل مشكلة الـ Async Driver
# ------------------------------------------------------------
prod_db_url = os.getenv("DATABASE_URL")
if prod_db_url:
    # تحويل الرابط ليدعم الـ Asyncpg توماتيكياً لو مبعوت عادي
    if prod_db_url.startswith("postgres://"):
        prod_db_url = prod_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif prod_db_url.startswith("postgresql://"):
        prod_db_url = prod_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    CURRENT_DATABASE_URL = prod_db_url
else:
    # الرجوع للمحلي لو مش مبعوت متغير بيئة
    CURRENT_DATABASE_URL = ASYNC_CONN_STR
# ------------------------------------------------------------

# =======================================================
# 4. دالة تشغيل الترحيل (Sync Wrapper)
# =======================================================
def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection, 
        target_metadata=target_metadata,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()

# =======================================================
# 5. دالة التشغيل في الوضع الأونلاين (Async)
# =======================================================
async def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    
    configuration = config.get_section(config.config_ini_section, {})
    
    # استخدام الرابط الديناميكي الآمن 🚀
    configuration["sqlalchemy.url"] = CURRENT_DATABASE_URL
    
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

# =======================================================
# 6. نقطة البداية (Entry Point)
# =======================================================
if context.is_offline_mode():
    context.configure(
        url=CURRENT_DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()
else:
    asyncio.run(run_migrations_online())