# import asyncio
# from logging.config import fileConfig
# import sys
# import os
# from pathlib import Path

# from sqlalchemy import pool
# from sqlalchemy.engine import Connection
# from sqlalchemy.ext.asyncio import async_engine_from_config
# from alembic import context

# # =======================================================
# # 1. ضبط مسارات المشروع (System Path)
# # =======================================================
# # هذا السطر مهم جداً لكي يرى Alembic مجلد app
# BASE_DIR = Path(__file__).resolve().parent.parent
# sys.path.append(str(BASE_DIR))

# # =======================================================
# # 2. استيراد إعدادات قاعدة البيانات والموديلز
# # =======================================================
# # استيراد رابط الاتصال (Async)
# from app.db.session import ASYNC_CONN_STR

# # استيراد Base من الملف الذي جمعنا فيه كل الموديلز
# # (تأكد أن app/db/base.py يحتوي على imports لكل الجداول)
# from app.db.base import Base 

# # =======================================================
# # 3. إعدادات Alembic (Logging & Config)
# # =======================================================
# config = context.config

# # إعدادات اللوجينج من ملف alembic.ini
# if config.config_file_name is not None:
#     fileConfig(config.config_file_name)

# # ربط الـ MetaData الخاصة بالمشروع بـ Alembic
# target_metadata = Base.metadata

# # =======================================================
# # 4. دالة تشغيل الترحيل (Sync Wrapper)
# # =======================================================
# def do_run_migrations(connection: Connection) -> None:
#     context.configure(
#         connection=connection, 
#         target_metadata=target_metadata,
#         # تفعيل مقارنة أنواع البيانات (مهم لتغيير Float -> Numeric)
#         compare_type=True,
#     )

#     with context.begin_transaction():
#         context.run_migrations()

# # =======================================================
# # 5. دالة التشغيل في الوضع الأونلاين (Async)
# # =======================================================
# async def run_migrations_online() -> None:
#     """Run migrations in 'online' mode."""
    
#     # قراءة الإعدادات من ملف .ini
#     configuration = config.get_section(config.config_ini_section, {})
    
#     # استبدال رابط الاتصال بالرابط الموجود في الكود (من ملف .env)
#     configuration["sqlalchemy.url"] = ASYNC_CONN_STR
    
#     # إنشاء المحرك (Engine)
#     connectable = async_engine_from_config(
#         configuration,
#         prefix="sqlalchemy.",
#         poolclass=pool.NullPool,
#     )

#     async with connectable.connect() as connection:
#         # تشغيل الترحيل بشكل متزامن داخل البيئة غير المتزامنة
#         await connection.run_sync(do_run_migrations)

#     await connectable.dispose()

# # =======================================================
# # 6. نقطة البداية (Entry Point)
# # =======================================================
# if context.is_offline_mode():
#     # التشغيل في وضع الأوفلاين (بدون اتصال مباشر)
#     context.configure(
#         url=ASYNC_CONN_STR,
#         target_metadata=target_metadata,
#         literal_binds=True,
#         dialect_opts={"paramstyle": "named"},
#         compare_type=True
#     )

#     with context.begin_transaction():
#         context.run_migrations()
# else:
#     # التشغيل في وضع الأونلاين (الوضع الطبيعي)
#     asyncio.run(run_migrations_online())

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
    
    # 🚀 --- تعديل مؤقت للاتصال بـ Supabase مباشرة --- 🚀
    configuration["sqlalchemy.url"] = "postgresql+asyncpg://postgres.fvvtdohqklzfskuyyrar:Sharawy2345b@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
    
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
        url="postgresql+asyncpg://postgres.fvvtdohqklzfskuyyrar:Sharawy2345b@aws-0-eu-west-1.pooler.supabase.com:6543/postgres",
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()
else:
    asyncio.run(run_migrations_online())