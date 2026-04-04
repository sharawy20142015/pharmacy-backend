import pandas as pd
import io

def create_bulk_template():
    """
    توليد ملف إكسيل (Template) يحتوي على كافة الأعمدة اللازمة لرفع المنتجات 
    بشكل جماعي لصيدلية شعراوي، مع دعم الفئات والصور والتاجات المتعددة.
    """
    # القائمة الكاملة للأعمدة بناءً على منطق الـ Database الحالي
    columns = [
        "short_item_no",      # كود الصنف الأساسي (Unique SKU)
        "ar_name",            # الاسم بالعربي
        "en_name",            # الاسم بالإنجليزي
        "brand_name",         # الماركة (Brand)
        "categories",         # الفئات (مفصولة بفاصلة ,) مثل: أدوية, مسكنات
        "description",        # الوصف الكامل للمنتج
        "header",             # نص مميز (مثال: الأكثر مبيعاً)
        "sub_header",         # نص فرعي (مثال: خصم لفترة محدودة)
        "price",              # السعر الأساسي
        "discount_percentage",# نسبة الخصم (مثلاً 10)
        "discount_value",     # قيمة الخصم المباشرة (إن وجدت)
        "stock_quantity",     # الكمية المتاحة في المخزن
        "main_image_url",     # رابط الصورة الأساسية
        "extra_images",       # روابط الصور الإضافية (مفصولة بفاصلة ,)
        "tags",               # التاجات للبحث (مفصولة بفاصلة ,)
        "is_featured"         # هل يظهر في المميز؟ (1 للقبول، 0 للرفض)
    ]
    
    # صف بيانات تجريبي (Sample) عشان اللي بيدخل البيانات ميتلخبطش
    sample_data = [{
        "short_item_no": "SH-1001",
        "ar_name": "بندول اكسترا 20 قرص",
        "en_name": "Panadol Extra 20 Tab",
        "brand_name": "GSK",
        "categories": "أدوية, مسكنات", 
        "description": "يستخدم لتخفيف الآلام المتوسطة والشديدة مثل الصداع",
        "header": "الأكثر طلباً",
        "sub_header": "متوفر الآن",
        "price": 35.0,
        "discount_percentage": 10,
        "discount_value": 0,
        "stock_quantity": 100,
        "main_image_url": "https://example.com/main.jpg",
        "extra_images": "img1.jpg, img2.jpg",
        "tags": "صداع, برد, خافض حرارة",
        "is_featured": 1
    }]

    df = pd.DataFrame(sample_data, columns=columns)
    
    output = io.BytesIO()
    
    # استخدام xlsxwriter لتنسيق الملف ليظهر بشكل احترافي
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Products_Template')
        
        workbook  = writer.book
        worksheet = writer.sheets['Products_Template']
        
        # تنسيق رأس الجدول (Header)
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#D7E4BC', # لون أخضر هادئ
            'border': 1,
            'align': 'center',
            'valign': 'vcenter'
        })
        
        # تطبيق التنسيق وتوسيع الأعمدة تلقائياً
        for col_num, value in enumerate(df.columns.values):
            worksheet.write(0, col_num, value, header_format)
            # ضبط عرض العمود بناءً على طول اسم العمود
            worksheet.set_column(col_num, col_num, 20)

    output.seek(0)
    return output