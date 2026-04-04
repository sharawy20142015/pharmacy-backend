import datetime
import random
import string
import secrets
from sqladmin import ModelView
from models.Short_Item_No import ShortItemNo
from sqlalchemy import select
from models.Category import Category
def generate_short_sku():
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(8))

class ShortItemAdmin(ModelView, models=ShortItemNo):
    # الأعمدة التي تظهر في جدول العرض الرئيسي
    column_list = [
        ShortItemNo.id, 
        ShortItemNo.short_item_no, 
        ShortItemNo.ar_name, 
        ShortItemNo.en_name
    ]
    
    # الأعمدة القابلة للبحث
    searchable_columns = [ShortItemNo.short_item_no, ShortItemNo.ar_name]
    
    # الحقول التي تظهر في نموذج الإضافة والتعديل
    form_columns = [
        'short_item_no', 
        'ar_name', 
        'en_name', 
        'description', 
        'img_url1', 
        'img_url2', 
        'img_url3', 
        'img_url4', 
        'category_name'
    ]

    
    form_args = {
        'short_item_no': {
            'default': generate_short_sku
        },
        
    }

    form_widget_args = {
        'short_item_no': {
            'readonly': True,
            'style': 'background-color: #e9ecef; cursor: not-allowed; font-weight: bold; border: 1px solid #ced4da;'
        },
        'description': {
            'rows': 3  # تحسين مظهر حقل الوصف
        }
    }

    name = "Short Item"
    label = "الأصناف"
    icon = "fa-solid fa-pills"


    