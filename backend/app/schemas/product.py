from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ProductOut(BaseModel):
    id: UUID
    name: str
    slug: str
    price: float
    offer_price: Optional[float] = None
    has_offer: bool = False
    images: list[str] = []
    sizes: list[str] = []
    category: Optional[str] = None
    description: Optional[str] = None
    is_upsell: bool = False
    rating: float = 0.0
    reviews_count: int = 0

    model_config = {"from_attributes": True}


class OrderItemIn(BaseModel):
    product_id: str
    product_name: str
    size: str
    quantity: int
    unit_price: float


class OrderIn(BaseModel):
    customer_name: str
    customer_phone: str
    items: list[OrderItemIn]
    upsell_accepted: bool = False
    upsell_product_id: Optional[str] = None
    total: float
    event_id: str


class OrderOut(BaseModel):
    order_id: UUID
    order_number: str
    status: str
    message: str


class ErrorOut(BaseModel):
    detail: str
    code: str
