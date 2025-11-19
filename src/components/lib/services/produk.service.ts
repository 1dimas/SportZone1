// services/produk.service.ts

import { API_URL } from "./auth.service";

// =====================
// HELPER GET TOKEN
// =====================
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL PRODUK
// =====================
export async function getAllProduk() {
  const response = await fetch(`${API_URL}/produk`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data produk: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET PRODUK BY ID
// =====================
export async function getProdukById(id: string) {
  const safeDecode = (value: string) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };
  const normalizedId = encodeURIComponent(safeDecode(id));

  const response = await fetch(`${API_URL}/produk/${normalizedId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data produk: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// CREATE PRODUK
// =====================
export async function createProduk(data: {
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  subkategori_id: string;
  brand_id: string;
  gambar?: File[];
  status?: string;
}) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const formData = new FormData();
  formData.append("nama", data.nama);
  formData.append("deskripsi", data.deskripsi);
  formData.append("harga", data.harga.toString());
  formData.append("stok", data.stok.toString());
  formData.append("subkategori_id", data.subkategori_id);
  formData.append("brand_id", data.brand_id);
  if (data.status) formData.append("status", data.status);
  if (data.gambar?.length) {
    data.gambar.forEach((file) => formData.append("gambar", file));
  }

  const response = await fetch(`${API_URL}/produk`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

// =====================
// UPDATE PRODUK
// =====================
export async function updateProduk(
  id: string,
  data: {
    nama?: string;
    deskripsi?: string;
    harga?: number;
    stok?: number;
    subkategori_id?: string;
    brand_id?: string;
    gambar?: File[] | string[];
    deleted_images?: string[];
    status?: string;
  }
) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const formData = new FormData();
  if (data.nama) formData.append("nama", data.nama);
  if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
  if (data.harga !== undefined) formData.append("harga", data.harga.toString());
  if (data.stok !== undefined) formData.append("stok", data.stok.toString());
  if (data.subkategori_id)
    formData.append("subkategori_id", data.subkategori_id);
  if (data.brand_id) formData.append("brand_id", data.brand_id);
  if (data.status) formData.append("status", data.status);

  if (data.gambar?.length) {
    data.gambar.forEach((item) => {
      if (item instanceof File) formData.append("gambar", item);
    });
  }

  if (data.deleted_images?.length) {
    data.deleted_images.forEach((url) =>
      formData.append("deleted_images", url)
    );
  }

  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengupdate produk: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// DELETE PRODUK
// =====================
export async function deleteProduk(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menghapus produk: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return true;
}

// =====================
// DELETE GAMBAR PRODUK
// =====================
export async function deleteGambarProduk(produkId: string, gambarUrl: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  // Extract filename from URL
  // Example: "http://localhost:3000/uploads/products/image.jpg" -> "image.jpg"
  // Or: "uploads/products/image.jpg" -> "image.jpg"
  let gambarId = gambarUrl;
  try {
    // Try to extract the filename from the URL
    const urlParts = gambarUrl.split("/");
    gambarId = urlParts[urlParts.length - 1];

    // If the URL contains query parameters, remove them
    if (gambarId.includes("?")) {
      gambarId = gambarId.split("?")[0];
    }
  } catch (error) {
    // If extraction fails, use the original gambarUrl
    console.warn("Failed to extract filename from URL:", error);
  }

  // Encode the gambarId to handle special characters
  const encodedGambarId = encodeURIComponent(gambarId);

  const response = await fetch(
    `${API_URL}/produk/${produkId}/gambar/${encodedGambarId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menghapus gambar produk: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return true;
}

// =====================
// VARIAN PRODUK
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
    throw new Error(
      `Gagal mengambil data varian: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

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
    throw new Error(
      `Gagal mengupdate varian: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

export async function deleteVarian(varianId: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/varian/${varianId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menghapus varian: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return true;
}

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
    throw new Error(
      `Gagal mengambil data varian: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json();
}

// =====================
// PRODUK FILTER BY KATEGORI / SUBKATEGORI / BRAND
// =====================
export async function getProdukByKategori(kategoriId: string) {
  const response = await fetch(`${API_URL}/produk/kategori/${kategoriId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export async function getProdukBySubkategori(subkategoriId: string) {
  console.log(`Fetching produk for subkategori ID: ${subkategoriId}`);
  console.log(`API URL: ${API_URL}/produk/subkategori/${subkategoriId}`);
  
  const response = await fetch(
    `${API_URL}/produk/subkategori/${subkategoriId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  
  console.log(`Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error response: ${errorText}`);
    throw new Error(errorText);
  }
  
  const data = await response.json();
  console.log(`Received produk data:`, data);
  
  return Array.isArray(data) ? data : [data];
}

export async function getProdukByBrand(brandId: string) {
  const response = await fetch(`${API_URL}/produk/brand/${brandId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}
