// services/subkategori-peralatan.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL SUBKATEGORI PERALATAN
// =====================
export async function getAllSubkategoriPeralatan() {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/subkategori-peralatan`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data subkategori peralatan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return Array.isArray(data)
    ? data.map(item => ({
        ...item,
        nama: item.nama,
        kategori_olahraga_id: item.kategori_olahraga_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        kategoriOlahraga: item.kategoriOlahraga
      }))
    : {
        ...data,
        nama: data.nama,
        kategori_olahraga_id: data.kategori_olahraga_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        kategoriOlahraga: data.kategoriOlahraga
      };
}

// =====================
// GET SUBKATEGORI PERALATAN BY ID
// =====================
export async function getSubkategoriPeralatanById(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/subkategori-peralatan/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data subkategori peralatan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return {
    ...data,
    nama: data.nama,
    kategori_olahraga_id: data.kategori_olahraga_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    kategoriOlahraga: data.kategoriOlahraga
  };
}

// =====================
// GET SUBKATEGORI PERALATAN BY KATEGORI OLAHRAGA ID
// =====================
export async function getSubkategoriPeralatanByKategoriOlahraga(kategoriOlahragaId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/subkategori-peralatan/kategori/${kategoriOlahragaId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data subkategori peralatan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Transform the data to match the frontend schema
  return Array.isArray(data)
    ? data.map(item => ({
        ...item,
        nama: item.nama,
        kategori_olahraga_id: item.kategori_olahraga_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        kategoriOlahraga: item.kategoriOlahraga
      }))
    : {
        ...data,
        nama: data.nama,
        kategori_olahraga_id: data.kategori_olahraga_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        kategoriOlahraga: data.kategoriOlahraga
      };
}

// =====================
// CREATE SUBKATEGORI PERALATAN
// =====================
export async function createSubkategoriPeralatan(data: {
  nama: string;
  kategori_olahraga_id: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/subkategori-peralatan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal membuat subkategori peralatan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  // Transform the data to match the frontend schema
  return {
    ...result,
    nama: result.nama,
    kategori_olahraga_id: result.kategori_olahraga_id,
    created_at: result.created_at,
    updated_at: result.updated_at,
    kategoriOlahraga: result.kategoriOlahraga
  };
}

// =====================
// UPDATE SUBKATEGORI PERALATAN
// =====================
export async function updateSubkategoriPeralatan(
  id: string,
  data: {
    nama?: string;
    kategori_olahraga_id?: string;
  }
) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/subkategori-peralatan/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengupdate subkategori peralatan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  // Transform the data to match the frontend schema
  return {
    ...result,
    nama: result.nama,
    kategori_olahraga_id: result.kategori_olahraga_id,
    created_at: result.created_at,
    updated_at: result.updated_at,
    kategoriOlahraga: result.kategoriOlahraga
  };
}

// =====================
// DELETE SUBKATEGORI PERALATAN
// =====================
export async function deleteSubkategoriPeralatan(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/subkategori-peralatan/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menghapus subkategori peralatan: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}