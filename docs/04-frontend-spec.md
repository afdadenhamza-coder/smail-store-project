# 04 — Frontend Specification

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (cart state management)
- next/font (font loading)

## Routing

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero + featured products + trust badges |
| `/product/[id]` | Product | Single product landing page |
| `/collections/[slug]` | Collection | Category/product listing |
| `/about` | About | Brand story, social proof |
| `/contact` | Contact | Form + phone + address |
| `/thank-you` | Thank You | Order confirmation + second-chance upsell |

## Pages Detail

### Home Page (`/`)
- Hero section: large brand image/headline + "تسوق الآن" CTA
- Featured products grid (2 cols mobile, 4 cols desktop)
- Trust badges row
- "الأنواع الأكثر مبيعا" section
- Footer

### Product Page (`/product/[id]`)
- Product image (main + thumbnails)
- Product name
- Price (in DH)
- Size selector (S/M/L/XL)
- "أضف إلى المقفولة" (Add to cart) button
- Description
- Reviews/stars section

### Thank You Page (`/thank-you`)
- Confirmation message
- Order number
- "سنتصل بك لتأكيد الطلب"

## Cart (Zustand Store)

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
}
```

## Pixels (Web)

In `lib/pixels.ts`:

```typescript
// Facebook Pixel
export const fbPixel = (event: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  const fbq = (window as any).fbq;
  if (fbq) fbq('track', event, data);
};

// TikTok Pixel
export const ttPixel = (event: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  const ttq = (window as any).ttq;
  if (ttq) ttq.track(event, data);
};

// Snapchat Pixel
export const snapPixel = (event: string, data?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  const snaptr = (window as any).snaptr;
  if (snaptr) snaptr('track', event, data);
};
```

Web pixels fire: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`.
No hashing on client-side. `event_id` generated server-side and passed to both web pixel + backend CAPI.

## Key Behaviors

- All pages have cart drawer — clicking cart icon opens it
- Add to cart → cart drawer opens automatically
- "إتمام الطلب" in cart → checkout modal opens
- On checkout submit → upsell timer (10-15s) — this is a client-side overlay
- Upsell accept → add upsell item + submit real order to backend
- Upsell decline / timeout → submit order without upsell → redirect to /thank-you
- Cross-sell items shown in cart drawer at full price (no discount)

## Checkout Submit Flow (Frontend)

1. User fills name + phone in checkout modal
2. Clicks "تأكيد الطلب"
3. Frontend generates `event_id` (uuid)
4. Fires `InitiateCheckout` pixel event
5. Shows upsell overlay (10-15s timer)
6. If accepted: add upsell item (99 DH) to cart, then call POST /api/orders
7. If declined/timeout: call POST /api/orders (without upsell)
8. Fire `Purchase` pixel event with `event_id`
9. Redirect to /thank-you

## Edge Cases

- Phone validation: exact 10 digits starting with 05, 06, or 07 (after removing spaces/separators)
- If upsell timer page is refreshed: submit original order, do NOT show upsell again
- Cart persists in localStorage via Zustand
- Empty cart drawer shows "المقفولة ديالك فاضية" with a "تسوق الآن" button
