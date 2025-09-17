"use client";

import ProductCard from "./ProductCard";
import products from "@/app/data/products";

import { type Product } from "@/app/data/products";

const ProductCarousel = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.slice(0, 10).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
