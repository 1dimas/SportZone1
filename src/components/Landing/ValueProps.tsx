// components/ValueProps.tsx
import { FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const features = [
  { icon: FiShield, title: '100% Original', description: 'Jaminan produk asli & resmi.' },
  { icon: FiTruck, title: 'Pengiriman Cepat', description: 'Dikirim di hari yang sama.' },
  { icon: FiRefreshCw, title: 'Garansi Pengembalian', description: '30 hari pengembalian mudah.' },
  { icon: FiHeadphones, title: 'Layanan 24/7', description: 'Siap membantu kapan saja.' },
];

export const ValueProps = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50" id="about">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <feature.icon size={28} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};