from sqladmin import ModelView
from models.Category import Category
from app.db.session import SessionLocal

class CategoryAdmin(ModelView, models=Category):
    column_list = [Category.id, Category.name, Category.parent_id]    
    form_columns = ['name', 'parent'] 
    name = "Category"
    label = "الفئات"
    icon = "fa-solid fa-layer-group" # أيقونة أنسب للتقسيمات