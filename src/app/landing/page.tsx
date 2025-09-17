// app/page.tsx

import Header from "@/components/Landing/header";
import { ValueProps } from "@/components/Landing/ValueProps";
import { FeaturedCategories } from "@/components/Landing/FeaturedCategories";
import { HeroSlider } from "@/components/Landing/HeroSlider";

import Footer from "@/components/Landing/footer";
import { Testimonials } from "@/components/Landing/Testimonials";

// Halaman utama kita adalah Server Component.
// Tugasnya adalah menyusun layout dan memanggil komponen lain.
export default function HomePage() {
  return (
    <>
      <Header />
      
      
      {/* Bagian utama halaman */}
      
      <main className="bg-white">
        
        {/* Section 1: Banner Utama */}
        <HeroSlider />
        

        {/* Section 2: Keunggulan Toko */}
        <ValueProps  />
        
        {/* Section 3: Kategori Unggulan */}
        <FeaturedCategories />

         <Testimonials />

        {/* Section 4: Produk Terlaris (Komponen ini mengambil datanya sendiri dari server)
        <ProductCarousel /> */}

        {/* Anda bisa menambahkan section lain di sini, seperti Testimoni atau Brand Carousel */}
        
      </main>

      <Footer />
    </>
  );
}