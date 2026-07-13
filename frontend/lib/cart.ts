import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
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
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.id === item.id && i.size === item.size
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              { ...item, quantity: item.quantity || 1 } as CartItem,
            ],
          });
        }
      },
      removeItem: (id, size) => {
        set({ items: get().items.filter((i) => !(i.id === id && i.size === size)) });
      },
      updateQuantity: (id, size, qty) => {
        if (qty <= 0) {
          get().removeItem(id, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity: qty } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "smailstore-cart" }
  )
);
