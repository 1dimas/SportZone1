"use client";

import { useCart } from "@/context/cart-context";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FiMinus, FiPlus, FiShoppingCart, FiX } from "react-icons/fi";
import { useMemo, useState } from "react";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { id } });
  };

  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const allSelected =
    state.items.length > 0 && selectedIds.length === state.items.length;
  const selectedSummary = useMemo(() => {
    const selected = state.items.filter((i) => selectedIds.includes(i.id));
    const count = selected.reduce((s, i) => s + i.quantity, 0);
    const amount = selected.reduce((s, i) => s + i.price * i.quantity, 0);
    return { count, amount };
  }, [selectedIds, state.items]);

  const displayedSubtotal =
    selectedIds.length > 0 ? selectedSummary.amount : total;

  const handleCheckoutSelected = () => {
    if (selectedIds.length === 0) {
      alert("Pilih minimal satu item untuk checkout.");
      return;
    }
    const query = encodeURIComponent(selectedIds.join(","));
    router.push(`/checkout?selected=${query}`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(state.items.map((i) => i.id));
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Keranjang Belanja
            </h1>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FiShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Keranjang Anda Kosong
              </h2>
              <p className="text-gray-500 mb-6">
                Tambahkan beberapa produk ke keranjang Anda sekarang!
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Belanja Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Keranjang Belanja
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                    Pilih Semua
                  </label>
                  {selectedIds.length > 0 && (
                    <span className="text-sm text-gray-600">
                      Dipilih: {selectedSummary.count} item •{" "}
                      {formatRupiah(selectedSummary.amount)}
                    </span>
                  )}
                </div>
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="mr-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </div>
                    <div className="flex-shrink-0 w-24 h-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>

                    <div className="ml-6 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="flex flex-col text-sm text-gray-600 mt-1 space-y-1">
                        {item.selectedSize != null &&
                          item.selectedSize !== "" && (
                            <span>Ukuran: {item.selectedSize}</span>
                          )}

                        {item.selectedColor != null &&
                          item.selectedColor !== "" && (
                            <span>Warna: {item.selectedColor}</span>
                          )}

                        {(!item.selectedSize || item.selectedSize === "") &&
                          (!item.selectedColor ||
                            item.selectedColor === "") && (
                            <span>Variant: Default</span>
                          )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-4 py-1 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className={`px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md ${
                              item.quantity >= item.stock
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>

                        <p className="text-lg font-semibold text-gray-900">
                          {formatRupiah(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatRupiah(displayedSubtotal)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">
                        {formatRupiah(displayedSubtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutSelected}
                  disabled={selectedIds.length === 0}
                  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {allSelected
                    ? `Checkout Semua (${totalItems} item)`
                    : `Checkout Terpilih (${selectedSummary.count} item)`}
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="w-full mt-3 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Lanjutkan Belanja
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
