"use client";

import Image from "next/image";
import { FC } from "react";
import Link from "next/link";

// Define the type for API response product
type ProductVariant = {
  size: string | number;
  stock: number;
};

type Product = {
  id: string | number;  // API likely returns string ID
  nama?: string;        // API uses 'nama' instead of 'name'
  name?: string;        // Fallback for static data
  harga?: number;       // API uses 'harga' instead of 'price'
  price?: number;       // Fallback for static data
  gambar?: string[];    // API uses 'gambar' array instead of 'imageUrl'
  imageUrl?: string;    // Fallback for static data
  slug?: string;
  category?: string;
  subcategory?: string;
  isNew?: boolean;
  description?: string;
  variants: ProductVariant[];
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const name = product.nama || product.name || "";
  const price = product.harga !== undefined ? product.harga : product.price || 0;
  const imageUrl = (product.gambar && product.gambar.length > 0) ? product.gambar[0] : product.imageUrl || "/products/kao.jpeg";
  
  // Check if the image URL is from an external domain
  const isExternal = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');

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
          unoptimized={isExternal} // Disable optimization for external images
        />
      </div>

      {/* Konten */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors truncate">
          {name}
        </h3>
        <p className="text-md text-gray-700 font-semibold mb-4">
          Rp{price ? price.toLocaleString("id-ID") : "0"}
        </p>
        <Link
          href={`/product/${product.slug || product.id}`}
          className="block text-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow hover:shadow-md"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
