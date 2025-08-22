import { Metadata } from 'next'
import { prisma } from '@/components/lib/prisma'
import ProductCard from '@/components/Home/ProductCard'
import fallbackProducts from '@/app/data/products'

export const metadata: Metadata = {
  title: 'Products | SportZone',
  description: 'Browse our latest products',
}

type CardProduct = {
  id: number
  name: string
  price: number
  imageUrl: string
}

async function getProducts(): Promise<CardProduct[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })

    if (!products || products.length === 0) {
      return fallbackProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl,
      }))
    }

    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
    }))
  } catch {
    return fallbackProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
    }))
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}



