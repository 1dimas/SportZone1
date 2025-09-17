// app/components/PopularBrands.tsx
import Image from "next/image";

const brands = [
  { name: "Ortuseight", logo: "/brands/ortus.jpeg" },
  { name: "Specs", logo: "/brands/spec.jpg" },
  { name: "Nike", logo: "/brands/nauk.jpg" },
  { name: "Adidas", logo: "/brands/adidd.jpg" },
  { name: "Puma", logo: "/brands/pumah.jpg" },
];

export default function PopularBrands() {
  return (
    <section className="px-8 py-12">
      <h3 className="text-2xl font-bold mt-8 mb-20">Brand Terpopuler</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {brands.map((b, i) => (
          <div
            key={i}
            className="flex items-center justify-center border rounded-xl p-4 bg-white hover:shadow-lg transition"
          >
            <Image src={b.logo} alt={b.name} width={100} height={50} />
          </div>
        ))}
      </div>
    </section>
  );
}
