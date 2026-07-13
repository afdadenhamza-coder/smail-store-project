# 11 — Product Content

## Product Categories

1. **تيشيرتات** (T-Shirts)
2. **هوديات** (Hoodies)
3. **بناطل** (Pants/Joggers)
4. **جواكيط** (Jackets)

## Sample Products (Placeholder)

| Name (Arabic) | Category | Price (DH) | Offer Price | Slug |
|--------------|----------|-------------|-------------|------|
| تيشيرت كلاسيك أسود | t-shirts | 299 | 249 | t-shirt-classic-noir |
| تيشيرت أوفرサイズ أبيض | t-shirts | 349 | — | t-shirt-oversized-blanc |
| هودي بريميوم رمادي | hoodies | 599 | 499 | hoodie-premium-gris |
| هودي أوفرサイズ أسود | hoodies | 649 | — | hoodie-oversized-noir |
| بنطلون كارغو بيج | pants | 449 | 399 | pant-cargo-beige |
| جاكيت دينيم كلاسيك | jackets | 799 | — | jacket-denim-classic |

## Upsell Product

| Name | Price | Slug |
|------|-------|------|
| قبعة Smail بريميوم (Cap) | 99 (fixed upsell price) | cap-smail-premium |

The upsell product has `is_upsell = true` in DB. Its normal price field can be anything (e.g. 199 DH) but in the upsell flow it's always 99 DH. It is NOT shown in the normal product listing (filter by `is_upsell = false`).

## Product Data Source

For MVP, products are stored in the database and seeded via a migration or seed script. The frontend fetches from `GET /api/products`.

Each product has:
- Multiple images (at least 2-3)
- Available sizes: S, M, L, XL (or custom per product)
- Description in Darija Arabic
- Review count and rating (seeded with realistic numbers)

## Image Placeholders

Placeholder images go in `docs/images/` — use [https://placehold.co](https://placehold.co) for development:
```
https://placehold.co/600x600/0A0A0A/C8922E?text=Smail+Store
```
