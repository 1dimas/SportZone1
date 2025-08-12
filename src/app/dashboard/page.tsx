import Footer from '@/components/shop/Footer'
import Header from '@/components/shop/Header'
import ProductCard from '@/components/shop/ProductCard'

import productsData from '@/app/data/products'

const Page = () => {
  return (
    <div className="bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">New Arrivals</h1>
          <p className="mt-3 text-lg text-slate-600">Check out the latest and greatest in sports gear.</p>
        </div>
        
        {/* Grid Produk */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Looping data produk dan render ProductCard untuk setiap item */}
          {productsData.map((product) => (
            <ProductCard key = {product.id} product = {product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Page