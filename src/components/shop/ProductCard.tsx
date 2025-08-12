"use client";

import Image from "next/image";
import { FC } from "react";

interface ProductCardProps {
    id :number;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductCard: FC<ProductCardProps> = ({ id, name, price, imageUrl }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ">
        <p >{id}</p>
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
        <p className="text-green-600 font-bold mt-2">Rp {price}</p>
        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300">
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
