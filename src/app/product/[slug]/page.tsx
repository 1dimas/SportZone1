// app/product/[slug]/page.tsx
import { notFound } from 'next/navigation'; 
import { prisma } from '@/components/lib/prisma';
import Header from '@/components/Detailpage/header';
import Footer from '@/components/Detailpage/Footer';
import { Breadcrumbs } from '@/components/Detailpage/Breadcrumbs';
import { ProductImageGallery } from '@/components/Detailpage/ProductImageGallery';
import { ProductActions } from '@/components/Detailpage/ProductActions';
import { FaStar } from 'react-icons/fa';


// Kita buat fungsi fetch data yang terpisah dan aman
async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug },
    });
    return product;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Kita asumsikan gambar-gambar tambahan ada di database dengan format tertentu
  // Untuk sekarang, kita buat array dummy dari imageUrl utama
  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];
  // Kita buat data dummy untuk size juga
  const productWithOptions = { ...product, sizes: [40, 41, 42, 43, 44] };

  const breadcrumbItems = [
    { name: 'Home', href: '/' },
    { name: product.category, href: `/kategori/${product.category.toLowerCase()}` },
    { name: product.name, href: `/product/${product.slug}` },
  ];

  const discountedPrice = product.discountPercentage ? product.price * (1 - product.discountPercentage / 100) : null;

  return (
    <>
      <Header>
        <Breadcrumbs items={breadcrumbItems} />
      </Header>
      
      <main>
        <div className="container mx-auto px-4 py-12">
          {/* Layout Utama: Grid 2 Kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* KOLOM KIRI: Galeri Gambar */}
            <div className="w-full sticky top-28">
              <ProductImageGallery images={productImages} />
            </div>

            {/* KOLOM KANAN: Informasi & Aksi */}
            <div className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">{product.category}</span>
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-2">
                <FaStar className="text-amber-400" />
                <span className="font-semibold text-slate-700">{product.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-slate-400">({product.reviewCount || 0} ulasan)</span>
              </div>

              <div className="my-2">
                {discountedPrice ? (
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-red-600">Rp {discountedPrice.toLocaleString('id-ID')}</p>
                    <p className="text-xl text-gray-500 line-through">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</p>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed">
                {/* Ganti dengan deskripsi produk dari database */}
                Ini adalah deskripsi produk. Anda bisa menambahkan field  di model Prisma Anda untuk menampilkan teks yang lebih panjang dan informatif di sini.
              </p>
              
              <div className="w-full border-t my-4"></div>

              {/* Komponen interaktif untuk memilih ukuran, jumlah, dan tombol beli */}
              <ProductActions product={productWithOptions} />
            </div>
          </div>
        </div>

        {/* Section Tambahan: Produk Serupa */}
        <div className="mt-16">
          {/* Komponen ini akan mengambil datanya sendiri */}
          
        </div>
      </main>
      
      <Footer variant="simple" />
    </>
  );
}