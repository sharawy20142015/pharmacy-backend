from pydantic import BaseModel
from typing import List, Optional

# --- الـ Schema الأساسية للقسم ---
class CategoryBase(BaseModel):
    name: str
    slug: str
    img_url: Optional[str] = None
    level: int = 0
    parent_id: Optional[int] = None

# --- Schema القراءة (لعرض البيانات) ---
class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# --- Schema متقدمة (لجلب القسم مع الأقسام الفرعية التابعة له) ---
class CategoryWithSub(CategoryRead):
    # قائمة بداخلها نفس النوع لعمل هيكل شجري (Self-referencing)
    sub_categories: List['CategoryRead'] = []

    class Config:
        from_attributes = True

# لإصلاح مشكلة الـ Forward Reference في الداتا المتداخلة
CategoryWithSub.model_rebuild()