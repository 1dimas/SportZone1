"use client";

import React, { Suspense } from "react";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import ProductCard from "@/components/Home/ProductCard";
import { HeroSlider } from "@/components/Home/Heroslider";
import PopularBrands from "@/components/Home/PopularBrands";
import ProductCarousel from "@/components/Home/ProductCarousel";
import { HeroSliderSkeleton } from "@/components/Home/HeroSliderSkeleton";
import { PopularBrandsSkeleton } from "@/components/Home/PopularBrandsSkeleton";
import { ProductCarouselSkeleton } from "@/components/Home/ProductCarouselSkeleton";
import { ProductGridSkeleton } from "@/components/Home/ProductGridSkeleton";
import { getAllProduk, getTotalSoldByProduct } from "@/components/lib/services/produk.service";
import { getAverageRatingPublic } from "@/components/lib/services/rating.service";

type ProductVariant = {
  size: string | number;
  stock: number;
};

type APIProduct = {
  id: string;
  nama: string;
  harga: number;
  gambar: string[];
  slug?: string;
  category?: string;
  subcategory?: string;
  brand?: { nama: string };
  isNew?: boolean;
  description?: string;
  variants: ProductVariant[];
  averageRating?: number;
  totalSold?: number;
};

const Page = () => {
  const [products, setProducts] = React.useState<APIProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProduk();
        
        // Fetch rating dan total sold untuk setiap produk secara paralel
        const productsWithRatingsAndSold = await Promise.all(
          data.map(async (product) => {
            try {
              const [rating, totalSold] = await Promise.all([
                getAverageRatingPublic(product.id),
                getTotalSoldByProduct(product.id),
              ]);
              return { ...product, averageRating: rating, totalSold };
            } catch (error) {
              console.error(`Error fetching data for product ${product.id}:`, error);
              return { ...product, averageRating: 0, totalSold: 0 };
            }
          })
        );
        
        setProducts(productsWithRatingsAndSold);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat data produk");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedBrand
    ? products.filter((p) => p.brand?.nama === selectedBrand)
    : [];

  return (
    <div className="bg-white min-h-screen flex flex-col" id="homepage">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 mt-2">
        <Suspense fallback={<HeroSliderSkeleton />}>
          <HeroSlider />
        </Suspense>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-8">
        {/* Popular Brands */}
        <Suspense fallback={<PopularBrandsSkeleton />}>
          <PopularBrands onBrandSelect={setSelectedBrand} />
        </Suspense>

        {/* Produk Grid */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="text-gray-500 hover:text-gray-700 text-sm sm:text-base"
              >
                ✕ Hapus filter brand
              </button>
            )}
          </div>

          {/* Loading/Error */}
          {loading && (
            <ProductGridSkeleton />
          )}
          {error && <p className="text-center text-red-500 py-8">{error}</p>}

          {/* Produk Grid - hanya muncul setelah brand dipilih */}
          {!loading && !error && selectedBrand && (
            <div
              className="
                grid 
                grid-cols-2 
                sm:grid-cols-3 
                md:grid-cols-4 
                lg:grid-cols-5 
                xl:grid-cols-6 
                gap-x-3 gap-y-6 
                sm:gap-x-4 sm:gap-y-8
              "
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Jika brand dipilih tapi produk kosong */}
          {!loading && !error && selectedBrand && filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              Tidak ada produk untuk brand <b>{selectedBrand}</b>.
            </p>
          )}
        </section>

        {/* Rekomendasi Produk */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Rekomendasi Produk
          </h2>
          <Suspense fallback={<ProductCarouselSkeleton />}>
            <ProductCarousel />
          </Suspense>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;