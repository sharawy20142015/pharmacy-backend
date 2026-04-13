from pydantic import BaseModel
from typing import Optional,List

class ProductAdminCreate(BaseModel):
    short_item_no: str
    ar_name: str
    en_name: Optional[str] = None
    brand_name: Optional[str] = None
    description: Optional[str] = None
    header: Optional[str] = None
    sub_header: Optional[str] = None
    
    price: float
    discount_percentage: float = 0.0
    discount_value: float = 0.0
    stock_quantity: float = 0.0
    classification: Optional[str] = None
    
    is_active: bool = True
    is_featured: bool = False
    is_new_arrival: bool = False
    category_ids: List[int] = []
    main_image_url: Optional[str] = None