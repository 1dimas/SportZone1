"use client";

import { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

// Define the type for wishlist items
type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load wishlist items from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
    setLoading(false);
  }, []);

  // Function to remove item from wishlist
  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // Function to add to cart
  const addToCart = (item: WishlistItem) => {
    alert(`${item.name} telah ditambahkan ke keranjang!`);
    // In a real application, you would dispatch an action to add the item to the cart
    // For now, we'll just remove it from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <p>Memuat wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Wishlist</h1>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FiHeart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Wishlist Anda Kosong</h2>
              <p className="text-gray-500 mb-6">Tambahkan produk-produk favorit Anda ke wishlist sekarang!</p>
              <button
                onClick={() => router.push('/')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Belanja Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Wishlist</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-contain p-4 bg-gray-50"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    aria-label="Hapus dari wishlist"
                  >
                    <FiX className="text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">{new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(item.price)}</p>
                  
                  <div className="flex mt-4 space-x-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <FiShoppingCart className="mr-2" />
                      <span>Ke Keranjang</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}