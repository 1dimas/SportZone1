// services/petugas.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL PETUGAS
// =====================
export async function getAllPetugas() {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/petugas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data petugas");
  }

  return response.json();
}

// =====================
// GET PETUGAS BY ID
// =====================
export async function getPetugasById(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/petugas/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data petugas");
  }

  return response.json();
}

// =====================
// CREATE PETUGAS
// =====================
export async function createPetugas(data: {
  username: string;
  email: string;
  password: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/petugas`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal membuat petugas");
  }

  return response.json();
}

// =====================
// UPDATE PETUGAS
// =====================
export async function updatePetugas(
  id: string,
  data: {
    username?: string;
    email?: string;
    password?: string;
  }
) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/petugas/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Gagal mengupdate petugas");
  }

  return response.json();
}

// =====================
// DELETE PETUGAS
// =====================
export async function deletePetugas(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/petugas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus petugas");
  }

  return response.json();
}