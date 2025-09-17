import { testimonialData, Testimonial } from "@/app/data/testimonials";
import { FaStar, FaStarHalfAlt, FaQuoteLeft } from 'react-icons/fa';

// Komponen kecil untuk menampilkan bintang rating
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

// Komponen untuk satu kartu testimonial
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <FaQuoteLeft className="text-orange-500 text-4xl mb-6" />
      <p className="text-gray-700 italic mb-8 flex-grow text-lg">"{testimonial.quote}"</p>
      
      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={testimonial.avatarUrl} 
              alt={testimonial.name} 
              className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-orange-100" 
            />
            <div>
              <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
              <p className="text-gray-600">{testimonial.title}</p>
            </div>
          </div>
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
    </div>
  );
};

// Komponen utama yang akan diekspor
export const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Dipercaya oleh Ribuan Pelanggan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lihat apa kata mereka yang sudah merasakan kualitas produk dan layanan kami.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialData.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};