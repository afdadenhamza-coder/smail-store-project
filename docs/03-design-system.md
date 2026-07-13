# 03 — Design System

## Brand Colors

```
Primary (Black):         #0A0A0A
Primary Light:           #1A1A1A
Secondary (Gold/Amber):  #C8922E
Secondary Light:         #E8B84B
Background:              #FFFFFF
Surface:                 #F5F5F5
Text Primary:            #0A0A0A
Text Secondary:          #666666
Text Muted:              #999999
Error:                   #DC2626
Success:                 #16A34A
Border:                  #E5E5E5
```

## Typography

- **Headings**: Poppins (Bold 700) — Arabic fallback: Tajawal
- **Body**: Inter (Regular 400, Medium 500) — Arabic fallback: Tajawal
- **Arabic accent font**: Noto Naskh Arabic for decorative headings

Font loading: Use `next/font` — load Poppins, Inter, Tajawal at build time.

## Spacing (Tailwind defaults)

- Use Tailwind spacing scale. Page max-width: `max-w-7xl mx-auto`
- Product page: `py-8 px-4`

## Components & Their Designs

### Header
- Fixed top, white bg, z-50
- Logo left: "Smail Store" in bold
- Right: Cart icon with badge (item count)

### Footer
- Dark bg (#0A0A0A)
- "Smail Store" + tagline
- Links: Home, Collections, About, Contact
- Trust badges, social media icons

### Cart Drawer
- Slides in from right (fixed, z-40)
- Overlay backdrop (black 50% opacity)
- Close button top-left (X)
- List of items with image, name, size, Qty, price
- Cross-sell strip at bottom (2-3 items)
- "إتمام الطلب" (Complete Order) CTA at bottom
- Empty state: "المقفولة ديالك فاضية" (Your cart is empty)

### Product Card
- Square image (1:1 aspect ratio)
- Product name below (bold)
- Price in DH
- "اختيار المقاس" (Choose Size) below price
- Border line separator

### Size Selector
- S / M / L / XL buttons, outlined, selected state = filled black

### Checkout Modal
- Centered overlay modal
- "معلومات التوصيل" (Delivery info) heading
- Name input (placeholder: "الاسم الكامل")
- Phone input — Moroccan format with prefix +212
- "تأكيد الطلب" (Confirm Order) button
- Backdrop click = close (with warning if input filled)

### Phone Input
- Country code +212 select (disabled)
- 10-digit numeric input (05xx/06xx/07xx)
- Real-time validation on blur + on keyup
- Error state: red border + "الرجاء إدخال رقم هاتف صحيح"

### Trust Badges
- "التوصيل ف 3-5 أيام" (Delivery 3-5 days)
- "الدفع عند الإستلام" (Cash on delivery)
- "التبديل و الإرجاع" (Exchange & return)

### Stars Component
- 5 stars, gold (#C8922E) filled, gray (#E5E5E5) empty
- Number of reviews below

### Upsell Timer
- Full-screen overlay after checkout submit (not modal, full redirect or overlay)
- Shows product image + "عرض خاص" (Special Offer) badge
- Timer counting down from 10-15 seconds
- "نعم، أريده ب 99 درهم" (Yes, I want it for 99 DH) — big CTA
- "لا شكرا" (No thanks) small link at bottom
- After timer expires, auto-redirect to thank-you

### Thank-You Page
- "تم تأكيد طلبك! ✅" (Your order is confirmed)
- Order number
- "سنتصل بك قريبا لتأكيد التوصيل" (We will call you soon)
- Second-chance cross-sell section (optional)
