export type Product = {
  id: number
  name: string
  price: number
  rating: number
  image: string
  category: 'phone' | 'computer' | 'tablet'
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  desc: string
}

export async function fetchProductList(): Promise<Product[]> {
  const count = 100
  const list: Product[] = Array.from({ length: count }).map((_, i) => {
    const id = i + 1
    const name = `商品 ${id}`
    const price = ((id * 97) % 9900) + 100
    const rating = Math.round((((id * 23) % 40) / 10 + 1) * 10) / 10
    const image = `https://picsum.photos/seed/${id}/480/320`
    const catIdx = id % 3
    const category: Product['category'] = catIdx === 0 ? 'phone' : catIdx === 1 ? 'computer' : 'tablet'
    const images = Array.from({ length: 5 }).map((_, k) => `https://picsum.photos/seed/${id}-${k}/800/600`)
    const colors = ['黑色', '蓝色', '红色']
    const sizes = ['S', 'M', 'L', 'XL']
    const stock = (id * 13) % 100
    const desc = `这是一段关于 ${name} 的详细介绍。`
    return { id, name, price, rating, image, category, images, colors, sizes, stock, desc }
  })
  return list
}
