// services/customer.service.ts

import { API_URL } from "./auth.service";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// =====================
// GET ALL CUSTOMERS
// =====================
export async function getAllCustomers() {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/users/customers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal mengambil data customer: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  // Ensure we always return an array
  const customers = Array.isArray(data) ? data : [data];
  return customers.map(item => ({
    id: item.id,
    username: item.username,
    email: item.email,
  }));
}

// =====================
// DELETE CUSTOMER
// =====================
export async function deleteCustomer(id: string) {
  const token = getToken();
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gagal menghapus customer: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return true;
}
