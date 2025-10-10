// BAGIAN 0: WAJIB ADA UNTUK INTERAKTIVITAS
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  isNew?: boolean;
  description?: string;
  variants: ProductVariant[];
};

type ProductsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

// Fungsi format Rupiah
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// BAGIAN 1: KOMPONEN HALAMAN UTAMA
export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category from search params
  const category = typeof searchParams.category === 'string' ? searchParams.category : '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all products and filter by category if provided
        const allProducts = await getAllProduk();
        
        if (category) {
          const filteredProducts = allProducts.filter(
            product => product.category?.toLowerCase() === category.toLowerCase()
          );
          setProducts(filteredProducts);
        } else {
          setProducts(allProducts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Memuat produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <div>
          <h1>Error memuat produk.</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <h1>Tidak ada produk yang ditemukan.</h1>
      </div>
    );
  }

  // BAGIAN 2: TAMPILAN UI
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          {category ? `Produk dalam Kategori: ${category}` : 'Semua Produk'}
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const imageUrl = (product.gambar && product.gambar.length > 0) ? product.gambar[0] : "/products/kao.jpeg";
            return (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                className="rounded-lg bg-white p-4 shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={imageUrl}
                    alt={product.nama}
                    width={300}
                    height={300}
                    className="mb-4 h-48 w-full object-contain rounded"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">{product.nama}</h2>
                  <p className="mt-2 text-indigo-600 font-bold">{formatRupiah(product.harga)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}