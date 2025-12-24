"use client";

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export const PromoBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 lg:p-16">
        <div className="text-center md:text-left space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold border border-white/30">
            Limited Time Offer ⚡
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Up to 50% Off <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
              Selected Gear
            </span>
          </h2>
          <p className="text-lg md:text-xl text-orange-100 max-w-md mx-auto md:mx-0">
            Upgrade your equipment with our premium collection. Don't miss out on these exclusive deals.
          </p>
          <div className="pt-4">
            <Link 
              href="/search?q=promo" 
              className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Shop Now <FiArrowRight />
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex justify-center items-center relative">
          <div className="relative w-full max-w-sm aspect-square">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse" />
            {/* Placeholder for a shoe or gear image floating */}
            <div className="relative z-10 w-full h-full flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
               <span className="text-[150px]">👟</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
