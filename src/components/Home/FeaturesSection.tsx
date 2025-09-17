// components/Home/FeaturesSection.tsx
import { FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const features = [
  { 
    icon: <FiShield className="w-8 h-8" />, 
    title: '100% Original', 
    description: 'Jaminan produk asli & resmi.' 
  },
  { 
    icon: <FiTruck className="w-8 h-8" />, 
    title: 'Pengiriman Cepat', 
    description: 'Dikirim di hari yang sama.' 
  },
  { 
    icon: <FiRefreshCw className="w-8 h-8" />, 
    title: 'Garansi Pengembalian', 
    description: '30 hari pengembalian mudah.' 
  },
  { 
    icon: <FiHeadphones className="w-8 h-8" />, 
    title: 'Layanan 24/7', 
    description: 'Siap membantu kapan saja.' 
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami memberikan yang terbaik untuk pengalaman belanja Anda
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;