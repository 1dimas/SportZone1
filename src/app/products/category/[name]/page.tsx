// BAGIAN 0: WAJIB ADA UNTUK INTERAKTIVITAS
"use client";

import products from "@/app/data/products"; // Pastikan path ini benar
import { Product } from "@/app/data/products"; // Import tipe produk
import Image from "next/image";

// Fungsi format Rupiah
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

type CategoryProductPageProps = {
  params: { name: string };
};

// BAGIAN 1: KOMPONEN HALAMAN UTAMA
export default function CategoryProductPage({ params }: CategoryProductPageProps) {
  // --- Ambil nama kategori dari URL ---
  const categoryName = decodeURIComponent(params.name).toLowerCase();

  // --- Filter produk berdasarkan kategori ---
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === categoryName
  );

  if (categoryProducts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <h1>Tidak ada produk dalam kategori {params.name}.</h1>
      </div>
    );
  }

  // BAGIAN 2: TAMPILAN UI
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Produk dalam Kategori: {params.name}
        </h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((product) => (
            <Link
              key={product.name}
              href={`/product/${encodeURIComponent(product.slug)}`}
              className="rounded-lg bg-white p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="mb-4 h-48 w-full object-contain rounded"
                />
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="mt-2 text-indigo-600 font-bold">{formatRupiah(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
