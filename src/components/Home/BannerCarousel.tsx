"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { getActiveBanners, Banner } from "@/components/lib/services/banner.service";

export const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const getLinkUrl = (banner: Banner) => {
    switch (banner.link_type) {
      case "product":
        return `/product/${banner.link_value}`;
      case "brand":
        return `/products/brand/${banner.link_value}`;
      case "category":
        return `/sports/${encodeURIComponent(banner.link_value)}`;
      default:
        return "#";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-[300px] md:h-[400px] lg:h-[500px] banner-carousel rounded-lg overflow-hidden"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {banners.map((banner, index) => {
          const isActive = index === activeIndex;
          const linkUrl = getLinkUrl(banner);

          return (
            <SwiperSlide key={banner.id}>
              <Link href={linkUrl} className="relative w-full h-full block">
                <div className="relative w-full h-full">
                  {banner.image_url ? (
                    <Image
                      src={banner.image_url}
                      alt={banner.title || "Banner promosi"}
                      fill
                      priority={index === 0}
                      quality={90}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {banner.title || "Promo"}
                      </span>
                    </div>
                  )}

                  {banner.title && (
                    <div className="absolute inset-0 flex items-center justify-start">
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-lg p-6 md:p-8 rounded-lg bg-black/40 backdrop-blur-sm">
                          <h2
                            className={`text-2xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg transition-all duration-700 ease-out ${
                              isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-5"
                            }`}
                          >
                            {banner.title}
                          </h2>
                          <div
                            className={`mt-6 transition-all duration-700 ease-out delay-200 ${
                              isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-5"
                            }`}
                          >
                            <span className="inline-block px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition">
                              Lihat Sekarang
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
