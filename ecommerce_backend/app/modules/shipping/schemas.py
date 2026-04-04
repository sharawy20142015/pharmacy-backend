from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal

class CityRead(BaseModel):
    id: int
    name_ar: str
    name_en: str
    custom_shipping_fee: Optional[Decimal] = None

    class Config:
        from_attributes = True

class GovernorateRead(BaseModel):
    id: int
    name_ar: str
    name_en: str
    base_shipping_fee: Decimal
    cities: List[CityRead] = []

    class Config:
        from_attributes = True