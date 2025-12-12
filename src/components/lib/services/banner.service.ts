import { API_URL } from "./auth.service";

export type LinkType = "product" | "brand" | "category";

export type Banner = {
  id: string;
  title: string | null;
  image_url: string | null;
  link_type: LinkType;
  link_value: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBannerDto = {
  title?: string;
  image_url?: string;
  link_type: LinkType;
  link_value: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  image?: File;
};

export type UpdateBannerDto = {
  title?: string;
  image_url?: string;
  link_type?: LinkType;
  link_value?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  image?: File;
};

export async function getActiveBanners(): Promise<Banner[]> {
  const response = await fetch(`${API_URL}/banners`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Gagal memuat banner");
  }

  return response.json();
}

export async function getAllBanners(token: string): Promise<Banner[]> {
  const response = await fetch(`${API_URL}/banners/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal memuat semua banner");
  }

  return response.json();
}

export async function getBannerById(id: string): Promise<Banner> {
  const response = await fetch(`${API_URL}/banners/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Gagal memuat detail banner");
  }

  return response.json();
}

export async function createBanner(
  data: CreateBannerDto,
  token: string
): Promise<Banner> {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  formData.append("link_type", data.link_type);
  formData.append("link_value", data.link_value);
  if (data.is_active !== undefined)
    formData.append("is_active", String(data.is_active));
  if (data.start_date) formData.append("start_date", data.start_date);
  if (data.end_date) formData.append("end_date", data.end_date);
  if (data.image) formData.append("image", data.image);

  const response = await fetch(`${API_URL}/banners`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal membuat banner");
  }

  return response.json();
}

export async function updateBanner(
  id: string,
  data: UpdateBannerDto,
  token: string
): Promise<Banner> {
  const formData = new FormData();

  if (data.title !== undefined) formData.append("title", data.title);
  if (data.link_type) formData.append("link_type", data.link_type);
  if (data.link_value) formData.append("link_value", data.link_value);
  if (data.is_active !== undefined)
    formData.append("is_active", String(data.is_active));
  if (data.start_date !== undefined)
    formData.append("start_date", data.start_date);
  if (data.end_date !== undefined) formData.append("end_date", data.end_date);
  if (data.image) formData.append("image", data.image);

  const response = await fetch(`${API_URL}/banners/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal mengupdate banner");
  }

  return response.json();
}

export async function deleteBanner(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/banners/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Gagal menghapus banner");
  }
}
