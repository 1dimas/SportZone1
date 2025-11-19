"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { getAllProduk } from "@/components/lib/services/produk.service";
import { getAverageRatingPublic } from "@/components/lib/services/rating.service";

// Define the type for API response product
type ProductVariant = {
  size: string | number;
  stock: number;
};

type APIProduct = {
  id: string;           // API returns string ID
  nama: string;         // API uses 'nama' instead of 'name'
  harga: number;        // API uses 'harga' instead of 'price'
  gambar: string[];     // API uses 'gambar' array instead of 'imageUrl'
  slug?: string;
  category?: string;
  subcategory?: string;
  isNew?: boolean;
  description?: string;
  variants: ProductVariant[];
  averageRating?: number;
};

const ProductCarousel = () => {
  const [products, setProducts] = React.useState<APIProduct[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProduk();
        const first10 = data.slice(0, 10);
        
        // Fetch rating untuk setiap produk secara paralel
        const productsWithRatings = await Promise.all(
          first10.map(async (product) => {
            try {
              const rating = await getAverageRatingPublic(product.id);
              return { ...product, averageRating: rating };
            } catch (error) {
              return { ...product, averageRating: 0 };
            }
          })
        );
        
        setProducts(productsWithRatings);
      } catch (error) {
        console.error("Error fetching products for carousel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <p>Memuat produk populer...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
