"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // tunggu sampai id ada
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Produk tidak ditemukan</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-80 h-80 object-cover rounded mt-4"
        />
      )}
      <p className="mt-4 text-lg">Harga: Rp {product.price.toLocaleString()}</p>
      {product.description && (
        <p className="mt-2 text-gray-700">{product.description}</p>
      )}
    </div>
  );
}
