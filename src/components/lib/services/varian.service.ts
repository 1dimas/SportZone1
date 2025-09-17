// services/varian.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET VARIAN BY PRODUK
// =====================
export async function getVarianByProduk(produkId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/${produkId}/varian`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data varian: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET VARIAN BY ID
// =====================
export async function getVarianById(varianId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/varian/${varianId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data varian: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// =====================
// CREATE VARIAN
// =====================
export async function createVarian(data: {
  produk_id: string;
  ukuran?: string;
  warna?: string;
  stok: number;
  harga?: number;
  sku?: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/${data.produk_id}/varian`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

// =====================
// UPDATE VARIAN
// =====================
export async function updateVarian(
  varianId: string,
  data: {
    ukuran?: string;
    warna?: string;
    stok?: number;
    harga?: number;
    sku?: string;
    produk_id?: string;
  }
) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/varian/${varianId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengupdate varian: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// =====================
// DELETE VARIAN
// =====================
export async function deleteVarian(varianId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/varian/${varianId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menghapus varian: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return true;
}
