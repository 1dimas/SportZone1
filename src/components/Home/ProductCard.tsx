// components/Home/ProductCard.tsx

"use client";

import Image from "next/image";
import { FC } from "react";
import Link from "next/link";

// 1. Buat tipe untuk objek produk itu sendiri
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  isNew?: boolean;
}

// 2. Ubah definisi props untuk menerima satu objek 'product'
type ProductCardProps = {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  // 3. Destructure properti dari objek 'product' di dalam komponen
  const { id, name, price, oldPrice, imageUrl, isNew } = product;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group w-80">
      <div className="relative">
        <div className="relative w-full h-60">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {isNew && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            BARU
          </div>
        )}
        {oldPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            SALE
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-xl font-bold text-gray-900">Rp {price.toLocaleString('id-ID')}</p>
          {oldPrice && (
            <p className="text-lg text-gray-500 line-through">Rp {oldPrice.toLocaleString('id-ID')}</p>
          )}
        </div>
        <Link 
          href={`/product/${id}`}
          className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;