// services/order.service.ts

import { API_URL } from "./auth.service";

// =====================
// HELPER GET TOKEN
// =====================
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL ORDERS
// =====================
export async function getAllOrders() {
  const response = await fetch(`${API_URL}/pesanan`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal mengambil data order: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

// =================----
// EXPORT TO EXCEL
// =================----
export async function exportOrderToExcel() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Belum login");
  }

  const response = await fetch(`${API_URL}/pesanan/export/excel`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gagal export order ke Excel: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // Convert response to blob and trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const contentDisposition = response.headers.get('content-disposition');
  let fileName = `data-pesanan-${new Date().toISOString().split('T')[0]}.xlsx`;
  
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    if (fileNameMatch != null) {
      fileName = fileNameMatch[1];
    }
  }
  
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}