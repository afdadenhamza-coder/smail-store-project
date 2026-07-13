# 08 — Pixels & Tracking

## Overview

Three tracking systems: Facebook, TikTok, Snapchat.
Each has two layers: Web Pixel (client-side, no hashing) + CAPI/Events API (server-side, SHA256 hashed).

## Dedup Strategy

- `event_id` is a UUID v4 generated on the client before checkout submission
- Same `event_id` is sent to:
  - Web pixel (Purchase event): `fbq('track', 'Purchase', {eventID: event_id})`
  - Server CAPI: `event_id` field in the request body
- TikTok: `event_id` used for dedup
- Snapchat: `client_dedup_id` = `event_id`

## Hashing Utilities

In `backend/app/services/hashing.py`:

```python
import hashlib

def sha256_hash(value: str) -> str:
    """SHA256 hex digest"""
    return hashlib.sha256(value.encode('utf-8').strip().lower()).hexdigest()
```

### Field-Specific Hashing Rules

| Platform | Field | Normalization |
|----------|-------|---------------|
| Facebook | email | lowercase + trim + SHA256 |
| Facebook | phone | remove non-digits + keep 10 digits + SHA256 |
| TikTok | email | lowercase + trim + SHA256 |
| TikTok | phone | E.164 with "+" prefix (e.g. +212612345678) + SHA256 |
| Snapchat | email | lowercase + trim + SHA256 |
| Snapchat | phone | remove non-digits + SHA256 |

## Facebook CAPI (Meta Conversions API)

**Endpoint**: `POST https://graph.facebook.com/v25.0/{PIXEL_ID}/events`

**Payload:**
```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1700000000,
    "event_id": "uuid",
    "event_source_url": "https://smailstore.shop/product/...",
    "action_source": "website",
    "user_data": {
      "em": ["sha256_hashed_email"],
      "ph": ["sha256_hashed_phone"],
      "client_ip_address": "1.2.3.4",
      "client_user_agent": "Mozilla/5.0 ..."
    },
    "custom_data": {
      "contents": [{"id": "product_id", "quantity": 1}],
      "value": 299.00,
      "currency": "MAD",
      "content_type": "product"
    }
  }],
  "test_event_code": "TEST12345"
}
```

**Access Token**: System User access token from Meta Business Suite.

## TikTok Events API

**Endpoint**: `POST https://business-api.tiktok.com/open_api/v1.3/event/track/`

**Payload:**
```json
{
  "event_source": "web",
  "event_source_id": "{PIXEL_CODE}",
  "data": [{
    "event": "PlaceAnOrder",
    "event_time": 1700000000,
    "event_id": "uuid",
    "user": {
      "email": "sha256_hashed_email",
      "phone": "sha256_hashed_phone_with_plus_prefix",
      "ip": "1.2.3.4",
      "user_agent": "Mozilla/5.0 ..."
    },
    "properties": {
      "contents": [{"content_id": "product_id", "content_name": "Product", "quantity": 1, "price": 299.00}],
      "value": 299.00,
      "currency": "MAD"
    }
  }]
}
```

**Note**: TikTok phone must be E.164 format (with +) before hashing. So "+212612345678" → SHA256 hex.
Access token: System user token from TikTok Business Center.

## Snapchat Conversions API

**Endpoint**: `POST https://business-api.snapchat.com/v2/conversions/{PIXEL_ID}/events`

**Payload:**
```json
{
  "pixel_id": "{PIXEL_ID}",
  "events": [{
    "event_name": "PURCHASE",
    "event_time": 1700000000,
    "client_dedup_id": "uuid (same as event_id)",
    "event_source": "WEB",
    "user_data": {
      "em": "sha256_hashed_email",
      "ph": "sha256_hashed_phone",
      "client_ip": "1.2.3.4",
      "user_agent": "Mozilla/5.0 ..."
    },
    "item_ids": ["product_id"],
    "price": [299.00],
    "currency": "MAD"
  }]
}
```

## Web Pixels (Deferred Loading)

All pixel scripts loaded with `defer` or `loading="lazy"` to not block page rendering.

```html
<!-- Facebook Pixel -->
<script defer>
  !function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '{PIXEL_ID}');
  fbq('track', 'PageView');
</script>

<!-- TikTok Pixel -->
<script defer>
  !function (w, d, t) { ... }(window, document, 'https://analytics.tiktok.com/i18n/pixel/events.js');
  ttq.init('{PIXEL_CODE}');
  ttq.page();
</script>

<!-- Snapchat Pixel -->
<script defer src="https://sc-static.net/scevent.min.js"></script>
<script defer>
  window.snaptr = function(name, params){...};
  snaptr('init', '{PIXEL_ID}');
  snaptr('track', 'PAGE_VIEW');
</script>
```

## Pixel Events Fired

| User Action | Facebook | TikTok | Snapchat |
|-------------|----------|--------|----------|
| Browse home | PageView | PageView | PAGE_VIEW |
| View product | ViewContent | ViewContent | VIEW_CONTENT |
| Add to cart | AddToCart | AddToCart | ADD_CART |
| Open checkout | InitiateCheckout | InitiateCheckout | START_CHECKOUT |
| Successful order | Purchase (web + CAPI) | PlaceAnOrder (web+Events API) | PURCHASE (web+CAPI) |
