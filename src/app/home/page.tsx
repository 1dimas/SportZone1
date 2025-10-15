"use client"

import React from "react";
import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import ProductCard from "@/components/Home/ProductCard";
import { HeroSlider } from "@/components/Home/Heroslider";
import PopularBrands from "@/components/Home/PopularBrands";
import ProductCarousel from "@/components/Home/ProductCarousel";
import { getAllProduk } from "@/components/lib/services/produk.service";

// Define the type for API response product
type ProductVariant = {
  size: string | number;
  stock: number;
};

type APIProduct = {
  id: string;           // API returns string ID
  nama: string;         // API uses 'nama' instead of 'name'
  harga: number;        // API uses 'harga' instead of 'price'
  gambar: string[];     // API uses 'gambar' array instead of 'imageUrl'
  slug?: string;
  category?: string;
  subcategory?: string;
  brand?: {
    nama: string;
  };
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

  return (
    <div className="bg-gray-50" id="homepage">
      <Header />
      <HeroSlider />

      <main className="container mx-auto px-4 py-16">
        {/* Popular Brands */}
        <PopularBrands onBrandSelect={setSelectedBrand} />

        {/* Rekomendasi Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {selectedBrand ? `Produk dari ${selectedBrand}` : "Rekomendasi Untuk Anda"}
            </h2>
            {selectedBrand && (
              <button
                onClick={() => setSelectedBrand(null)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕ Reset
              </button>
            )}
          </div>
          {loading && <p>Memuat data produk...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products
                .filter(product => !selectedBrand || product.brand?.nama === selectedBrand)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          )}
        </section>

        {/* Carousel Produk */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Produk Populer</h2>
          <ProductCarousel />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
