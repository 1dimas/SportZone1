// Footer.js
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiSend } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Kolom 1: Logo & Social Media */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-bold text-blue-500">
              SportZone
            </Link>
            <p className="mt-4 text-gray-400 max-w-xs">
              Destinasi utama Anda untuk perlengkapan olahraga berkualitas dari merek-merek terbaik dunia.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FiFacebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><FiTwitter size={20} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><FiInstagram size={20} /></a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors"><FiYoutube size={20} /></a>
            </div>
          </div>

          {/* Kolom 2: Bantuan */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Bantuan</h3>
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Hubungi Kami</Link>
              <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Info Pengiriman</Link>
              <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Kebijakan Pengembalian</Link>
            </div>
          </div>

          {/* Kolom 3: Toko */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Toko</h3>
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/sports/football" className="text-gray-400 hover:text-white transition-colors">Sepak Bola</Link>
              <Link href="/sports/basketball" className="text-gray-400 hover:text-white transition-colors">Basket</Link>
              <Link href="/sports/running" className="text-gray-400 hover:text-white transition-colors">Lari</Link>
              <Link href="/promo" className="text-gray-400 hover:text-white transition-colors">Promo</Link>
            </div>
          </div>

          {/* Kolom 4: Newsletter */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Newsletter</h3>
            <p className="mt-4 text-gray-400 text-sm">Dapatkan info promo & produk terbaru.</p>
            <form className="flex mt-4">
              <input 
                type="email" 
                placeholder="Email Anda" 
                className="w-full px-4 py-2 text-white bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors"
                aria-label="Kirim"
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SportZone. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {/* Ganti dengan ikon pembayaran jika ada */}
            <span className="text-gray-500 text-sm">Pembayaran Aman</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;