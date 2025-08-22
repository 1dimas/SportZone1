// app/product/[slug]/page.tsx
import Header from '@/components/Detailpage/header';
import Footer from '@/components/Detailpage/Footer';
import { Breadcrumbs } from '@/components/Detailpage/Breadcrumbs';
import { ProductImageGallery } from '@/components/Detailpage/ProductImageGallery';
import { ProductActions } from '@/components/Detailpage/ProductActions';
import { dummyProduct } from '@/app/data/dummyProduct';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Nanti, ganti ini dengan data asli dari Prisma
  const product = dummyProduct;

  // Siapkan data untuk Breadcrumbs
  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: 'Produk', href: '/products' },
    { name: product.category, href: `/kategori/${product.category.toLowerCase()}` },
    { name: product.name, href: `/product/${product.slug}` },
  ];

  return (
    <>
      <Header/>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image Gallery */}
            <div className="space-y-4">
              <ProductImageGallery images={product.images} />
            </div>
            
            {/* Product Info & Actions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    Rp {product.price.toLocaleString()}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        ({product.rating}) - {product.reviewCount} ulasan
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-500">Kategori:</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>
              </div>
              
              {/* Product Actions */}
              <ProductActions product={product} />
              
              {/* Additional Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Spesifikasi Produk
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key}:</strong> {value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Description Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Deskripsi Produk
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="simple" />
    </>
  );
}