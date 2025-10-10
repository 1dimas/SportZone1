// services/produk.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL PRODUK
// =====================
export async function getAllProduk() {
  // No authentication required to view products
  const response = await fetch(`${API_URL}/produk`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data produk: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET PRODUK BY ID
// =====================
export async function getProdukById(id: string) {
  // No authentication required to view individual products
  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data produk: ${response.status} ${response.statusText} - ${errorText}`);
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
  formData.append("subkategori_id", data.subkategori_id);
  formData.append("brand_id", data.brand_id);
  if (data.status) formData.append("status", data.status);
  if (data.gambar && data.gambar.length > 0) {
    data.gambar.forEach((file, index) => {
      formData.append("gambar", file);
    });
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
  if (data.subkategori_id) formData.append("subkategori_id", data.subkategori_id);
  if (data.brand_id) formData.append("brand_id", data.brand_id);
  if (data.status) formData.append("status", data.status);
  if (data.gambar) {
    if (Array.isArray(data.gambar) && data.gambar.length > 0) {
      data.gambar.forEach((item) => {
        if (item instanceof File) {
          formData.append("gambar", item);
        }
      });
    }
  }
  if (data.deleted_images && data.deleted_images.length > 0) {
    data.deleted_images.forEach((imageUrl) => {
      formData.append("deleted_images", imageUrl);
    });
  }

  const response = await fetch(`${API_URL}/produk/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengupdate produk: ${response.status} ${response.statusText} - ${errorText}`);
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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menghapus produk: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return true;
}

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
// GET PRODUK BY KATEGORI
// =====================
export async function getProdukByKategori(kategoriId: string) {
  // No authentication required to view products by category
  const response = await fetch(`${API_URL}/produk/kategori/${kategoriId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data produk by kategori: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET PRODUK BY SUBKATEGORI
// =====================
export async function getProdukBySubkategori(subkategoriId: string) {
  // No authentication required to view products by subcategory
  const response = await fetch(`${API_URL}/produk/subkategori/${subkategoriId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data produk by subkategori: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// GET PRODUK BY BRAND
// =====================
export async function getProdukByBrand(brandId: string) {
  // No authentication required to view products by brand
  const response = await fetch(`${API_URL}/produk/brand/${brandId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data produk by brand: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =====================
// DELETE GAMBAR PRODUK
// =====================
export async function deleteGambarProduk(id: string, gambarUrl: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/produk/${id}/gambar/${encodeURIComponent(gambarUrl)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menghapus gambar produk: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
