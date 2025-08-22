// components/shop/ProductCard.tsx

"use client";

import Image from "next/image";
import { FC } from "react";


// 1. Buat tipe untuk objek produk itu sendiri
type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

// 2. Ubah definisi props untuk menerima satu objek 'product'
type ProductCardProps = {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  // 3. Destructure properti dari objek 'product' di dalam komponen
  const { id, name, price, imageUrl } = product;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
      {/* Anda bisa tetap menampilkan ID jika mau, atau menghapusnya */}
      <p className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">{id}</p>
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-900 font-bold mt-2">Rp {price.toLocaleString('id-ID')}</p>
        <button className="mt-3 w-full bg-orange-400 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors duration-300">
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;