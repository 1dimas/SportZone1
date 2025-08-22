// components/ValueProps.tsx
import { FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import Image from 'next/image';

const features = [
  { icon: FiShield, title: '100% Original', description: 'Jaminan produk asli & resmi.' },
  { icon: FiTruck, title: 'Pengiriman Cepat', description: 'Dikirim di hari yang sama.' },
  { icon: FiRefreshCw, title: 'Garansi Pengembalian', description: '30 hari pengembalian mudah.' },
  { icon: FiHeadphones, title: 'Layanan 24/7', description: 'Siap membantu kapan saja.' },
];

export const ValueProps = () => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat bg-[url('/banners/jandt.jpeg')]" id="About">
      <div className="container mx-auto px-4 py-12 m-100 backdrop-blur-sm " >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" >
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <feature.icon size={36} className="text-orange-400 mb-3" />
              <h3 className="font-bold text-md md:text-lg text-white">{feature.title}</h3>
              <p className="text-sm text-white mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};