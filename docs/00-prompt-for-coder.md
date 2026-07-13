# 00 — Prompt for AI Coder

You are building **Smail Store** — a DTC branded e-commerce store for Moroccan men selling premium clothing. COD only. High-ticket positioning. All copy in Moroccan Darija (Arabic script).

Read ALL files in the `docs/` folder and the `.env.example` file before starting. They contain complete specifications.

## Architecture Summary

| Component | Tech |
|-----------|------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| State | Zustand (cart in localStorage) |
| Backend | Python FastAPI + SQLAlchemy 2.0 (async) + Alembic |
| Database | PostgreSQL 15+ (database name: `smailstore`) |
| Deployment | Docker Compose on Easypanel |
| Domain | smailstore.shop (frontend), api.smailstore.shop (backend) |

## What to Build

### Frontend (`/frontend`)

Initialize a Next.js 14 project with TypeScript and Tailwind CSS. Pages:

1. **Layout** (`app/layout.tsx`) — RTL layout, Arabic fonts (Tajawal + Poppins + Inter via next/font), global provider setup
2. **Home** (`app/page.tsx`) — Hero + featured products grid + trust badges + footer
3. **Product page** (`app/product/[id]/page.tsx`) — Full product landing: images, name, price, size selector, add-to-cart, reviews
4. **Collections** (`app/collections/[slug]/page.tsx`) — Product listing grid
5. **About** (`app/about/page.tsx`) — Brand story, trust building
6. **Contact** (`app/contact/page.tsx`) — Contact form
7. **Thank You** (`app/thank-you/page.tsx`) — Order confirmation + second-chance upsell

Components to build:
- `Header.tsx` — Fixed top, logo, cart icon with badge
- `Footer.tsx` — Dark bg, links, trust badges
- `CartDrawer.tsx` — Slides in from right, overlay, item list (use Zustand store), cross-sell strip, checkout CTA
- `CartItem.tsx` — Single cart item with qty controls
- `CheckoutModal.tsx` — Centered modal, name + phone fields, submit
- `UpsellTimer.tsx` — Full-screen overlay post-checkout, 10-15s countdown, 99 DH offer, accept/decline
- `ProductCard.tsx` — Image, name, price, size selector
- `CrossSellStrip.tsx` — Horizontal strip in cart drawer
- `TrustBadges.tsx` — Delivery, COD, returns badges
- `PhoneInput.tsx` — Moroccan phone input with +212, real-time validation (10 digits, 05/06/07)
- `SizeGuide.tsx` — Size selector buttons (S/M/L/XL)
- `Stars.tsx` — 5-star display component
- `OrderSummary.tsx` — Order totals display

### Backend (`/backend`)

Initialize a FastAPI project with SQLAlchemy async + Alembic.

Models:
- `Product` — id, name, slug, description, price, offer_price, has_offer, images[], sizes[], category, is_active, is_featured, is_upsell, rating, reviews_count, timestamps
- `Order` — id, order_number (SMA-YYYYNNN), customer_name, customer_phone, items (JSONB), total, upsell_accepted, upsell_product_id (FK), status, event_id (unique, for pixel dedup), client_ip, client_user_agent, timestamps

API endpoints:
- `GET /api/products` — List active products (exclude upsell products unless query param)
- `GET /api/products/{id}` — Single product
- `POST /api/orders` — Create order (see docs for exact processing order)

Services:
- `order_service.py` — Order creation logic, order number generation
- `sheets.py` — Fire-and-forget POST to Google Sheets webhook
- `capi/meta.py` — Facebook CAPI (SHA256 hashed em/ph, event_id dedup)
- `capi/tiktok.py` — TikTok Events API (SHA256 hashed email/phone with + prefix)
- `capi/snapchat.py` — Snapchat CAPI (SHA256 hashed em/ph, client_dedup_id)
- `hashing.py` — SHA256 hex digest utility
- Phone validation: strip non-digits, check length 10, starts with 05/06/07

### Database

- PostgreSQL 15+, database name `smailstore`
- Tables, indexes, and order number sequence as specified in `docs/06-database-schema.md`
- Seed script with sample products from `docs/11-product-content.md`

### Pixels

Web pixels (client-side, deferred, no hashing) in `lib/pixels.ts`:
- Facebook Pixel (fbq)
- TikTok Pixel (ttq)
- Snapchat Pixel (snaptr)

Server-side CAPI in backend services (SHA256 hashed):
- Facebook Conversions API
- TikTok Events API
- Snapchat Conversions API
- All use the same `event_id` for dedup

### Deployment

Create:
- `docker-compose.yml` — 3 services: frontend, backend, db (PostgreSQL)
- `frontend/Dockerfile` — Multi-stage build for Next.js
- `backend/Dockerfile` — Python slim image
- `.env.example` (root level — already provided)

## Design System

Colors: Primary black (#0A0A0A), Gold/Amber (#C8922E), white bg, surface gray (#F5F5F5).
Fonts: Poppins (headings), Inter (body), Tajawal (Arabic fallback) — all via next/font.
All text in Arabic script (Moroccan Darija).

## Key Business Rules

1. **Upsell** is the ONLY discount in the store. 99 DH fixed price. Only shown in post-checkout timer.
2. **Cross-sells** in cart drawer are at FULL PRICE.
3. **Checkout** only has 2 fields: name + phone. No address (COD collects it by call).
4. **Phone validation**: 10 digits, starts with 05/06/07, real-time.
5. **Cart drawer** replaces a cart page. Slides from right on ALL pages.
6. **upsell product** (`is_upsell = true`) is hidden from normal product listings.
7. **Order number format**: SMA-YYYYNNN (sequential per year).

## Copy (All in Arabic/Darija)

Key phrases:
- "إتمام الطلب" — Complete Order
- "تأكيد الطلب" — Confirm Order
- "المقفولة" — Cart (basket)
- "الدفع عند الإستلام" — Cash on Delivery
- "الرجاء إدخال رقم هاتف صحيح" — Please enter a valid phone number
- "تم تأكيد طلبك بنجاح" — Your order has been confirmed
- "سنتصل بك قريبا لتأكيد التوصيل" — We'll call you soon to confirm delivery
- "عرض خاص" — Special Offer
- "نعم، أريده ب 99 درهم" — Yes, I want it for 99 DH
- "لا شكرا" — No thanks
- "أكثر من 500 راجل واثق فينا" — 500+ men trust us
- "أعلى جودة ديال الستريوير فالمغرب" — Highest quality streetwear in Morocco

## Edge Cases to Handle

- If user refreshes during upsell timer: submit order without upsell, redirect to /thank-you
- Empty cart: show "المقفولة ديالك فاضية" with "تسوق الآن" button
- Phone input: strip spaces/dashes/whatever, validate 10 digits 05/06/07
- Upsell product cannot be added to cart via normal product listing (it's hidden)
- Cross-sell quantity: max 1 per cross-sell item (no quantity selector needed)

## Build Order

1. Initialize projects (Next.js + FastAPI)
2. Set up database models + Alembic + seed
3. Build backend API endpoints
4. Build frontend layout, components, pages
5. Implement cart (Zustand) + cart drawer
6. Implement checkout modal + phone validation
7. Implement upsell timer
8. Implement thank-you page
9. Implement pixels (web + CAPI services)
10. Implement Google Sheets webhook service
11. Create Docker files + docker-compose
12. Test full flow end-to-end

Do NOT build: payment gateway, user accounts/auth, admin dashboard, WhatsApp/SMS integration.

Build the complete project. Every file. Every component. Every API endpoint. Make it production-ready.
