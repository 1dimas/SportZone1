"use client";

import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import { type Product } from "@/app/data/products";

type ProductCardProps = {
  product: Product;
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, imageUrl } = product;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group w-64 sm:w-72">
      {/* Gambar Produk */}
      <div className="relative w-full h-60">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="100%"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Konten */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors truncate">
          {name}
        </h3>
        <p className="text-md text-gray-700 font-semibold mb-4">
          Rp{price.toLocaleString("id-ID")}
        </p>
        <Link
          href={`/product/${name}`}
          className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
