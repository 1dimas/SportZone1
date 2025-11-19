import { API_URL } from "./auth.service";

const getToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;
  return raw.replace(/^Bearer\s+/i, "").trim();
};

export enum StatusPengembalian {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum AlasanPengembalian {
  RUSAK = "rusak",
  SALAH_VARIAN = "salah varian",
  TIDAK_SESUAI = "tidak sesuai",
  LAINNYA = "lainnya",
}

export interface Pengembalian {
  id: string;
  pesanan_id: string;
  user_id: string;
  alasan: AlasanPengembalian;
  keterangan: string | null;
  bukti_foto: string | null;
  status: StatusPengembalian;
  catatan_admin: string | null;
  processed_by: string | null;
  processed_at: Date | null;
  created_at: Date;
  updated_at: Date;
  pesanan?: {
    id: string;
    total_harga: number;
    pesanan_items?: unknown[];
  };
  user?: {
    username: string;
    email: string;
  };
  admin?: {
    username: string;
    email: string;
  };
}

export interface CreatePengembalianDto {
  pesanan_id: string;
  alasan: AlasanPengembalian;
  keterangan?: string;
  bukti_foto?: string;
}

export interface ProdukRusak {
  id: string;
  pengembalian_id: string;
  produk_id: string;
  produk_varian_id: string | null;
  jumlah: number;
  deskripsi_kerusakan: string | null;
  created_at: Date;
  produk?: {
    id: string;
    nama: string;
  };
  produk_varian?: {
    id: string;
    warna: string;
    ukuran: string;
  };
}

export async function createPengembalian(
  data: CreatePengembalianDto,
  file?: File
): Promise<Pengembalian> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const formData = new FormData();
  formData.append("pesanan_id", data.pesanan_id);
  formData.append("alasan", data.alasan);
  if (data.keterangan) {
    formData.append("keterangan", data.keterangan);
  }
  if (file) {
    formData.append("bukti_foto", file);
  }

  const response = await fetch(`${API_URL}/pengembalian`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengajukan pengembalian: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function getAllPengembalian(): Promise<Pengembalian[]> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pengembalian`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data pengembalian: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export async function getPengembalianByUser(): Promise<Pengembalian[]> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pengembalian/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil riwayat pengembalian: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export async function getPengembalianById(id: string): Promise<Pengembalian> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pengembalian/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil detail pengembalian: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function approvePengembalian(
  id: string,
  catatanAdmin?: string
): Promise<Pengembalian> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pengembalian/${id}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ catatan_admin: catatanAdmin }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menyetujui pengembalian: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function rejectPengembalian(
  id: string,
  catatanAdmin?: string
): Promise<Pengembalian> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pengembalian/${id}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ catatan_admin: catatanAdmin }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal menolak pengembalian: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function getAllProdukRusak(): Promise<ProdukRusak[]> {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/pengembalian/produk-rusak/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data produk rusak: ${response.status} ${errorText}`
    );
  }

  return response.json();
}
