# 12 — Cross-Sell Specification

## Cross-Sell in Cart Drawer

When the cart drawer is open and has items, show a horizontal strip at the bottom (above the checkout button) with 2-3 cross-sell products.

### Behavior

- Cross-sell items are at FULL PRICE (no discount)
- Each cross-sell is a small card with: image thumbnail, product name, price, and "أضف" (Add) button
- Clicking "أضف" adds the item to the cart and keeps the drawer open
- Cross-sell products are defined per-product in the database or a fixed set

### Cross-Sell vs Upsell

| Feature | Cross-Sell | Upsell |
|---------|------------|--------|
| Where | Cart drawer | Post-checkout timer popup |
| Price | Full price | 99 DH only |
| Discount | None | The ONLY discount in store |
| Timing | Before checkout | After checkout submit |
| Products | 2-3 related items | 1 specific upsell product |

### Implementation

In the cart drawer component, after the item list and before the checkout button:

```tsx
<div className="border-t mt-4 pt-4">
  <p className="text-sm font-medium mb-2">إضافة مع طلبك:</p>
  <div className="flex gap-3 overflow-x-auto">
    {crossSellProducts.map(product => (
      <div key={product.id} className="flex-shrink-0 w-28">
        <Image src={product.image} alt={product.name} width={80} height={80} />
        <p className="text-xs mt-1">{product.name}</p>
        <p className="text-xs font-bold">{product.price} DH</p>
        <button onClick={() => addItem(product)} className="text-xs text-gold">+ أضف</button>
      </div>
    ))}
  </div>
</div>
```
