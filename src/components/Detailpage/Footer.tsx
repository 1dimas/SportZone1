// components/Footer.tsx
import Link from 'next/link';

// 1. Tambahkan props
type FooterProps = {
  variant?: 'default' | 'simple';
}

const Footer = ({ variant = 'default' }: FooterProps) => {
  if (variant === 'simple') {
    // 2. Tampilan Footer yang simpel
    return (
      <footer className="bg-slate-100 border-t">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} SportZone. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:underline">Kebijakan Privasi</Link>
              <Link href="/terms" className="hover:underline">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // 3. Tampilan Footer default (yang lebih lengkap)
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            {/* Kolom-kolom footer yang lebih detail bisa ditambahkan di sini */}
            <div>
                <h3 className="font-bold uppercase text-white mb-4">Produk</h3>
                {/* ... link-link ... */}
            </div>
            <div>
                <h3 className="font-bold uppercase text-white mb-4">Bantuan</h3>
                {/* ... link-link ... */}
            </div>
            <div>
                <h3 className="font-bold uppercase text-white mb-4">Tentang Kami</h3>
                {/* ... link-link ... */}
            </div>
            <div>
                <h3 className="font-bold uppercase text-white mb-4">Ikuti Kami</h3>
                {/* ... ikon sosial media ... */}
            </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SportZone. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;