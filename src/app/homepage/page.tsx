import Header from "@/components/Home/Header";
import HeroSection from "@/components/Home/HeroSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import PricingSection from "@/components/Home/PricingSection";
import ModernFooter from "@/components/Home/ModernFooter";
import ProductCard from "@/components/Home/ProductCard";
import { MegaMenu } from "@/components/Home/MegaMenu";
import productsData from "@/app/data/products";

const Page = () => {
  return (
    <div className="bg-white" id="homepage">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* New Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produk Terbaru
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan koleksi terbaru kami dengan teknologi dan desain terkini
            </p>
          </div>

          {/* Grid Produk */}
          <div className="flex flex-wrap justify-center gap-8">
            {/* Looping data produk dan render ProductCard untuk setiap item */}
            {productsData.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap untuk Memulai Petualangan Olahraga Anda?
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-10">
            Bergabunglah dengan ribuan pelanggan yang telah mempercayai kami untuk kebutuhan olahraga mereka.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg">
              Belanja Sekarang
            </button>
            <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-orange-600 transition-all duration-300">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
};

export default Page;
