import { create } from 'zustand'
import { fetchProductList, type Product } from '@/lib/data'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

type ProductsState = {
  products: Product[]
  status: LoadStatus
  loadProducts: () => Promise<void>
  getProductById: (id: number) => Product | undefined
  getRecommendations: (id: number) => Product[]
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  status: 'idle',
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
      return {
        id: id + i + 1,
        name: `推荐商品 ${i + 1}`,
        price,
        rating,
        image: `https://picsum.photos/seed/${id}-rec-${i}/480/360`,
      }
    })
  },
}))

