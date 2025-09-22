// BAGIAN 0: WAJIB ADA UNTUK INTERAKTIVITAS
"use client";

import { useState } from "react";
import products from "@/app/data/products"; // Pastikan path ini benar
import { Product, ProductVariant } from "@/app/data/products"; // Import tipe baru
import Image from "next/image";

// Fungsi format Rupiah (tidak berubah)
const formatRupiah = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

type ProductPageProps = {
  params: { id: string };
};

// BAGIAN 1: KOMPONEN HALAMAN UTAMA
export default function ProductPage({ params }: ProductPageProps) {
  // --- Logika Pencarian Data (tidak berubah) ---
  const productId = Number(params.id);
  const product = products.find((p) => p.id === productId);

  // --- State untuk menyimpan ukuran yang dipilih ---
  // Defaultnya adalah varian pertama yang tersedia
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants.find(v => v.stock > 0) || product?.variants[0]
  );

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <h1>Produk dengan ID {params.id} tidak ditemukan.</h1>
      </div>
    );
  }
  
  // BAGIAN 2: TAMPILAN UI YANG SUDAH DIUPDATE
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 rounded-lg bg-white p-6 shadow-md md:grid-cols-2 md:p-8 lg:gap-16">
          {/* Kolom Gambar Produk */}
          <div className="flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="h-auto w-full max-w-md rounded-lg object-contain"
              priority
            />
          </div>

          {/* Kolom Detail & Aksi */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm font-medium text-indigo-600">
              Kategori: {product.category}
            </p>
            <div className="mt-4">
              <p className="text-3xl text-gray-800">{formatRupiah(product.price)}</p>
            </div>

            {/* --- BAGIAN BARU: PEMILIHAN UKURAN --- */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-800">Pilih Ukuran:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors 
                      ${variant.stock === 0 ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through' : ''}
                      ${selectedVariant?.size === variant.size ? 'border-transparent bg-indigo-600 text-white ring-2 ring-indigo-500' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800">Deskripsi</h3>
              <p className="mt-2 text-base text-gray-600">{product.description}</p>
            </div>

            {/* --- UPDATE TAMPILAN STOK --- */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700">
                Stok Ukuran {selectedVariant?.size}: 
                <span className={selectedVariant && selectedVariant.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {` ${selectedVariant?.stock || 0} Tersisa`}
                </span>
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}