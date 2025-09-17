// components/Home/ModernFooter.tsx
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const ModernFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Kolom 1: Logo & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <span className="text-3xl font-bold text-gray-900">Sport</span>
              <span className="text-3xl font-bold text-orange-500">Zone</span>
            </Link>
            <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
              Destinasi utama Anda untuk perlengkapan olahraga berkualitas dari merek-merek terbaik dunia. Kami berkomitmen memberikan yang terbaik untuk para atlet.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-orange-500" size={20} />
                <span className="text-gray-700">Jl. Sport No. 123, Jakarta Selatan</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-orange-500" size={20} />
                <span className="text-gray-700">+62 812 3456 7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-orange-500" size={20} />
                <span className="text-gray-700">info@sportzone.com</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-6 relative inline-block">
              Tautan Cepat
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500"></span>
            </h3>
            <div className="flex flex-col space-y-4">
              <Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors duration-300">Tentang Kami</Link>
              <Link href="/products" className="text-gray-600 hover:text-orange-500 transition-colors duration-300">Produk</Link>
              <Link href="/promo" className="text-gray-600 hover:text-orange-500 transition-colors duration-300">Promo</Link>
              <Link href="/blog" className="text-gray-600 hover:text-orange-500 transition-colors duration-300">Blog</Link>
              <Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors duration-300">Kontak</Link>
            </div>
          </div>

          {/* Kolom 3: Newsletter */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-6 relative inline-block">
              Newsletter
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-500"></span>
            </h3>
            <p className="text-gray-600 mb-6">
              Dapatkan info promo & produk terbaru.
            </p>
            <form className="flex flex-col space-y-4">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow hover:shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SportZone. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-orange-500 transition-colors duration-300">
                <FiFacebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-orange-500 transition-colors duration-300">
                <FiTwitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-orange-500 transition-colors duration-300">
                <FiInstagram size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-500 hover:text-orange-500 transition-colors duration-300">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;