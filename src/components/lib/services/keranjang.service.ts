// services/keranjang.service.ts

import { API_URL } from "./auth.service";

// Helpers
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

export type AddItemDto = {
  produk_id: string;
  produk_varian_id?: string | null;
  kuantitas: number;
};

export type UpdateItemDto = {
  kuantitas: number;
};

export async function getKeranjang() {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/keranjang`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addKeranjangItem(dto: AddItemDto) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/keranjang/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateKeranjangItem(itemId: string, dto: UpdateItemDto) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/keranjang/items/${itemId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function removeKeranjangItem(itemId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/keranjang/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function clearKeranjang() {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/keranjang/clear`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

