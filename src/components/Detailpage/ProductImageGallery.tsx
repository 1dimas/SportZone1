// components/product/ProductImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

// Impor Swiper & modulnya
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper/types';

// Impor CSS Swiper
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

type Props = {
  images: string[];
};

export const ProductImageGallery: React.FC<Props> = ({ images }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);

  return (
    <div className="w-full">
      {/* Slider Utama */}
      <Swiper
        modules={[FreeMode, Navigation, Thumbs]}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="rounded-lg shadow-lg"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-square">
              <Image src={src} alt={`Product image ${index + 1}`} fill className="object-cover"/>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slider Thumbnail */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[FreeMode, Navigation, Thumbs]}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        className="mt-4 thumbs-slider"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-blue-500">
             <div className="relative w-full aspect-square">
              <Image src={src} alt={`Product thumbnail ${index + 1}`} fill className="object-cover"/>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};