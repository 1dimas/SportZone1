"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
      <div className="w-full h-[300px] md:h-[450px] lg:h-[550px] bg-gradient-to-r from-orange-100 to-orange-50 animate-pulse rounded-2xl" />
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
        pagination={{ 
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !w-3 !h-3 !bg-white/50 !opacity-100',
          bulletActiveClass: '!bg-orange-500 !w-8 !rounded-full'
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-[300px] md:h-[450px] lg:h-[550px] banner-carousel rounded-2xl overflow-hidden shadow-2xl"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {banners.map((banner, index) => {
          const isActive = index === activeIndex;
          const linkUrl = getLinkUrl(banner);

          return (
            <SwiperSlide key={banner.id}>
              <Link href={linkUrl} className="relative w-full h-full block group">
                <div className="relative w-full h-full">
                  {/* Background Image */}
                  {banner.image_url ? (
                    <Image
                      src={banner.image_url}
                      alt={banner.title || "Banner promosi"}
                      fill
                      priority={index === 0}
                      quality={90}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {banner.title || "Promo"}
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                  {/* Content */}
                  {banner.title && (
                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="max-w-xl">
                          {/* Title */}
                          <h2
                            className={`text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg transition-all duration-700 ease-out ${
                              isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                          >
                            {banner.title}
                          </h2>

                          {/* CTA Button */}
                          <div
                            className={`mt-8 transition-all duration-700 ease-out delay-100 ${
                              isActive
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                            }`}
                          >
                            <span className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group-hover:gap-4">
                              Lihat Sekarang
                              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-20">
                    <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full" />
                    <div className="absolute bottom-20 right-32 w-20 h-20 border-4 border-white rounded-full" />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
