import { API_URL } from "./auth.service";

// =====================
// Helper: Get token from localStorage
// =====================
const getToken = () => localStorage.getItem("token");

// =====================
// Type Definitions
// =====================
export type MetodePembayaran = "cod" | "dana" | "qris";

export type StatusPembayaran =
  | "belum bayar"
  | "sudah bayar"
  | "gagal"
  | "dikembalikan";

export interface Pembayaran {
  id: string;
  pesanan: {
    id: string;
    status?: string;
    total_harga?: number;
  };
  metode: MetodePembayaran | null;
  status: StatusPembayaran;
  bukti_pembayaran?: string | null;
  created_at: string;
}

// =====================
// GET ALL PEMBAYARAN (Admin only)
// =====================
export async function getAllPembayaran(): Promise<Pembayaran[]> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pembayaran`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data pembayaran: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET PEMBAYARAN BY PESANAN ID
// =====================
export async function getPembayaranByPesananId(
  pesananId: string
): Promise<Pembayaran> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pembayaran/${pesananId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data pembayaran pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// UPDATE STATUS PEMBAYARAN (Admin only)
// =====================
export async function updatePembayaranStatus(
  pembayaranId: string,
  status: StatusPembayaran
): Promise<Pembayaran> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pembayaran/${pembayaranId}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengupdate status pembayaran: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}
