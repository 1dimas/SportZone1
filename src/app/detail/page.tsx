"use client";

import Image from "next/image";
import { type Product } from "@/app/data/products";

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gambar */}
      <div className="relative w-full h-96">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Info Produk */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="text-gray-700">{product.description}</p>

        <div className="flex items-center gap-3">
  <span className="text-xl font-semibold text-red-600">
    Rp{product.price.toLocaleString("id-ID")}
  </span>
</div>


        <p className="text-sm text-gray-600">
          Stok: <span className="font-medium">{product.stock}</span> | Terjual:{" "}
          <span className="font-medium">{product.sold}</span>
        </p>

        <div className="flex gap-4 mt-4">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Tambah ke Keranjang
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
