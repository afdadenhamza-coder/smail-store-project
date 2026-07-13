from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class AdminLogin(BaseModel):
    email: str
    password: str


class AdminToken(BaseModel):
    token: str


class DashboardStats(BaseModel):
    total_clicks: int
    valid_clicks: int
    total_orders: int
    confirmed_orders: int
    total_revenue: float
    conversion_rate: float
    avg_order_value: float


class DailyRevenue(BaseModel):
    date: str
    revenue: float
    orders: int


class TopProduct(BaseModel):
    product_name: str
    quantity: int
    revenue: float
    image: Optional[str] = None


class OrderStatusDist(BaseModel):
    status: str
    count: int
    label: str


class DetailedStats(BaseModel):
    today_revenue: float
    today_orders: int
    total_revenue: float
    total_orders: int
    pending_orders: int
    confirmed_orders: int
    shipped_orders: int
    delivered_orders: int
    cancelled_orders: int
    returned_orders: int
    valid_clicks: int
    total_clicks: int
    conversion_rate: float
    avg_order_value: float
    revenue_chart: list[DailyRevenue]
    top_products: list[TopProduct]
    status_distribution: list[OrderStatusDist]


class ProfitCalcIn(BaseModel):
    selling_price: float
    product_cost: float
    shipping_cost: float = 0
    packaging_cost: float = 0
    cod_fee: float = 0
    platform_commission_pct: float = 0
    platform_commission_fixed: float = 0
    tax_pct: float = 0


class ProfitCalcOut(BaseModel):
    total_cost: float
    platform_commission_amount: float
    tax_amount: float
    net_profit: float
    profit_margin_pct: float
    markup_pct: float
    break_even: float


class OrderListItem(BaseModel):
    id: UUID
    order_number: str
    customer_name: str
    customer_phone: str
    total: float
    status: str
    upsell_accepted: bool
    items: list[dict]
    items_count: int
    created_at: datetime


class OrderListResponse(BaseModel):
    orders: list[OrderListItem]
    total: int
    page: int
    per_page: int


class OrderDetail(BaseModel):
    id: UUID
    order_number: str
    customer_name: str
    customer_phone: str
    items: list[dict]
    total: float
    status: str
    upsell_accepted: bool
    upsell_product_id: Optional[str] = None
    event_id: str
    client_ip: Optional[str] = None
    client_user_agent: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class StatusUpdate(BaseModel):
    status: str


class ClickTrackIn(BaseModel):
    path: str
    session_id: Optional[str] = None


class ClickTrackOut(BaseModel):
    tracked: bool


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    offer_price: Optional[float] = None
    has_offer: bool = False
    images: list[str] = []
    sizes: list[str] = None
    category: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    is_upsell: bool = False
    rating: float = 0.0
    reviews_count: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "name": "قميص تي شيرت",
                "slug": "tshirt-blue",
                "description": "قميص تي شيرت عالي الجودة",
                "price": 199.99,
                "offer_price": 149.99,
                "has_offer": True,
                "images": ["https://example.com/image1.jpg"],
                "sizes": ["S", "M", "L", "XL"],
                "category": "t-shirts",
                "is_active": True,
                "is_featured": False
            }
        }

    def __init__(self, **data):
        super().__init__(**data)
        if self.sizes is None:
            self.sizes = ["S", "M", "L", "XL"]


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    offer_price: Optional[float] = None
    has_offer: Optional[bool] = None
    images: Optional[list[str]] = None
    sizes: Optional[list[str]] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_upsell: Optional[bool] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None


class ProductListResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    price: float
    offer_price: Optional[float] = None
    has_offer: bool = False
    images: list[str] = []
    category: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    is_upsell: bool = False
    created_at: datetime
    updated_at: datetime
