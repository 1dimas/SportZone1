import products from "@/app/data/products";
import ProductDetail from "@/components/ProductDetail";

type Props = {
  params: { id: string };
};

export default function ProductPage({ params }: Props) {
  const productId = Number(params.id); // 👈 pastikan number
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-6 text-center text-red-600">
        Produk dengan ID {params.id} tidak ditemukan
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
