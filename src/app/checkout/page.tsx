"use client";

import { useCart } from "@/context/cart-context";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCheck, FiMapPin, FiUser, FiCreditCard } from "react-icons/fi";

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod", // cod = Cash on Delivery
  });

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Keranjang Anda Kosong</h2>
              <p className="text-gray-500 mb-6">Tambahkan beberapa produk ke keranjang Anda sebelum checkout.</p>
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

  const total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.1;
  const shipping = 0; // Free shipping
  const grandTotal = total + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      alert('Mohon lengkapi semua informasi pengiriman');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });
      setIsProcessing(false);
      alert('Pesanan Anda telah diterima! Terima kasih telah berbelanja di SportZone.');
      router.push('/'); // Redirect to homepage
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiUser className="mr-2" /> Informasi Pengiriman
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Nama lengkap Anda"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="email@contoh.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telepon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Nomor telepon Anda"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Kota
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Kota Anda"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Alamat lengkap Anda"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Kode pos"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiCreditCard className="mr-2" /> Metode Pembayaran
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">Cash on Delivery (COD)</span>
                      </label>
                      
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="transfer"
                          checked={formData.paymentMethod === "transfer"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">Transfer Bank</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Memproses...' : `Bayar ${formatRupiah(grandTotal)}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="mr-2" /> Ringkasan Pesanan
                </h2>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-500">Ukuran: {item.size}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatRupiah(total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pengiriman</span>
                    <span className="font-medium">{formatRupiah(shipping)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak</span>
                    <span className="font-medium">{formatRupiah(tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}