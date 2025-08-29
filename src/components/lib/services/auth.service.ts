// services/auth.service.ts


export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// =====================
// REGISTER
// =====================
export async function register(
  username: string,
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error("Gagal register");
  }

  return response.json();
}

// =====================
// LOGIN
// =====================
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Gagal login");
  }

  const data = await response.json();
  // simpan token ke localStorage
  localStorage.setItem("token", data.token);
  return data;
}

// =====================
// LOGOUT
// =====================
export async function logout() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  localStorage.removeItem("token"); // hapus token
  if (!response.ok) {
    throw new Error("Gagal logout");
  }

  return response.json();
}

// =====================
// GET PROFILE
// =====================
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Belum login");

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Gagal ambil profile");
  }

  const data = await response.json();

  // Flatten biar gampang diakses
  return {
    ...data.user,
    token: data.token,
  };
}


// =====================
// LOGIN GOOGLE
// =====================
export function googleLogin() {
  window.location.href = `${API_URL}/auth/google`;
}
