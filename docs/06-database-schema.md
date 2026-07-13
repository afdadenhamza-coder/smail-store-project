# 06 — Database Schema

## Overview

PostgreSQL 15+ named `smailstore`.

## Tables

### `products`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, default gen_random_uuid() | |
| name | VARCHAR(255) | NOT NULL | Product name in Arabic |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | URL slug |
| description | TEXT | | Arabic description |
| price | DECIMAL(10,2) | NOT NULL | Full price in MAD |
| offer_price | DECIMAL(10,2) | | Discounted price (if has_offer) |
| has_offer | BOOLEAN | DEFAULT false | |
| images | TEXT[] | DEFAULT '{}' | Array of image URLs/paths |
| sizes | TEXT[] | DEFAULT '{"S","M","L","XL"}' | Available sizes |
| category | VARCHAR(100) | | e.g. "t-shirts", "hoodies" |
| is_active | BOOLEAN | DEFAULT true | |
| is_featured | BOOLEAN | DEFAULT false | Show on home page |
| is_upsell | BOOLEAN | DEFAULT false | If this is the upsell product |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | Average rating (0.0-5.0) |
| reviews_count | INTEGER | DEFAULT 0 | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### `orders`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, default gen_random_uuid() | |
| order_number | VARCHAR(20) | NOT NULL, UNIQUE | Format: SMA-YYYYNNN |
| customer_name | VARCHAR(255) | NOT NULL | |
| customer_phone | VARCHAR(20) | NOT NULL | Moroccan phone |
| items | JSONB | NOT NULL | Array of {product_id, name, size, qty, unit_price} |
| total | DECIMAL(10,2) | NOT NULL | |
| upsell_accepted | BOOLEAN | DEFAULT false | |
| upsell_product_id | UUID | FK -> products.id, nullable | |
| status | VARCHAR(20) | DEFAULT 'pending' | pending, confirmed, cancelled, delivered |
| event_id | VARCHAR(36) | NOT NULL, UNIQUE | UUID for pixel dedup |
| client_ip | VARCHAR(45) | | |
| client_user_agent | TEXT | | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### Indexes

```sql
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
```

## Order Number Generation

Format: `SMA-{YEAR}{SEQUENTIAL_3DIGIT}`

Example: `SMA-2024001`, `SMA-2024002`

Get using SQL: `SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, 9) AS INTEGER)), 0) + 1 FROM orders WHERE order_number LIKE 'SMA-2024%'`

## Upsell Product

One product in the `products` table where `is_upsell = true`. This product has a fixed price of 99.00 DH when sold through the upsell flow. The upsell product is shown exclusively in the post-checkout timer popup.
