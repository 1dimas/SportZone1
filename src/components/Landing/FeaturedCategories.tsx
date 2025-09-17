// components/FeaturedCategories.tsx
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Sepatu Lari', href: '/sepatu/running', imageUrl: '/categories/running.jpg' },
  { name: 'Badminton', href: '/sports/badminton', imageUrl: '/categories/badminton.jpg' },
  { name: 'Jersey Bola', href: '/apparel/jersey', imageUrl: '/categories/jersey.jpg' },
  { name: 'Fitness & Gym', href: '/sports/gym', imageUrl: '/categories/fitness.jpg' },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-white" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Kategori Terpopuler</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan perlengkapan sesuai kebutuhan Anda dengan kualitas terbaik
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link 
              href={category.href} 
              key={category.name} 
              className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative w-full h-80">
                <Image 
                  src={category.imageUrl} 
                  alt={category.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
              </div>
              <div className="absolute inset-0 flex items-end p-6">
                <h3 className="text-white text-2xl font-bold tracking-wide uppercase">
                  {category.name}
                </h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};