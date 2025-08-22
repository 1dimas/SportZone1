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
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-300">
      <FaQuoteLeft className="text-blue-500 text-3xl mb-4" />
      <p className="text-slate-600 italic mb-6 flex-grow">{testimonial.quote}</p>
      
      <div className="mt-auto pt-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
             {/* Ganti 'Image' dari 'next/image' untuk optimasi */}
            <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
            <div>
              <p className="font-bold text-slate-800">{testimonial.name}</p>
              <p className="text-sm text-slate-500">{testimonial.title}</p>
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
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800">
          Dipercaya oleh Ribuan Pelanggan
        </h2>
        <p className="text-slate-600 text-center mt-3 mb-10 max-w-2xl mx-auto">
          Lihat apa kata mereka yang sudah merasakan kualitas produk dan layanan kami.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialData.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};