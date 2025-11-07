"use client";

import React from "react";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import ProductCard from "@/components/Home/ProductCard";
import { HeroSlider } from "@/components/Home/Heroslider";
import PopularBrands from "@/components/Home/PopularBrands";
import ProductCarousel from "@/components/Home/ProductCarousel";
import { getAllProduk } from "@/components/lib/services/produk.service";

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
        setProducts(data);
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
        <HeroSlider />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-8">
        {/* Popular Brands */}
        <PopularBrands onBrandSelect={setSelectedBrand} />

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
            <p className="text-center text-gray-600 py-8 animate-pulse">
              Memuat produk...
            </p>
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

        {/* ===========================================================
          PERUBAHAN DI SINI: mt-16 diubah menjadi mt-8
          ===========================================================
        */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Rekomendasi Produk
          </h2>
          <ProductCarousel />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Page;