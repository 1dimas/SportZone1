// components/Home/TestimonialsSection.tsx
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: "Andi Prasetyo",
    role: "Atlet Basket",
    content: "SportZone selalu memberikan produk berkualitas tinggi. Saya sudah langganan selama 2 tahun dan tidak pernah kecewa.",
    avatar: "/testimonials/user1.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Sinta Dewi",
    role: "Pelari Maraton",
    content: "Pelayanan pelanggan luar biasa! Mereka membantu saya menemukan sepatu yang tepat untuk latihan intensif saya.",
    avatar: "/testimonials/user2.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Pemain Badminton",
    content: "Harga kompetitif dan produk original. Tempat terbaik untuk belanja perlengkapan olahraga.",
    avatar: "/testimonials/user3.jpg",
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ulasan dari Pelanggan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dengarkan apa kata pelanggan kami yang sudah merasakan kualitas produk kami
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;