import Image from "next/image";
import Link from "next/link";
import { getAllProduk } from "@/components/lib/services/produk.service";
import Header from "@/components/Home/Header";

export default async function SearchPage({ searchParams }: any) {
  const q = (searchParams.q || "").toLowerCase();
  const sort = searchParams.sort || "relevance";

  // Ambil semua produk
  const allProducts = await getAllProduk();

  // Filter berdasarkan nama
  let results = allProducts.filter((item: any) =>
    item.nama.toLowerCase().includes(q)
  );

  // Sorting
  if (sort === "low") {
    results = results.sort((a: any, b: any) => a.harga - b.harga);
  } else if (sort === "high") {
    results = results.sort((a: any, b: any) => b.harga - a.harga);
  } else if (sort === "new") {
    results = results.sort(
      (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

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
            Menampilkan <span className="font-semibold">{results.length}</span> produk ditemukan
          </p>
        </div>

        {/* ============================== */}
        {/*       FILTER BAR MODERN        */}
        {/* ============================== */}
        <div className="bg-white border rounded-xl p-3 shadow-sm mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-gray-700 font-medium mr-2">Urutkan:</span>

          {[
            { key: "relevance", label: "Relevansi" },
            { key: "low", label: "Termurah" },
            { key: "high", label: "Termahal" },
            { key: "new", label: "Terbaru" },
          ].map((item) => (
            <Link
              key={item.key}
              href={`/search?q=${q}${item.key === "relevance" ? "" : `&sort=${item.key}`}`}
              className={`
                px-4 py-1.5 rounded-lg text-sm border transition
                ${
                  sort === item.key
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white hover:bg-gray-100 border-gray-300 text-gray-700"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ============================== */}
        {/*         PRODUCT GRID           */}
        {/* ============================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="relative w-full h-40 bg-gray-100">
                <Image
                  src={product.gambar || "/images/no-image.png"}
                  fill
                  className="object-cover"
                  alt={product.nama}
                />
              </div>

              <div className="p-3">
                <h3 className="font-medium text-sm h-10 leading-tight line-clamp-2">
                  {product.nama}
                </h3>

                <p className="text-orange-600 font-bold mt-2">
                  Rp {product.harga.toLocaleString()}
                </p>
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
