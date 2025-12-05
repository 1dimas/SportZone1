// services/rating.service.ts

import { API_URL } from "./auth.service";

const getToken = () => {
  const raw = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  if (!raw) return null;
  return raw.replace(/^Bearer\s+/i, "").trim();
};

export type CreateRatingPayload = {
  userId: string;
  produkId: string;
  rating: number; // 1-5
  review?: string;
};

export type UpdateRatingPayload = {
  rating?: number;
  review?: string;
};

export type RatingData = {
  id: string;
  rating: number;
  review: string | null;
  createdAt: string;
  user: {
    id: string;
    nama: string;
    username?: string;
    email: string;
  };
};

export async function createRating(payload: CreateRatingPayload) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/rating`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal mengirim rating: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function updateRating(id: string, payload: UpdateRatingPayload) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/rating/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal update rating: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function deleteRating(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/rating/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal hapus rating: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function getRatingsByProduct(produkId: string) {
  const res = await fetch(`${API_URL}/rating/product/${produkId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Gagal ambil rating produk: ${res.status} ${res.statusText} - ${text}`
    );
  }

  return res.json();
}


export async function getRatingsByUser(userId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const res = await fetch(`${API_URL}/rating/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gagal ambil rating user: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function checkUserRating(userId: string, produkId: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/rating/check/${userId}/${produkId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return false;
    const data = await res.json();
    return data?.hasRated === true;
  } catch {
    return false;
  }
}

export async function getAverageRating(produkId: string): Promise<number> {
  const res = await fetch(`${API_URL}/rating/product/${produkId}/average`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return 0;

  const data = await res.json();
  return typeof data?.averageRating === "number" ? data.averageRating : 0;
}


// Fungsi untuk mengambil rating rata-rata tanpa perlu login (untuk homepage)
export async function getAverageRatingPublic(produkId: string): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/rating/product/${produkId}/average`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      // Jika gagal, return 0 tanpa throw error
      return 0;
    }
    
    const data = await res.json();
    return typeof data?.averageRating === "number" ? data.averageRating : 0;
  } catch (error) {
    // Jika error, return 0
    return 0;
  }
}

// Fungsi untuk mengambil rating count tanpa perlu login
export async function getRatingCountPublic(produkId: string): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/rating/product/${produkId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!res.ok) {
      return 0;
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    return 0;
  }
}

