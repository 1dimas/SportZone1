"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

// Define types
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  // Simulate loading products
  useEffect(() => {
    // In a real app, this would come from an API
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Sepatu Running Nike Air Max",
        price: 1200000,
        image: "/products/running-shoe.jpg",
        category: "Sepatu",
        description: "Sepatu running nyaman dengan teknologi Air Max untuk kenyamanan maksimal saat berlari."
      },
      {
        id: "2",
        name: "Bola Basket Spalding",
        price: 350000,
        image: "/products/basketball.jpg",
        category: "Bola",
        description: "Bola basket berkualitas tinggi dari Spalding, cocok untuk latihan dan pertandingan."
      },
      {
        id: "3",
        name: "Raket Tenis Wilson",
        price: 850000,
        image: "/products/tennis-racket.jpg",
        category: "Raket",
        description: "Raket tenis profesional dengan teknologi terbaru untuk performa maksimal."
      },
      {
        id: "4",
        name: "Jersey Basket NBA",
        price: 450000,
        image: "/products/basketball-jersey.jpg",
        category: "Pakaian",
        description: "Jersey basket keren dengan desain modern dan bahan nyaman untuk berolahraga."
      },
      {
        id: "5",
        name: "Helm Sepeda Giant",
        price: 650000,
        image: "/products/cycling-helmet.jpg",
        category: "Aksesori",
        description: "Helm sepeda safety dengan sirkulasi udara yang baik dan desain aerodinamis."
      },
      {
        id: "6",
        name: "Yoga Mat Premium",
        price: 250000,
        image: "/products/yoga-mat.jpg",
        category: "Aksesori",
        description: "Matras yoga premium anti slip dengan ketebalan optimal untuk kenyamanan."
      }
    ];

    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  // Handle search from URL params
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      filterProducts(query);
    } else {
      setFilteredProducts(products);
    }
  }, [searchParams, products]);

  const filterProducts = (query: string) => {
    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProducts(searchQuery);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <p>Memuat produk...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Produk Kami</h1>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <FiSearch />
                <span>Cari</span>
              </button>
            </form>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="object-contain max-h-40"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(product.price)}
                        </p>
                      </div>
                      
                      <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Produk tidak ditemukan. Silakan coba kata kunci lain.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}