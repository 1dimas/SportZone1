"use client";

import { useCart } from "@/context/cart-context";
import { formatRupiah } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiCheck, FiMapPin, FiUser, FiCreditCard } from "react-icons/fi";
import {
  createPesanan,
  CreatePesananDto,
  CreatePesananItemDto,
} from "@/components/lib/services/pesanan.service";
import {
  createCodPayment,
  createMidtransPayment,
  MetodePembayaran,
} from "@/components/lib/services/pembayaran.service";
import { getProfile } from "@/components/lib/services/auth.service";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
    };
  }
}

export default function CheckoutPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  // If navigated from cart with selection, hold selected ids
  const [selectedOnly, setSelectedOnly] = useState<string[] | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    address: "",
    paymentMethod: "cod" as "cod" | "qris" | "dana",
  });

  useEffect(() => {
    async function init() {
      try {
        const stored = localStorage.getItem("token");
        if (!stored) {
          alert("Token tidak ditemukan. Login dulu.");
          router.push("/login");
          return;
        }
        setToken(stored);

        const userData = await getProfile();
        setUser(userData?.user || userData || null);

        if (userData) {
          setFormData((prev) => ({
            ...prev,
            name: userData.username || "",
            email: userData.email || "",
          }));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        alert("Gagal memuat data pengguna");
      }
    }
    init();
  }, [router]);

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Keranjang Anda Kosong
              </h2>
              <p className="text-gray-500 mb-6">
                Tambahkan beberapa produk ke keranjang Anda sebelum checkout.
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

  // Parse selected item ids from query string once on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const selected = params.get("selected");
      if (selected) {
        const ids = selected.split(",").filter(Boolean);
        if (ids.length > 0) setSelectedOnly(ids);
      }
    } catch {}
  }, []);

  const itemsForCheckout = selectedOnly
    ? state.items.filter((i) => selectedOnly.includes(i.id))
    : (() => {
        // If direct mode present, use items from localStorage and ignore cart
        const params = new URLSearchParams(window.location.search);
        const mode = params.get("mode");
        if (mode === "direct") {
          try {
            const raw = localStorage.getItem("checkout_direct_items");
            if (raw) return JSON.parse(raw);
          } catch {}
        }
        return state.items;
      })();

  const total = itemsForCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 0;
  const shipping = 0;
  const grandTotal = total;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.address.trim()) {
      alert("Mohon lengkapi alamat pengiriman");
      return;
    }

    if (!token) {
      alert("Token tidak ditemukan. Login dulu.");
      return;
    }

    setIsProcessing(true);

    try {
      // Helper function to check if string is a valid UUID
      const isValidUUID = (str: string | undefined): boolean => {
        if (!str) return false;
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(str);
      };

      // Create order items from cart (selected or all)
      const items: CreatePesananItemDto[] = itemsForCheckout.map((item) => ({
        id_produk: item.productId,
        produk_varian_id:
          isValidUUID(item.variantId) && !item.variantId?.startsWith("virtual-")
            ? item.variantId
            : undefined, 
        kuantitas: item.quantity,
        harga_satuan: item.price,
      }));

      // Create order
      const orderData: CreatePesananDto = {
        user_id: user.id,
        tanggal_pesanan: new Date().toISOString().split("T")[0],
        total_harga: grandTotal,
        alamat_pengiriman: formData.address,
        metode_pembayaran: formData.paymentMethod,
        items,
      };

      const order = await createPesanan(orderData);
      console.log("Order created:", order);

      if (formData.paymentMethod === "cod") {
        await createCodPayment(order.id);
        // alert(
        //   "Pesanan COD berhasil dibuat! Terima kasih telah berbelanja di SportZone."
        // );
        // dispatch({ type: "CLEAR_CART" });
        router.push("/pesanan/history");
      } else {
        // Midtrans payment for QRIS or DANA - this should create the payment record
        const paymentResponse = await createMidtransPayment(
          order.id,
          formData.paymentMethod as MetodePembayaran
        );
        console.log("Midtrans payment response:", paymentResponse);

        if (!window.snap) {
          const script = document.createElement("script");
          script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
          script.setAttribute(
            "data-client-key",
            process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
          );
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        const snapOptions: any = {
          onSuccess: function (result: any) {
            console.log("Payment success:", result);
            alert(
              "Pembayaran berhasil! Terima kasih telah berbelanja di SportZone."
            );
            const mode = new URLSearchParams(window.location.search).get("mode");
            if (mode !== "direct") dispatch({ type: "CLEAR_CART" });
            router.push("/pesanan");
          },
          onPending: function (result: any) {
            console.log("Payment pending:", result);
            alert("Pembayaran sedang diproses. Silakan selesaikan pembayaran.");
            router.push("/pesanan");
          },
          onError: function (result: any) {
            console.log("Payment error:", result);
            alert("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function () {
            console.log("Payment popup closed");
            alert("Pembayaran dibatalkan.");
          },
        };

        if (formData.paymentMethod === "dana") {
          snapOptions.enabledPayments = ["dana"];
        } else if (formData.paymentMethod === "qris") {
          snapOptions.enabledPayments = ["qris"];
        }

        window.snap.pay(paymentResponse.token, snapOptions);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error?.message || "Terjadi kesalahan saat memproses pesanan");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-gray-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Product Details
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FiUser className="mr-2" /> Informasi Pengiriman
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={user?.username || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telepon
                      </label>
                      <input
                        type="tel"
                        value={user?.phone || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Alamat Lengkap *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Masukkan alamat lengkap pengiriman"
                    />
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiCreditCard className="mr-2" /> Metode Pembayaran
                    </h3>

                    <div className="space-y-3">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">
                          🚚 Cash on Delivery (COD)
                        </span>
                      </label>

                      <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="qris"
                          checked={formData.paymentMethod === "qris"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">💳 QRIS</span>
                      </label>

                      <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="dana"
                          checked={formData.paymentMethod === "dana"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="ml-3 text-gray-700">💳 DANA</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing
                        ? "Memproses..."
                        : `Bayar ${formatRupiah(grandTotal)}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="mr-2" /> Ringkasan Pesanan
                </h2>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {itemsForCheckout.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Ukuran: {item.size}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatRupiah(total)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold">
                        {formatRupiah(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
