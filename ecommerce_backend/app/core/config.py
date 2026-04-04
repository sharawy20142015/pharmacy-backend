from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # إعدادات المشروع العامة
    PROJECT_NAME: str = "Sharawy Pharmacy System"
    VERSION: str = "1.0.0"
    
    # إعدادات قاعدة البيانات - سيتم سحبها من .env أو استخدام الافتراضي
    DATABASE_URL: str = "sqlite+aiosqlite:///./pharmacy.db"
    
    # الأمن والتشفير - حذارِ من ترك القيم الحساسة هنا في الإنتاج
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_DONT_SHARE" 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # أسبوع كامل

    # إعدادات جوجل
    GOOGLE_CLIENT_ID: str = "862508946163-tc53fo7jqb5ckq5tq48po8lqpimp8dnv.apps.googleusercontent.com"

    class Config:
        # ترتيب قراءة ملفات البيئة (الأولوية لـ .env لو موجود)
        env_file = ".env"
        case_sensitive = True

settings = Settings()