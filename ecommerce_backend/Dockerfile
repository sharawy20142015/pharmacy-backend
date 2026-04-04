# 1. بنبدأ بنسخة بايثون خفيفة
FROM python:3.10-slim

# 2. بنحدد الفولدر اللي هنشتغل جواه جوه الكبسولة
WORKDIR /app

# 3. بنمنع بايثون من إنها تكريت ملفات pyc عشان توفر مساحة
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 4. بننزل تعريفات الـ PostgreSQL عشان نعرف نربط بالداتابيز
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 5. بنسخ ملف المكتبات
COPY requirements.txt .

# 6. بننزل المكتبات
RUN pip install --no-cache-dir -r requirements.txt

# 7. بنسخ كل ملفات المشروع للفولدر اللي جوه الكبسولة
COPY . .

# 8. البورت اللي FastAPI شغال عليه
EXPOSE 8000

# 9. أمر التشغيل
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]