// app/components/PopularBrands.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllBrands } from "@/components/lib/services/brand.service";
import { getProdukByBrand } from "@/components/lib/services/produk.service";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";

type Brand = {
  id: string;
  nama: string;
  deskripsi?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
};

type Product = {
  id: string;
  nama: string;
  harga: number;
  gambar: string[];
  slug?: string;
  category?: string;
  subcategory?: string;
  isNew?: boolean;
  description?: string;
  variants: any[];
};

export default function PopularBrands({ onBrandSelect }: { onBrandSelect?: (brandName: string) => void }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const brandData = await getAllBrands();
        setBrands(Array.isArray(brandData) ? brandData : [brandData]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = async (brand: Brand) => {
    if (onBrandSelect) {
      onBrandSelect(brand.nama);
    } else {
      setSelectedBrand(brand);
      try {
        const productData = await getProdukByBrand(brand.id);
        setProducts(Array.isArray(productData) ? productData : [productData]);
        setShowModal(true);
      } catch (err) {
        console.error("Failed to load products:", err);
        setProducts([]);
        setShowModal(true);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBrand(null);
    setProducts([]);
  };

  const handleProductClick = (product: Product) => {
    setShowModal(false);
    router.push(`/product/${product.slug || product.id}`);
  };

  if (loading) {
    return (
      <section className="px-8 py-12">
        <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center border rounded-xl p-4 bg-white animate-pulse"
            >
              <div className="w-24 h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-12">
        <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
        <div className="text-center text-red-600">
          <p>Gagal memuat brand: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12">
      <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-center border rounded-xl p-4 bg-white hover:shadow-lg transition cursor-pointer"
            onClick={() => handleBrandClick(b)}
          >
            <Image
              src={b.logo || "/brands/default.png"}
              alt={b.nama}
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Full Page Overlay for Products */}
      {showModal && selectedBrand && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Produk dari {selectedBrand.nama}</h1>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">Tidak ada produk tersedia</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
