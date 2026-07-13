# 07 — CRO & Order Flow

## Conversion Funnel

```
Home Page Visit
     │
     ▼  (loss: bounce)
Product View
     │
     ▼  (loss: no add-to-cart)
Add to Cart
     │
     ▼  (loss: abandon cart)
Open Checkout
     │
     ▼  (loss: abandon checkout)
Name + Phone Submitted
     │
     ▼
Upsell Timer (10-15s)
     ├── Accept Upsell (99 DH)
     │       └── Submit Order + Upsell
     └── Decline / Timeout
             └── Submit Order Only
```

## CRO Tactics

### Trust Builders (Every page)
- Trust badges below header or above footer
- "كثر من 500 راجل واثق فينا" social proof
- Real-time review stars on product cards
- COD badge — "الدفع عند الإستلام"

### Friction Reducers
- No account creation — order as guest
- No address at checkout — only phone (COD handles this)
- No payment form
- Cart accessible from one tap on any page
- Mobile-first, fast loading (deferred pixels)

### Urgency & Scarcity
- Upsell timer after checkout (only discount in the entire store)
- Timer must show real seconds ticking — creates psychological commitment
- "عرض خاص لطلبك الأول" (Special offer for your first order)
- Context-aware upsell: show the upsell product based on what's in cart

### Cart Abandonment Prevention
- Cart drawer with cross-sells at full price
- Total always visible
- "إتمام الطلب" is prominent, contrasting color

### Checkout Optimization
- Only 2 fields: name + phone
- Real-time phone validation
- Large touch targets (mobile)
- Submit button says "تأكيد الطلب" (Confirm Order)

## Phone Validation Logic

```
Input: "0612-34-56-78" or "0612345678" or "+212 612-345678"

1. Strip all non-digit characters
2. Check length == 10
3. Check starts with "05", "06", or "07"
4. If valid, store as "0612345678" (10 digits, no prefix)
5. If invalid, show error: "الرجاء إدخال رقم هاتف صحيح"
```

## Upsell Timer Logic

### States

1. **INITIAL** — Overlay appears after checkout submit
   - Order NOT yet sent to backend
   - Show: "عرض خاص! إضافة هاد المنتج ب 99 درهم فقط"
   - Product image
   - Timer: 10-15 seconds (randomized per session)

2. **ACCEPTED** — User clicks yes
   - Add upsell product to order items (99 DH)
   - Send POST /api/orders with upsell_accepted: true
   - Redirect to /thank-you

3. **DECLINED** — User clicks "لا شكرا"
   - Send POST /api/orders with upsell_accepted: false
   - Redirect to /thank-you

4. **TIMEOUT** — Timer reaches 0
   - Same as Declined — send order without upsell
   - Redirect to /thank-you

### Edge Cases
- If user refreshes during upsell: Remove upsell overlay, submit original order immediately, redirect to /thank-you (state stored in sessionStorage as "upsell_seen")
- If user closes browser and reopens: nothing — order not yet created
- Backend prevents 99 DH price from being used outside upsell flow

## Thank-You Page

- Order number prominently displayed
- ✅ "تم تأكيد طلبك بنجاح"
- "سنتصل بك قريبا لتأكيد التوصيل و العنوان"
- Second-chance cross-sell section (different from upsell, optional full-price products)
- Social share buttons (WhatsApp, Facebook Messenger)
