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
    <section className="bg-slate-50 " id="product">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Kategori Terpopuler</h2>
          <p className="mt-2 text-md text-slate-600">Temukan perlengkapan sesuai kebutuhan Anda.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link href={category.href} key={category.name} className="group relative block rounded-xl overflow-hidden">
              <div className="relative w-full h-64">
                <Image src={category.imageUrl} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300"/>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold tracking-wider uppercase drop-shadow-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};