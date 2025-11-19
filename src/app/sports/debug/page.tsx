"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import { getAllKategoriOlahraga } from "@/components/lib/services/olahraga.service";
import { getSubkategoriPeralatanByKategoriOlahraga } from "@/components/lib/services/subkategori-peralatan.service";
import { getProdukBySubkategori } from "@/components/lib/services/produk.service";

type KategoriOlahraga = {
  id: string;
  nama: string;
};

type SubkategoriPeralatan = {
  id: string;
  nama: string;
  kategori_olahraga_id: string;
};

type Produk = {
  id: string;
  nama: string;
  subkategori_id: string;
  stok: number;
  status: string;
};

type DebugData = {
  kategori: KategoriOlahraga;
  subkategories: {
    subkategori: SubkategoriPeralatan;
    products: Produk[];
  }[];
};

export default function DebugPage() {
  const [debugData, setDebugData] = useState<DebugData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const kategoriData = await getAllKategoriOlahraga() as KategoriOlahraga[];
        
        const allData: DebugData[] = [];
        
        for (const kategori of kategoriData) {
          const subkategoriData = await getSubkategoriPeralatanByKategoriOlahraga(kategori.id) as SubkategoriPeralatan[];
          
          const subkategoriesWithProducts = [];
          
          for (const subkategori of subkategoriData) {
            const products = await getProdukBySubkategori(subkategori.id) as Produk[];
            
            subkategoriesWithProducts.push({
              subkategori,
              products,
            });
          }
          
          allData.push({
            kategori,
            subkategories: subkategoriesWithProducts,
          });
        }
        
        setDebugData(allData);
      } catch (error) {
        console.error("Error fetching debug data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Debug - All Categories & Products</h1>
          
          {isLoading && (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading debug data...</p>
            </div>
          )}
          
          {!isLoading && debugData.map((data) => (
            <div key={data.kategori.id} className="mb-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">
                {data.kategori.nama}
              </h2>
              <p className="text-sm text-gray-500 mb-4">ID: {data.kategori.id}</p>
              
              {data.subkategories.length === 0 && (
                <p className="text-gray-500 italic">No subkategories</p>
              )}
              
              {data.subkategories.map((sub) => (
                <div key={sub.subkategori.id} className="ml-6 mb-4 border-l-4 border-blue-300 pl-4">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {sub.subkategori.nama}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Subkategori ID: {sub.subkategori.id}
                  </p>
                  <Link
                    href={`/sports/${data.kategori.nama.toLowerCase()}/${sub.subkategori.nama.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-blue-500 hover:underline mb-3 inline-block"
                  >
                    View Page →
                  </Link>
                  
                  {sub.products.length === 0 ? (
                    <p className="text-gray-400 italic text-sm">No products</p>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-semibold mb-2">
                        Products: {sub.products.length}
                      </p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-1">Nama</th>
                            <th className="text-left py-1">ID</th>
                            <th className="text-left py-1">Stok</th>
                            <th className="text-left py-1">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sub.products.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-1">{product.nama}</td>
                              <td className="py-1 text-gray-500 text-xs">{product.id}</td>
                              <td className="py-1">{product.stok}</td>
                              <td className="py-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  product.status === 'tersedia' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
