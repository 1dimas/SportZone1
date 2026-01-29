// components/Footer.tsx
import Link from "next/link";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiSend,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Grid Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {/* Kolom 1: Logo & Sosial Media */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-bold text-white hover:text-orange-400 transition-colors"
            >
              Sport
            </Link>
            <Link
              href="/"
              className="text-3xl font-bold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Zone
            </Link>
            <p className="mt-4 text-gray-400 max-w-xs leading-relaxed">
              Destinasi utama Anda untuk perlengkapan olahraga berkualitas dari
              merek-merek terbaik dunia.
            </p>

            <div className="flex gap-5 mt-6">
              <a
                href="#"
                aria-label="Facebook"
                className="hover:text-white transition-colors"
              >
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-white transition-colors"
              >
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-white transition-colors"
              >
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="hover:text-white transition-colors"
              >
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Bantuan */}
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              Bantuan
            </h3>
            <ul className="flex flex-col gap-3 mt-4">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Info Pengiriman
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Kebijakan Pengembalian
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Toko */}
          <div>
            <h3 className="text-lg font-semibold text-white uppercase tracking-wider">
              Peralatan
            </h3>
            <ul className="flex flex-col gap-3 mt-4">
              <li>
                <Link
                  href="/sports/football"
                  className="hover:text-white transition-colors"
                >
                  Sepak Bola
                </Link>
              </li>
              <li>
                <Link
                  href="/sports/basketball"
                  className="hover:text-white transition-colors"
                >
                  Basket
                </Link>
              </li>
              <li>
                <Link
                  href="/sports/running"
                  className="hover:text-white transition-colors"
                >
                  Lari
                </Link>
              </li>
              <li>
                <Link
                  href="/promo"
                  className="hover:text-white transition-colors"
                >
                  Promo
                </Link>
              </li>
            </ul>
          </div>


        </div>

        {/* Garis bawah */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} SportZone. Hak Cipta Dilindungi.
          </p>
          <div className="text-gray-500 text-sm mt-4 sm:mt-0">
            Pembayaran Aman 💳
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
