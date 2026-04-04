# 1. استخدام نسخة بايثون خفيفة ورسمية
FROM python:3.10-slim

# 2. تثبيت أدوات النظام والتعريفات (MSSQL & Postgres Drivers)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    gcc \
    g++ \
    unixodbc-dev \
    libpq-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. تحديد مجلد العمل داخل الكونتينر
WORKDIR /app

# 4. نسخ ملف المتطلبات أولاً (عشان الـ Caching)
COPY requirements.txt .

# 5. تثبيت مكتبات البايثون
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir asyncpg psycopg2-binary aioodbc

# 6. نسخ باقي ملفات المشروع
COPY . .

# 7. فتح بورت 8000
EXPOSE 8000

# 8. أمر التشغيل (هنا بنستخدم ENV عشان نحدد الملف)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000"]