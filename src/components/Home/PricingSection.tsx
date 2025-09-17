// components/Home/PricingSection.tsx
import Link from "next/link";

const plans = [
  {
    id: 1,
    name: "Basic",
    price: "0",
    period: "per bulan",
    description: "Perfect untuk pemula yang ingin mencoba",
    features: [
      "Gratis ongkir untuk pembelian di atas Rp500.000",
      "Akses ke katalog produk dasar",
      "Layanan pelanggan 24/7",
      "Garansi pengembalian 7 hari"
    ],
    ctaText: "Mulai Sekarang",
    popular: false
  },
  {
    id: 2,
    name: "Premium",
    price: "29.000",
    period: "per bulan",
    description: "Untuk pelanggan yang ingin pengalaman terbaik",
    features: [
      "Gratis ongkir tanpa minimum pembelian",
      "Akses ke katalog produk lengkap",
      "Layanan pelanggan 24/7 dengan prioritas",
      "Garansi pengembalian 30 hari",
      "Diskon eksklusif 10%",
      "Prioritas dalam restock produk"
    ],
    ctaText: "Pilih Premium",
    popular: true
  },
  {
    id: 3,
    name: "VIP",
    price: "99.000",
    period: "per bulan",
    description: "Untuk pelanggan setia dengan manfaat maksimal",
    features: [
      "Gratis ongkir tanpa minimum pembelian",
      "Akses ke semua produk termasuk edisi khusus",
      "Layanan pelanggan VIP 24/7",
      "Garansi pengembalian 60 hari",
      "Diskon eksklusif 20%",
      "Prioritas mutlak dalam restock produk",
      "Akses ke event eksklusif"
    ],
    ctaText: "Jadi VIP",
    popular: false
  }
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Membership & Keuntungan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda dan nikmati berbagai keuntungan eksklusif
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-xl border border-gray-200 p-8 relative transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'ring-2 ring-orange-500 ring-offset-2 transform scale-105' 
                  : 'hover:border-orange-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  POPULER
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">Rp{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/membership"
                className={`block text-center font-bold py-3 px-6 rounded-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.ctaText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;