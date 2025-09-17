import Footer from "@/components/Home/Footer";
import Header from "@/components/Home/Header";
import ProductCard from "@/components/Home/ProductCard";
import { HeroSlider } from "@/components/Home/Heroslider";
import PopularBrands from "@/components/Home/PopularBrands";
import ProductCarousel from "@/components/Home/ProductCarousel";
import productsData from "@/app/data/products";

const Page = () => {
  return (
    <div className="bg-gray-50" id="homepage">
      <Header />
      <HeroSlider />

      <main className="container mx-auto px-4 py-16">
        {/* Popular Brands */}
        <PopularBrands />

        {/* Rekomendasi Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Rekomendasi Untuk Anda</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {productsData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Carousel Produk */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Produk Populer</h2>
          <ProductCarousel />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
