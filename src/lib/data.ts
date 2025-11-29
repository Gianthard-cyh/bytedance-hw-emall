import Mock from 'mockjs'

export type Product = {
  id: number
  name: string
  price: number
  rating: number
  image: string
}

export type ProductDetail = {
  id: number
  title: string
  price: number
  images: string[]
  colors: string[]
  sizes: string[]
  stock: number
  desc: string
}

export async function fetchProductList(): Promise<Product[]> {
  const result = Mock.mock<{ list: Omit<Product, 'image'>[] }>({
    'list|100': [
      {
        'id|+1': 1,
        name: '@ctitle(5,10)',
        price: '@integer(1, 9999)',
        rating: '@float(1, 5, 1, 1)'
      }
    ]
  })
  return result.list.map((p) => ({
    ...p,
    image: `https://picsum.photos/seed/${p.id}/480/320`
  }))
}

export async function fetchProductDetail(id: number): Promise<ProductDetail> {
  const result = Mock.mock<ProductDetail>({
    id,
    title: '@ctitle(5,12)',
    price: '@integer(99, 2999)',
    'images|5': [() => `https://picsum.photos/seed/${id}-${Math.random().toString(36).slice(2)}/800/600`],
    colors: ['黑色', '蓝色', '红色'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: '@integer(0, 100)',
    desc: '@cparagraph(1,3)'
  })
  return result
}

export function deriveProductDetailFromProduct(product: Product): ProductDetail {
  const id = product.id
  const images = Array.from({ length: 5 }).map((_, i) => `https://picsum.photos/seed/${id}-${i}/800/600`)
  const stock = (id * 13) % 100
  const desc = `商品 ${id} 的详细介绍。名称：${product.name}。`
  return {
    id,
    title: product.name,
    price: product.price,
    images,
    colors: ['黑色', '蓝色', '红色'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock,
    desc,
  }
}

export function deriveProductDetail(id: number, base?: Product): ProductDetail {
  if (base) return deriveProductDetailFromProduct(base)
  const price = ((id * 97) % 2900) + 99
  const name = `商品标题 ${id}`
  return deriveProductDetailFromProduct({ id, name, price, rating: ((id * 23) % 50) / 10 + 0.5, image: `https://picsum.photos/seed/${id}/480/320` })
}
