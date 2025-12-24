"use client";

import Link from 'next/link';

const categories = [
  { name: 'Sepatu', icon: '👟', href: '/search?q=sepatu', color: 'from-orange-400 to-red-500' },
  { name: 'Jersey', icon: '👕', href: '/search?q=jersey', color: 'from-blue-400 to-blue-600' },
  { name: 'Bola', icon: '⚽', href: '/search?q=bola', color: 'from-green-400 to-emerald-600' },
  { name: 'Raket', icon: '🏸', href: '/search?q=raket', color: 'from-purple-400 to-indigo-600' },
  { name: 'Tas', icon: '🎒', href: '/search?q=tas', color: 'from-yellow-400 to-orange-500' },
  { name: 'Aksesoris', icon: '🧢', href: '/search?q=aksesoris', color: 'from-pink-400 to-rose-600' },
];

export const CategorySection = () => {
  return (
    <div className="bg-white">
      <div className="flex justify-between items-end mb-8 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Find exactly what you need for your game.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 px-4 sm:px-0">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={cat.href}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              {cat.icon}
            </div>
            <span className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
