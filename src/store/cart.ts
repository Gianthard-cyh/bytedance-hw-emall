import { create } from 'zustand'

export type CartItem = {
  pid: number
  size?: string
  color?: string
  qty: number
}

type CartState = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (pid: number, size?: string, color?: string) => void
  updateQty: (pid: number, size: string | undefined, color: string | undefined, qty: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart(item) {
    set((state) => {
      const idx = state.cart.findIndex(
        (it) => it.pid === item.pid && it.size === item.size && it.color === item.color
      )
      const next = [...state.cart]
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty }
      } else {
        next.push({ ...item, qty: Math.max(1, item.qty) })
      }
      return { cart: next }
    })
  },
  removeFromCart(pid, size, color) {
    set((state) => ({
      cart: state.cart.filter((it) => !(it.pid === pid && it.size === size && it.color === color)),
    }))
  },
  updateQty(pid, size, color, qty) {
    set((state) => ({
      cart: state.cart.map((it) =>
        it.pid === pid && it.size === size && it.color === color ? { ...it, qty } : it
      ),
    }))
  },
  clearCart() {
    set({ cart: [] })
  },
}))

