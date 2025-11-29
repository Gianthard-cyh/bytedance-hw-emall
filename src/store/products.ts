import { create } from 'zustand'
import { fetchProductList, type Product } from '@/lib/data'
import type { CartItem } from '@/store/cart'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

type ProductsState = {
  products: Product[]
  status: LoadStatus
  loadProducts: () => Promise<void>
  getProductById: (id: number) => Product | undefined
  getRecommendations: (id: number) => Product[]
  filters: { classes: string[]; price?: { min: number; max: number } }
  setFilters: (f: { classes: string[]; price?: { min: number; max: number } }) => void
  clearFilters: () => void
  applyCheckout: (items: CartItem[]) => { ok: true } | { ok: false; failures: Array<{ pid: number; need: number; left: number }> }
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  status: 'idle',
  filters: { classes: [] },
  async loadProducts() {
    if (get().status === 'loading') return
    set({ status: 'loading' })
    try {
      const list = await fetchProductList()
      set({ products: list, status: 'ready' })
    } catch {
      set({ status: 'error' })
    }
  },
  getProductById(id) {
    return get().products.find((p) => p.id === id)
  },
  getRecommendations(id) {
    const count = 6
    return Array.from({ length: count }).map((_, i) => {
      const base = id * 97 + i * 31
      const price = (base % 2000) + 99
      const rating = Math.round(((base % 40) / 10 + 1) * 10) / 10
      const rid = id + i + 1
      const catIdx = rid % 3
      const category: Product['category'] = catIdx === 0 ? 'phone' : catIdx === 1 ? 'computer' : 'tablet'
      return {
        id: rid,
        name: `推荐商品 ${i + 1}`,
        price,
        rating,
        image: `https://picsum.photos/seed/${id}-rec-${i}/480/360`,
        category,
        images: Array.from({ length: 5 }).map((_, k) => `https://picsum.photos/seed/${rid}-${k}/800/600`),
        colors: ['黑色', '蓝色', '红色'],
        sizes: ['S', 'M', 'L', 'XL'],
        stock: (rid * 13) % 100,
        desc: `这是一段关于 推荐商品 ${i + 1} 的详细介绍。`,
      }
    })
  },
  setFilters(f) {
    set({ filters: f })
  },
  clearFilters() {
    set({ filters: { classes: [] } })
  },
  applyCheckout(items) {
    const prods = get().products
    const failures: Array<{ pid: number; need: number; left: number }> = []
    for (const it of items) {
      const p = prods.find((pp) => pp.id === it.pid)
      const left = p?.stock ?? 0
      if (!p || left < it.qty) {
        failures.push({ pid: it.pid, need: it.qty, left })
      }
    }
    if (failures.length) return { ok: false, failures }
    const next = prods.map((p) => {
      const total = items.filter((it) => it.pid === p.id).reduce((sum, it) => sum + it.qty, 0)
      return total > 0 ? { ...p, stock: Math.max(0, p.stock - total) } : p
    })
    set({ products: next })
    return { ok: true }
  },
}))

