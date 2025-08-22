// components/HeroSlider.tsx
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

// Impor CSS Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Impor data banner kita
import { bannerData } from "@/app/data/bannerData";

export const HeroSlider = () => {
  // State untuk melacak slide mana yang sedang aktif, untuk animasi konten
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-[400px] md:h-[500px] lg:h-[650px] hero-slider" // Beri kelas unik
        // Event ini akan berjalan setiap kali slide berganti
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {bannerData.map((banner, index) => {
          const isActive = index === activeIndex;

          return (
            <SwiperSlide key={banner.id}>
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0} // Prioritaskan gambar pertama
                  quality={90}
                  className="object-cover"
                />

                {/* Konten Teks di dalam "Content Box" */}
                <div className="absolute inset-0 flex items-center justify-start">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-lg p-8 rounded-lg bg-black/40 backdrop-blur-sm">
                      {/* Judul dengan Animasi */}
                      <h2
                        className={`text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg transition-all duration-700 ease-out ${
                          isActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                        }`}
                      >
                        {banner.title}
                      </h2>
                      {/* Subjudul dengan Animasi */}
                      <p
                        className={`mt-4 text-md md:text-lg text-slate-200 drop-shadow-lg transition-all duration-700 ease-out delay-150 ${
                          isActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                        }`}
                      >
                        {banner.subtitle}
                      </p>
                      {/* Tombol dengan Animasi */}
                      <div
                        className={`mt-8 transition-all duration-700 ease-out delay-300 ${
                          isActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-5"
                        }`}
                      >
                        <Link
                          href={banner.href}
                          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
                        >
                          Jelajahi Sekarang
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};