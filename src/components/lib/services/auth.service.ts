// services/auth.service.ts

// Shared user profile shape used across pages
export type UserProfile = {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  role?: { id: string; name: string } | null;
  // Optional stats if backend adds later
  stats?: { orders: number; favorites: number; reviews: number };
};
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
  // Ambil token dari berbagai kemungkinan field
  const token = data.token || data.access_token || data.accessToken;
  if (!token) {
    throw new Error("Token tidak ditemukan");
  }
  // simpan token ke localStorage
  localStorage.setItem("token", token);
  return { ...data, token };
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
export async function getProfile(): Promise<UserProfile & { token?: string }> {
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
  const result = {
    ...data.user,
    token: data.token || data.access_token || data.accessToken,
  };
  // Persist userId for legacy links/uses
  if (data?.user?.id) {
    try { localStorage.setItem("userId", String(data.user.id)); } catch {}
  }
  return result;
}


// =====================
// LOGIN GOOGLE
// =====================
export function googleLogin() {
  window.location.href = `${API_URL}/auth/google`;
}

// =====================
// FORGOT PASSWORD
// =====================
export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Gagal kirim OTP");
  }

  return response.json();
}

// =====================
// VERIFY OTP
// =====================
export async function verifyOtp(email: string, otp: string) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    throw new Error("OTP tidak valid");
  }

  return response.json();
}

// =====================
// RESET PASSWORD
// =====================
export async function resetPassword(email: string, otp: string, newPassword: string) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  if (!response.ok) {
    throw new Error("Gagal reset password");
  }

  return response.json();
}

// =====================
// GET PROFILE BY USER ID
// =====================
export async function getProfileByUserId(userId: string): Promise<UserProfile> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Belum login");

  try {
    // Fast-path: if the requested id is the same as the current user's id, just return self profile
    let self: (UserProfile & { token?: string }) | null = null;
    try {
      self = await getProfile();
      if (self && String(self.id) === String(userId)) {
        return {
          id: self.id,
          username: self.username,
          email: self.email,
          phone: self.phone ?? null,
          role: self.role ?? null,
        };
      }
    } catch {
      // ignore self fetch error; continue to try users/:id
    }

    // Coba endpoint langsung dulu
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        phone: data.phone ?? null,
        role: data.role ?? null,
      };
    }

    // Jika endpoint tidak ada (404) atau tidak authorized (401/403), coba ambil profile sendiri
    if ([404, 401, 403].includes(response.status)) {
      if (self) {
        return {
          id: self.id,
          username: self.username,
          email: self.email,
          phone: self.phone ?? null,
          role: self.role ?? null,
        };
      }
      const profile = await getProfile();
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        phone: profile.phone ?? null,
        role: profile.role ?? null,
      };
    }

    // Jika bukan 404, throw error asli
    if (response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`Gagal mengambil profile: ${response.status} ${errorText}`);
    }

    throw new Error("User tidak ditemukan");
  } catch (error: any) {
    if (error.message === "User tidak ditemukan") {
      throw error;
    }
    throw new Error(`Gagal mengambil profile: ${error.message}`);
  }
}
