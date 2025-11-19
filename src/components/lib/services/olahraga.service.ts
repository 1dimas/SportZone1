// services/olahraga.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL KATEGORI OLAHRAGA
// =====================
export async function getAllKategoriOlahraga() {
  const token = getToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/kategori-olahraga`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data kategori olahraga: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return Array.isArray(data)
    ? data.map(item => ({
        ...item,
        nama: item.nama,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
    : {
        ...data,
        nama: data.nama,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
}

// =====================
// GET KATEGORI OLAHRAGA BY ID
// =====================
export async function getKategoriOlahragaById(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/kategori-olahraga/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data kategori olahraga: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return {
    ...data,
    nama: data.nama,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// =====================
// CREATE KATEGORI OLAHRAGA
// =====================
export async function createKategoriOlahraga(data: {
  nama: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/kategori-olahraga`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal membuat kategori olahraga: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  // Transform the data to match the frontend schema
  return {
    ...result,
    nama: result.nama,
    created_at: result.created_at,
    updated_at: result.updated_at
  };
}

// =====================
// UPDATE KATEGORI OLAHRAGA
// =====================
export async function updateKategoriOlahraga(
  id: string,
  data: {
    nama?: string;
  }
) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/kategori-olahraga/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengupdate kategori olahraga: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// =====================
// DELETE KATEGORI OLAHRAGA
// =====================
export async function deleteKategoriOlahraga(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/kategori-olahraga/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menghapus kategori olahraga: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}