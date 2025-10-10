"use client";

import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products") // ambil dari API route yang kita bikin
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow">
            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover rounded" />
            )}
            <h2 className="font-semibold mt-2">{p.name}</h2>
            <p className="text-gray-600">Rp {p.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
