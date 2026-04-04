from pydantic import BaseModel
from typing import Optional

class ClassificationRead(BaseModel):
    id: int
    short_item_no: str
    classification_type: str  # زي Offer أو New Arrival
    img_url: Optional[str] = None

    class Config:
        from_attributes = True