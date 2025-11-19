"use client";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { FiStar } from "react-icons/fi";
import { formatRupiah } from "@/lib/utils";

type ProductVariant = {
  size: string | number;
  stock: number;
};

type Product = {
  id: string | number;
  nama?: string;
  name?: string;
  harga?: number;
  price?: number;
  gambar?: string[];
  imageUrl?: string;
  slug?: string;
  isNew?: boolean;
  description?: string;
  variants?: ProductVariant[];
  rating?: number; // 0–5
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const name = product.nama || product.name || "";
  const price = product.harga ?? product.price ?? 0;
  const imageUrl =
    product.gambar?.[0] || product.imageUrl || "/products/kao.jpeg";
  const isExternal =
    imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

  const rating = product.rating ?? 4.6;

  return (
    <Link
      href={`/product/${product.id}`}
      className="
        block 
        w-full 
        bg-white 
        rounded-md 
        border border-gray-200 
        overflow-hidden 
        hover:shadow-md 
        hover:-translate-y-1 
        transition-all 
        duration-300
        group
      "
    >
      {/* Gambar Produk */}
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="
            transition-transform 
            duration-500 
            group-hover:scale-105
            object-contain 
          " // DIREVISI: Menggunakan object-contain dan menghapus p-2
          unoptimized={isExternal}
        />

        {product.isNew && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
            Baru
          </span>
        )}
      </div>

      {/* Info Produk */}
      <div className="p-1.5">
        <h3
          className="
            text-xs 
            font-medium 
            text-gray-800 
            line-clamp-2 
            h-[32px]
          "
        >
          {name}
        </h3>

        <p className="mt-0.5 text-sm font-bold text-orange-500">
          {formatRupiah(price)}
        </p>

        <div className="mt-0.5 flex items-center text-[11px] text-gray-600">
          <FiStar className="text-yellow-400 mr-1 fill-yellow-400" size={12} />
          <span>{rating}</span>
          <span className="mx-1">•</span>
          <span>Terjual 100+</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;