// services/pesanan.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage and normalize
const getToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  // Strip leading "Bearer " if present
  return raw.replace(/^Bearer\s+/i, "").trim();
};

// Interfaces for Pesanan data
export interface PesananItem {
  id: string;
  pesanan_id: string;
  id_produk: string;
  produk_varian_id?: string;
  kuantitas: number;
  harga_satuan: number;
  produk?: {
    id: string;
    nama: string;
    gambar?: string[];
    gambar_url?: string;
  };
  produk_varian?: {
    id: string;
    warna_varian: string;
    ukuran: string;
  };
}

export interface Pesanan {
  id: string;
  user_id: string;
  tanggal_pesanan: string;
  total_harga: number;
  status: string;
  alamat_pengiriman: string;
  kota?: string;
  provinsi?: string;
  eta_min?: number;
  eta_max?: number;
  created_at: string;
  updated_at: string;
  metode_pembayaran?: string;
  status_pembayaran?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
  pesanan_items?: PesananItem[];
}

export type StatusPesanan =
  | "pending"
  | "diproses"
  | "dikirim"
  | "selesai"
  | "dibatalkan"
  | "dikembalikan";

// DTOs for creating orders
export interface CreatePesananItemDto {
  id_produk: string;
  produk_varian_id?: string;
  kuantitas: number;
  harga_satuan: number;
}

export interface CreatePesananDto {
  user_id: string;
  tanggal_pesanan: string;
  total_harga: number;
  alamat_pengiriman: string;
  kota: string;
  provinsi: string;
  metode_pembayaran: string;
  items: CreatePesananItemDto[];
}

// =====================
// GET ALL PESANAN
// =====================
export async function getAllPesanan(): Promise<Pesanan[]> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  // Ensure we always return an array
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET PESANAN BY ID
// =====================
export async function getPesananById(id: string): Promise<Pesanan> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil detail pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log("Response getPesananById:", data);
  console.log("Pesanan kota:", data.kota, "provinsi:", data.provinsi);
  return data;
}

// =====================
// GET PESANAN HISTORY (BY AUTH USER)
// =====================
export async function getPesananHistory(): Promise<Pesanan[]> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil riwayat pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  console.log("Response getPesananHistory:", data);
  if (Array.isArray(data) && data.length > 0) {
    console.log("Sample pesanan kota:", data[0].kota, "provinsi:", data[0].provinsi);
  }
  return Array.isArray(data) ? data : [data];
}

// =====================
// CREATE PESANAN
// =====================
export async function createPesanan(data: CreatePesananDto): Promise<Pesanan> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal membuat pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// UPDATE PESANAN STATUS
// =====================
export async function updatePesananStatus(
  id: string,
  status: StatusPesanan
): Promise<Pesanan> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan/${id}/status`, {
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
      `Gagal mengupdate status pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// CANCEL ORDER
// =====================
export async function cancelOrder(id: string): Promise<Pesanan> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan/${id}/cancel`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal membatalkan pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// FINISH ORDER (Customer only)
// =====================
export async function finishOrder(id: string): Promise<Pesanan> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan/${id}/finish`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menyelesaikan pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// RETURN ORDER (DIKEMBALIKAN)
// =====================
export async function returnOrder(id: string): Promise<Pesanan> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pesanan/${id}/status`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "dikembalikan" }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengembalikan pesanan: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}
