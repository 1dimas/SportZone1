// app/components/PopularBrands.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getAllBrands } from "@/components/lib/services/brand.service";

type Brand = {
  id: string;
  nama: string;
  deskripsi?: string;
  logo?: string;
  created_at: string;
  updated_at: string;
};

export default function PopularBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const brandData = await getAllBrands();
        setBrands(Array.isArray(brandData) ? brandData : [brandData]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load brands");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="px-8 py-12">
        <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center border rounded-xl p-4 bg-white animate-pulse"
            >
              <div className="w-24 h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-8 py-12">
        <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
        <div className="text-center text-red-600">
          <p>Gagal memuat brand: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12">
      <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-center border rounded-xl p-4 bg-white hover:shadow-lg transition"
          >
            <Image
              src={b.logo || "/brands/default.png"}
              alt={b.nama}
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
