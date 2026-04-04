# 1. استخدام نسخة بايثون خفيفة ورسمية (مبنية على Debian 12 Bookworm)
FROM python:3.10-slim

# 2. تثبيت أدوات النظام وتعاريف قواعد البيانات (Postgres & MSSQL)
# تم تحديث طريقة إضافة مفتاح مايكروسوفت لتجنب خطأ apt-key not found
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    gcc \
    g++ \
    unixodbc-dev \
    libpq-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-archive-keyring.gpg \
    && echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. تحديد مجلد العمل داخل الكونتينر
WORKDIR /app

# 4. نسخ ملف المتطلبات أولاً (للاستفادة من الـ Docker Cache)
# تأكد أن الملف موجود في نفس مجلد الـ Dockerfile
COPY requirements.txt .

# 5. تثبيت مكتبات البايثون الأساسية والتعاريف المطلوبة
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir asyncpg psycopg2-binary aioodbc

# 6. نسخ باقي ملفات المشروع بالكامل
COPY . .

# 7. فتح بورت 8000 للتواصل مع السيرفر
EXPOSE 8000

# 8. أمر التشغيل
# استخدمنا sh -c عشان نضمن تشغيل uvicorn بمرونة
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000"]