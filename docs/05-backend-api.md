# 05 — Backend API Specification

## Tech Stack

- Python 3.11+
- FastAPI
- SQLAlchemy 2.0 (async)
- Alembic (migrations)
- Pydantic v2 (validation)
- httpx (CAPI calls, Google Sheets webhook)
- python-dotenv

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/smailstore

# Meta/Facebook CAPI
META_PIXEL_ID=your_pixel_id
META_ACCESS_TOKEN=your_access_token
META_TEST_EVENT_CODE=TEST12345

# TikTok Events API
TIKTOK_PIXEL_CODE=your_pixel_code
TIKTOK_ACCESS_TOKEN=your_access_token

# Snapchat CAPI
SNAPCHAT_PIXEL_ID=your_pixel_id
SNAPCHAP_ACCESS_TOKEN=your_conversions_api_token

# Google Sheets Webhook
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/xxxx/exec

# CORS
CORS_ORIGINS=https://smailstore.shop,http://localhost:3000

# App
APP_ENV=production|development
```

## API Endpoints

### `GET /api/products`
Returns list of all products.

```json
[
  {
    "id": "uuid",
    "name": "T-shirt Classic Noir",
    "slug": "t-shirt-classic-noir",
    "price": 299.00,
    "offer_price": 249.00,
    "has_offer": true,
    "images": ["/images/product-1.jpg"],
    "sizes": ["S", "M", "L", "XL"],
    "category": "t-shirts",
    "description": "تيشيرت كلاسيك بجودة عالية",
    "reviews_count": 127,
    "rating": 4.8
  }
]
```

### `GET /api/products/{id}`
Returns single product with full details.

### `POST /api/orders`
Creates an order. This is the main endpoint.

**Request Body:**
```json
{
  "customer_name": "string",
  "customer_phone": "0612345678",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "string",
      "size": "M",
      "quantity": 1,
      "unit_price": 299.00
    }
  ],
  "upsell_accepted": false,
  "upsell_product_id": "uuid|null",
  "total": 299.00,
  "event_id": "uuid",
  "client_ip": "string (set by server from request)",
  "client_user_agent": "string (set by server from header)"
}
```

**Response:**
```json
{
  "order_id": "uuid",
  "order_number": "SMA-2024001",
  "status": "confirmed",
  "message": "تم تأكيد طلبك بنجاح"
}
```

**Server-side processing (order of operations):**
1. Validate phone number (Moroccan 10 digits, starts with 05/06/07)
2. Validate product IDs exist
3. Calculate total server-side (price × qty, no discounts except upsell)
4. Insert order into PostgreSQL
5. Fire-and-forget (asyncio.create_task):
   a. POST to Google Sheets webhook
   b. Facebook CAPI (Purchase event with SHA256 hashed data)
   c. TikTok Events API (Purchase event with SHA256 hashed data)
   d. Snapchat CAPI (Purchase event with SHA256 hashed data)

### `GET /api/health`
Health check endpoint.
```json
{ "status": "ok" }
```

## Error Handling

All errors return:
```json
{
  "detail": "وصف الخطأ بالدارجة أو الإنجليزية",
  "code": "ERROR_CODE"
}
```

Standard codes:
- `INVALID_PHONE` — رقم الهاتف غير صحيح
- `PRODUCT_NOT_FOUND` — المنتج غير موجود
- `INVALID_ORDER` — الطلب غير صحيح
- `RATE_LIMITED` — الرجاء المحاولة لاحقا

## Rate Limiting

- 10 POST /api/orders per IP per minute
- 100 GET requests per IP per minute
