import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# 1. استيراد الراوترز
from app.modules.orders import router as order_router 
from app.routers.Auth import Auth 
from app.routers.Banner import banner 
from app.routers.Offers import offers
from app.routers.Category import category
from app.routers.Product import product
from app.routers.Classifications import classifications
from app.modules.shipping import router as shipping_router 
from app.modules.identity import router as customer_point

# 2. استيراد وظائف الـ Seeding التلقائي
from app.modules.shipping.seed import auto_seed_shipping
from app.modules.category.seed_categories import auto_seed_categories

# 3. استيراد الإعدادات والأدمن
from app.admin_portal import setup_admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- كود التشغيل (Startup) ---
    print("---------------------------------------")
    print("🚀 Sharawy Pharmacy System Starting...")
    
    # تنفيذ إضافة بيانات الشحن تلقائياً
    try:
        await auto_seed_shipping()
        print("✅ Shipping Data Check: Done")
    except Exception as e:
        print(f"⚠️ Shipping Seed Warning: {e}")

    # تنفيذ إضافة الأقسام تلقائياً
    try:
        await auto_seed_categories()
        print("✅ Category Data Check: Done")
    except Exception as e:
        print(f"⚠️ Category Seed Warning: {e}")

    print("✅ Web Server is Running")
    print("---------------------------------------")
    
    yield
    
    # --- كود الإغلاق (Shutdown) ---
    print("🛑 Sharawy System Shutting Down...")

app = FastAPI(
    title='Sharawy Pharmacy API',
    lifespan=lifespan
)

# --- سحب الإعدادات من الـ Environment Variables ---
# نضع قيم افتراضية (Fallback) في حال عدم وجود الملف للأمان
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret_key_67890")
ADMIN_USER = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.getenv("ADMIN_PASSWORD", "sharawy123")

# --- Middlewares ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# استخدام الـ Secret Key من الـ env للسيشن
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# --- Static Files ---
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- تسجيل الراوترز ---
app.include_router(order_router.router) 
app.include_router(Auth.router) 
app.include_router(banner.router)
app.include_router(category.router)
app.include_router(product.router)
app.include_router(offers.router)
app.include_router(classifications.router)
app.include_router(shipping_router.router) 
app.include_router(customer_point.router) 

# --- إعداد نظام حماية لوحة التحكم (Admin Auth) ---
class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        
        # المقارنة مع القيم المسحوبة من الـ env
        if form.get("username") == ADMIN_USER and form.get("password") == ADMIN_PASS:
            request.session.update({"token": "admin_access_granted"})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        return request.session.get("token") == "admin_access_granted"

# تمرير الـ Secret Key المسحوب من الـ env أيضاً هنا
setup_admin(app, AdminAuth(secret_key=SECRET_KEY))

@app.get('/')
async def root():
    return {'message': 'Sharawy Pharmacy API is running 🚀'}