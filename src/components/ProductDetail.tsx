"use client";

import Image from "next/image";


export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={400}
        className="rounded-lg"
      />
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-red-600 font-bold mt-4">
        Rp{product.price.toLocaleString("id-ID")}
      </p>
    </div>
  );
}
