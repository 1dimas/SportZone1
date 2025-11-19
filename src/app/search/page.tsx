import Image from "next/image";
import Link from "next/link";
import { getAllProduk } from "@/components/lib/services/produk.service";
import Header from "@/components/Home/Header";

// ⭐ Component Rating
function StarRating({ rating }: { rating: number }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else if (rating >= i - 0.5) {
      stars.push(<span key={i} className="text-yellow-400">☆</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }

  return <div className="flex text-xs mt-1">{stars}</div>;
}

export default async function SearchPage({ searchParams }: any) {
  const q = (searchParams.q || "").toLowerCase();

  // Ambil semua produk
  const allProducts = await getAllProduk();

  // Filter berdasarkan nama
  let results = allProducts.filter((item: any) =>
    item.nama.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ============================== */}
        {/*        HEADER TITLE AREA       */}
        {/* ============================== */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Hasil pencarian:{" "}
            <span className="text-orange-600">"{q}"</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Menampilkan{" "}
            <span className="font-semibold">{results.length}</span> produk ditemukan
          </p>
        </div>

        {/* ============================== */}
        {/*         PRODUCT GRID           */}
        {/* ============================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((product: any) => (
            <Link
  key={product.id}
  href={`/product/${product.id}`}
  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-all"
>
  {/* IMAGE */}
  <div className="relative w-full h-48 bg-gray-100">
    <Image
      src={
        Array.isArray(product.gambar)
          ? product.gambar[0]
          : "/images/no-image.png"
      }
      fill
      className="object-cover"
      alt={product.nama}
    />

    {product.diskon && (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
        {product.diskon}%
      </div>
    )}
  </div>

  {/* CONTENT */}
  <div className="p-2">

    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 h-8">
      {product.nama}
    </h3>

    <p className="text-sm font-bold text-orange-600 mt-1">
      Rp {product.harga.toLocaleString()}
    </p>

    {product.diskon && (
      <p className="text-[10px] text-gray-400 line-through -mt-0.5">
        Rp {(product.harga / (1 - product.diskon / 100)).toLocaleString()}
      </p>
    )}

    <div className="flex items-center gap-1 text-[10px] text-gray-600 mt-1">
      ⭐ {product.rating || 4.7}
      <span>•</span>
      <span>{product.terjual || "100+"} terjual</span>
    </div>

   
  </div>
</Link>



          ))}
        </div>

        {results.length === 0 && (
          <div className="mt-12 text-center text-gray-500 text-lg">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
