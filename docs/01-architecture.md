# 01 — System Architecture

## Overview

Smail Store is a DTC branded e-commerce store for Moroccan men. COD only. High-ticket positioning.

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI + SQLAlchemy + Alembic
- **Database**: PostgreSQL 15+ (database name: `smailstore`)
- **Hosting**: Easypanel (Docker Compose)
- **Domain**: smailstore.shop | API: api.smailstore.shop

## Folder Structure

```
smailstore/
├── frontend/                    # Next.js 14 app
│   ├── app/
│   │   ├── layout.tsx           # RTL root layout
│   │   ├── page.tsx             # Home page
│   │   ├── product/[id]/
│   │   │   └── page.tsx         # Product/landing page
│   │   ├── collections/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Collection page
│   │   ├── about/
│   │   │   └── page.tsx         # About us
│   │   ├── contact/
│   │   │   └── page.tsx         # Contact us
│   │   └── thank-you/
│   │       └── page.tsx         # Post-order confirmation
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── UpsellTimer.tsx     # 10-15s upsell at 99 DH
│   │   ├── ProductCard.tsx
│   │   ├── CrossSellStrip.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── PhoneInput.tsx
│   │   ├── SizeGuide.tsx
│   │   ├── Stars.tsx
│   │   └── OrderSummary.tsx
│   ├── lib/
│   │   ├── cart.ts             # Zustand store
│   │   ├── api.ts              # API client
│   │   ├── pixels.ts           # FB/TikTok/Snap web pixels
│   │   ├── validation.ts       # Phone validation
│   │   └── utils.ts
│   ├── data/
│   │   └── products.ts         # Product data source
│   ├── public/
│   │   ├── images/
│   │   └── fonts/
│   ├── .env.example
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI app, CORS, lifespan
│   │   ├── config.py           # Settings from env
│   │   ├── database.py         # SQLAlchemy engine + session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── order.py
│   │   │   └── product.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── orders.py       # POST /api/orders
│   │   │   ├── products.py     # GET products
│   │   │   └── webhooks.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── order_service.py
│   │   │   ├── sheets.py       # Google Sheets webhook
│   │   │   ├── capi/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── meta.py     # Facebook CAPI
│   │   │   │   ├── tiktok.py   # TikTok Events API
│   │   │   │   └── snapchat.py # Snapchat CAPI
│   │   │   └── hashing.py      # SHA256 hashing utilities
│   │   └── migrations/
│   │       ├── env.py
│   │       └── versions/
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml           # Frontend + Backend + DB
├── .env.example                 # Root env example
└── README.md
```

## Data Flow

```
User Browser                    FastAPI Backend              PostgreSQL
     │                              │                          │
     ├── browse products ────────── GET /api/products ──────►  │
     │                              │◄────── products ──────── │
     │                              │                          │
     ├── add to cart (client-side, Zustand in localStorage)
     │                              │                          │
     ├── checkout modal ── name + phone
     │                              │                          │
     ├── 10-15s upsell timer (99 DH) │                         │
     │                              │                          │
     ├── submit order ──────────── POST /api/orders ─────────► │
     │                              │                          │
     │                              ├── store in DB            │
     │                              ├── POST to Google Sheets  │
     │                              ├── Facebook CAPI          │
     │                              ├── TikTok Events API      │
     │                              └── Snapchat CAPI          │
     │                              │                          │
     ├── redirect to /thank-you     │                          │
```

## Key Design Decisions

1. **No cart page** — Cart is a slide-in drawer from the right on ALL pages
2. **No address at checkout** — COD call collects address. Less friction = higher conversion.
3. **99 DH upsell is the ONLY discount** — Creates urgency and exclusivity
4. **Google Sheets sync** — Every order is also sent to a Google Sheet via webhook (JS code file you deploy in Apps Script)
5. **CAPI from backend** — Facebook, TikTok, Snapchat server events sent AFTER successful order
6. **Phone hashing**: SHA256 hex. TikTok phone needs E.164 format with + prefix before hashing
7. **Event dedup**: event_id + client_ip + client_user_agent sent to all CAPI endpoints
8. **Web pixels deferred**: `loading="lazy"` or `defer` on all pixel scripts
