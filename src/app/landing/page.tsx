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
        <section className="py-12 md:py-20">
          <ValueProps />
        </section>
        
        {/* Section 3: Kategori Unggulan */}
        <section className="py-12 md:py-20 bg-gray-50" id="about">
          <FeaturedCategories />
        </section>

        {/* Section 4: Testimonials */}
        <section className="py-12 md:py-20" id="contact">
          <Testimonials />
        </section>
        
      </main>

      <Footer />
    </>
  );
}