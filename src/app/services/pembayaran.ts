import { API_URL } from "@/components/lib/services/auth.service";

export enum MetodePembayaran {
  COD = "cod",
  DANA = "dana",
  QRIS = "qris",
}

export enum StatusPembayaran {
  BELUM_BAYAR = "belum bayar",
  SUDAH_BAYAR = "sudah bayar",
  GAGAL = "gagal",
  DIKEMBALIKAN = "dikembalikan",
}

export interface PembayaranRecord {
  id: string;
  pesanan_id?: string; // Optional since backend uses relation
  metode: MetodePembayaran | null;
  status: StatusPembayaran;
  bukti_pembayaran: string | null;
  created_at: string;
}

export interface MidtransPaymentResponse {
  token: string;
  redirect_url: string;
}

// Create pembayaran record (general)
export async function createPembayaran(
  token: string,
  pesananId: string
): Promise<PembayaranRecord> {
  const response = await fetch(`${API_URL}/pembayaran`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pesananId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal membuat pembayaran");
  }

  return response.json();
}

// Create COD payment
export async function createCodPayment(
  token: string,
  pesananId: string
): Promise<PembayaranRecord> {
  const response = await fetch(`${API_URL}/pembayaran/cod`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pesananId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal membuat pembayaran COD");
  }

  return response.json();
}

// Initiate Midtrans payment
export async function createMidtransPayment(
  token: string,
  pesananId: string
): Promise<MidtransPaymentResponse> {
  console.log("Calling Midtrans API:", `${API_URL}/pembayaran/initiate`);
  console.log("Request body:", { pesananId });

  const response = await fetch(`${API_URL}/pembayaran/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pesananId }),
  });

  console.log("API Response status:", response.status);
  console.log(
    "API Response headers:",
    Object.fromEntries(response.headers.entries())
  );

  if (!response.ok) {
    const error = await response.json();
    console.log("API Error response:", error);
    throw new Error(error.message || "Gagal membuat pembayaran Midtrans");
  }

  const data = await response.json();
  console.log("API Success response:", data);
  return data;
}

// Get payment status
export async function getPaymentStatus(
  token: string,
  pesananId: string
): Promise<PembayaranRecord> {
  const response = await fetch(`${API_URL}/pembayaran/${pesananId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan status pembayaran");
  }

  return response.json();
}

// Update payment status (for admin)
export async function updatePaymentStatus(
  token: string,
  pembayaranId: string,
  status: StatusPembayaran
): Promise<PembayaranRecord> {
  const response = await fetch(`${API_URL}/pembayaran/${pembayaranId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mengupdate status pembayaran");
  }

  return response.json();
}

// Get all payments (for admin)
export async function getAllPayments(
  token: string
): Promise<PembayaranRecord[]> {
  const response = await fetch(`${API_URL}/pembayaran`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Gagal mendapatkan daftar pembayaran");
  }

  return response.json();
}
