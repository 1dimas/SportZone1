// services/brand.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL BRANDS
// =====================
export async function getAllBrands() {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/brand`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data brand: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return Array.isArray(data)
    ? data.map(item => ({
        ...item,
        nama: item.nama,
        deskripsi: item.deskripsi,
        logo: item.logo,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
    : {
        ...data,
        nama: data.nama,
        deskripsi: data.deskripsi,
        logo: data.logo,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
}

// =====================
// GET BRAND BY ID
// =====================
export async function getBrandById(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/brand/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data brand: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return {
    ...data,
    nama: data.nama,
    deskripsi: data.deskripsi,
    logo: data.logo,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// =====================
// CREATE BRAND
// =====================
export async function createBrand(data: { nama: string; deskripsi?: string; logo?: File }) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const formData = new FormData();
  formData.append("nama", data.nama);
  if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
  if (data.logo) formData.append("logo", data.logo);

  const response = await fetch(`${API_URL}/brand`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}


// =====================
// UPDATE BRAND
// =====================
export async function updateBrand(
  id: string,
  data: {
    nama?: string;
    deskripsi?: string;
    logo?: File | null; // sekarang logo berupa File, bukan string
  }
) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const formData = new FormData();
  if (data.nama) formData.append("nama", data.nama);
  if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
  if (data.logo) formData.append("logo", data.logo); // logo file

  const response = await fetch(`${API_URL}/brand/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ jangan set "Content-Type", biar browser otomatis isi boundary multipart
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengupdate brand: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}


// =====================
// DELETE BRAND
// =====================
export async function deleteBrand(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/brand/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menghapus brand: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return true;
}
