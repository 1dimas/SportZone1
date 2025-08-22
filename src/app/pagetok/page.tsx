'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiBell, FiStar, FiTruck } from 'react-icons/fi';
import { dummyProduct } from '@/app/data/dummyProduct';

export default function SportZoneHomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Data kategori olahraga
  const sportCategories = [
    { name: 'Sepatu Lari', icon: '👟', color: 'bg-blue-500', count: '150+ Produk' },
    { name: 'Sepatu Bola', icon: '⚽', color: 'bg-green-500', count: '80+ Produk' },
    { name: 'Fitness', icon: '💪', color: 'bg-red-500', count: '200+ Produk' },
    { name: 'Yoga', icon: '🧘', color: 'bg-purple-500', count: '120+ Produk' },
    { name: 'Basket', icon: '🏀', color: 'bg-orange-500', count: '90+ Produk' },
    { name: 'Tennis', icon: '🎾', color: 'bg-yellow-500', count: '60+ Produk' },
    { name: 'Bersepeda', icon: '🚴', color: 'bg-cyan-500', count: '70+ Produk' },
    { name: 'Golf', icon: '⛳', color: 'bg-emerald-500', count: '40+ Produk' },
  ];

  // Data banner promo olahraga
  const sportBanners = [
    '/banners/akane2.jpg',
    '/banners/jandt.jpeg',
    '/banners/yss.jpeg',
    '/banners/YU ZHONG.jpeg',
  ];

  // Data produk olahraga
  const sportProducts = [
    { ...dummyProduct, id: 1, category: 'Running', brand: 'Nike' },
    { ...dummyProduct, id: 2, name: 'Nike Air Max 270', price: 1500000, category: 'Running', brand: 'Nike' },
    { ...dummyProduct, id: 3, name: 'Adidas Ultraboost 22', price: 2200000, category: 'Running', brand: 'Adidas' },
    { ...dummyProduct, id: 4, name: 'Puma RS-X', price: 1200000, category: 'Running', brand: 'Puma' },
    { ...dummyProduct, id: 5, name: 'Nike Mercurial Vapor', price: 1800000, category: 'Football', brand: 'Nike' },
    { ...dummyProduct, id: 6, name: 'Adidas Predator Edge', price: 2500000, category: 'Football', brand: 'Adidas' },
    { ...dummyProduct, id: 7, name: 'Under Armour HOVR', price: 1600000, category: 'Running', brand: 'Under Armour' },
    { ...dummyProduct, id: 8, name: 'New Balance Fresh Foam', price: 1400000, category: 'Running', brand: 'New Balance' },
  ];

  // Data brand olahraga
  const sportBrands = [
    { name: 'Nike', logo: '/justdoit.jpg', discount: 'Up to 40%' },
    { name: 'Adidas', logo: '/justdoit.jpg', discount: 'Up to 35%' },
    { name: 'Puma', logo: '/justdoit.jpg', discount: 'Up to 30%' },
    { name: 'Under Armour', logo: '/justdoit.jpg', discount: 'Up to 25%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Header */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">SportZone</h1>
                  <p className="text-xs text-gray-500">Peralatan Olahraga Terlengkap</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-600">Seller Center</a>
                <a href="#" className="hover:text-blue-600">Mulai Jual</a>
                <a href="#" className="hover:text-blue-600">Download App</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiBell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiHeart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <FiShoppingCart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg">
                <FiUser className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Masuk</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari peralatan olahraga..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Cari
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Banner */}
        <div className="mb-8">
          <div className="relative h-80 bg-gradient-to-r from-blue-600 via-green-500 to-blue-700 rounded-xl overflow-hidden">
            <Image
              src={sportBanners[0]}
              alt="SportZone Hero"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-bold mb-3">SportZone</h2>
              <p className="text-xl mb-4">Temukan Peralatan Olahraga Terbaik untuk Performa Maksimal</p>
              <div className="flex items-center space-x-4">
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                  🚚 Gratis Ongkir
                </span>
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                  ⭐ 100% Original
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sport Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategori Olahraga</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sportCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center group cursor-pointer">
                <div className={`w-20 h-20 ${category.color} rounded-full flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Flash Sale */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Flash Sale Olahraga</h2>
            <div className="flex items-center space-x-3 text-red-600">
              <span className="text-sm font-medium">Berakhir dalam:</span>
              <div className="bg-red-600 text-white px-3 py-2 rounded-lg text-lg font-bold">02:45:30</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sportProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                <div className="relative mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -{product.discountPercentage}%
                  </div>
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {product.brand}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg font-bold text-red-600">
                    Rp {(product.price * (1 - product.discountPercentage / 100)).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    Rp {product.price.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-3">75% terjual</p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Beli Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Promotions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Favorit</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sportBrands.map((brand, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center border border-gray-100">
                <div className="w-16 h-16 mx-auto mb-4">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <span className="text-sm text-red-600 font-medium">{brand.discount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Unggulan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sportProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
                <div className="relative mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                    <FiHeart className="w-4 h-4 text-gray-600" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {product.brand}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-gray-900">
                    Rp {product.price.toLocaleString()}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-red-600 font-medium">
                      -{product.discountPercentage}%
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <FiTruck className="w-3 h-3" />
                  <span>Gratis Ongkir</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Tambah ke Keranjang
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Banners */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl overflow-hidden">
              <Image
                src={sportBanners[1]}
                alt="Running Collection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-2">Running Collection</h3>
                <p className="text-sm">Sepatu lari terbaru untuk performa maksimal</p>
              </div>
            </div>
            <div className="relative h-48 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl overflow-hidden">
              <Image
                src={sportBanners[2]}
                alt="Football Gear"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-2">Football Gear</h3>
                <p className="text-sm">Peralatan sepak bola berkualitas tinggi</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <h3 className="font-bold text-gray-900">SportZone</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Platform terpercaya untuk peralatan olahraga berkualitas tinggi dengan harga terbaik.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Tentang SportZone</a></li>
                <li><a href="#" className="hover:text-blue-600">Karir</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog Olahraga</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Layanan</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">SportZone Care</a></li>
                <li><a href="#" className="hover:text-blue-600">Seller Center</a></li>
                <li><a href="#" className="hover:text-blue-600">Mitra Olahraga</a></li>
                <li><a href="#" className="hover:text-blue-600">Download App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Bantuan</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-blue-600">Kontak Kami</a></li>
                <li><a href="#" className="hover:text-blue-600">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-blue-600">Syarat & Ketentuan</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Ikuti Kami</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.875-1.418-2.026-1.418-3.323s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.323z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 SportZone. Peralatan Olahraga Terlengkap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
