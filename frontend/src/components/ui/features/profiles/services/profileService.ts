import { ApiUserData, ApiResponse, UpdateProfilePayload } from "../profile.types";

const getAuthToken = (): string | null => localStorage.getItem("authToken");
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Mengambil data profil pengguna saat ini.
 * @returns Promise<ApiUserData>
 * @throws Error jika fetch gagal atau respons tidak sukses.
 */
export const fetchUserProfile = async (): Promise<ApiUserData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<ApiUserData> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to fetch profile data: ${response.status}`);
  }

  if (data.success && data.user) {
    return data.user;
  } else {
    throw new Error(data.message || "Failed to process profile data.");
  }
};

/**
 * Memperbarui data profil pengguna saat ini.
 * @param payload Data yang akan diupdate.
 * @returns Promise<ApiUserData>
 * @throws Error jika update gagal atau respons tidak sukses.
 */
export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<ApiUserData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token missing.");
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<ApiUserData> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Failed to update profile: ${response.status}`);
  }

  if (data.success && data.user) {
    return data.user;
  } else {
    throw new Error(data.message || "Failed to process updated profile data.");
  }
};

/**
 * Mengunggah file avatar baru.
 * @param file File gambar avatar.
 * @returns Promise<{ avatarUrl: string }> URL avatar baru.
 * @throws Error jika upload gagal.
 */
export const uploadAvatar = async (file: File): Promise<{ url: string; publicId?: string }> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token missing for avatar upload.");

  const formData = new FormData();
  formData.append('avatar', file); // Pastikan 'avatar' adalah nama field yang diharapkan backend

  const response = await fetch(`${API_URL}/users/me/avatar`, { // Sesuaikan endpoint jika berbeda
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data' TIDAK PERLU di-set manual untuk FormData, browser akan otomatis
    },
    body: formData,
  });

  const data: ApiResponse<{ avatar: { url: string; publicId?: string } }> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Avatar upload failed: ${response.status}`);
  }
  if (data.success && data.user && data.user.avatar) { // API Anda mungkin mengembalikan seluruh user atau hanya URL
     return data.user.avatar; // Sesuaikan ini dengan respons API Anda. Contoh jika API mengembalikan user.avatar.url
  } else if (data.success && (data as any).avatarUrl) { // Jika API mengembalikan { success: true, avatarUrl: '...' }
     return { url: (data as any).avatarUrl };
  }
  else {
    throw new Error(data.message || "Failed to process avatar upload response.");
  }
};

/**
 * Mengunggah file cover photo baru.
 * @param file File gambar cover photo.
 * @returns Promise<{ coverPhotoUrl: string }> URL cover photo baru.
 * @throws Error jika upload gagal.
 */
export const uploadCoverPhoto = async (file: File): Promise<{ url: string; publicId?: string }> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token missing for cover photo upload.");

  const formData = new FormData();
  formData.append('coverPhoto', file); // Pastikan 'coverPhoto' adalah nama field yang diharapkan backend

  const response = await fetch(`${API_URL}/users/me/cover-photo`, { // Sesuaikan endpoint jika berbeda
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data: ApiResponse<{ coverPhoto: { url: string; publicId?: string } }> = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Cover photo upload failed: ${response.status}`);
  }

  if (data.success && data.user && data.user.coverPhoto) {
     return data.user.coverPhoto;
  } else if (data.success && (data as any).coverPhotoUrl) {
     return { url: (data as any).coverPhotoUrl };
  }
   else {
    throw new Error(data.message || "Failed to process cover photo upload response.");
  }
};