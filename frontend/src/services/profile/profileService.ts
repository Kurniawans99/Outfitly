import axios from "axios";
import { ApiUserData, ApiResponse, UpdateProfilePayload } from "./profile.types";

const getAuthToken = (): string | null => localStorage.getItem("authToken");
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Mengambil data profil pengguna saat ini.
 * @returns Promise<ApiUserData>
 * @throws Error jika request gagal atau respons tidak sukses.
 */
export const fetchUserProfile = async (): Promise<ApiUserData> => {
  try {
    const response = await api.get<ApiResponse<ApiUserData>>("/user/me");

    // Axios secara otomatis melempar error untuk status non-2xx, jadi kita tidak perlu memeriksa response.ok
    if (response.data.success && response.data.user) {
      return response.data.user;
    } else {
      throw new Error(response.data.message || "Failed to process profile data.");
    }
  } catch (error: any) {
    // Tangani error dari Axios (misalnya, network error, status code non-2xx)
    throw new Error(error.response?.data?.message || error.message || "Failed to fetch profile data.");
  }
};

/**
 * Memperbarui data profil pengguna saat ini.
 * @param payload Data yang akan diupdate.
 * @returns Promise<ApiUserData>
 * @throws Error jika update gagal atau respons tidak sukses.
 */
export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<ApiUserData> => {
  try {
    const response = await api.put<ApiResponse<ApiUserData>>("/user/me", payload);

    if (response.data.success && response.data.user) {
      return response.data.user;
    } else {
      throw new Error(response.data.message || "Failed to process updated profile data.");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update profile.");
  }
};

/**
 * Mengunggah file avatar baru.
 * @param file File gambar avatar.
 * @returns Promise<{ url: string; publicId?: string }> URL avatar baru.
 * @throws Error jika upload gagal.
 */
export const uploadAvatar = async (file: File): Promise<{ url: string; publicId?: string }> => {
  const formData = new FormData();
  formData.append("avatar", file); // Pastikan 'avatar' adalah nama field yang diharapkan backend

  try {
    // Axios akan secara otomatis mengatur Content-Type menjadi 'multipart/form-data' untuk FormData
    const response = await api.put<ApiResponse<{ avatar: { url: string; publicId?: string } }>>(
      "/user/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // eksplisit agar lebih jelas, meskipun Axios akan otomatis
        },
      }
    );

    if (response.data.success && response.data.user && response.data.user.avatar) {
      return response.data.user.avatar;
    } else if (response.data.success && (response.data as any).avatarUrl) {
      // Jika API mengembalikan { success: true, avatarUrl: '...' }
      return { url: (response.data as any).avatarUrl };
    } else {
      throw new Error(response.data.message || "Failed to process avatar upload response.");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Avatar upload failed.");
  }
};

/**
 * Mengunggah file cover photo baru.
 * @param file File gambar cover photo.
 * @returns Promise<{ coverPhotoUrl: string }> URL cover photo baru.
 * @throws Error jika upload gagal.
 */
export const uploadCoverPhoto = async (file: File): Promise<{ url: string; publicId?: string }> => {
  const formData = new FormData();
  formData.append("coverPhoto", file); // Pastikan 'coverPhoto' adalah nama field yang diharapkan backend

  try {
    const response = await api.put<ApiResponse<{ coverPhoto: { url: string; publicId?: string } }>>(
      "/user/me/coverphoto",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success && response.data.user && response.data.user.coverPhoto) {
      return response.data.user.coverPhoto;
    } else if (response.data.success && (response.data as any).coverPhotoUrl) {
      return { url: (response.data as any).coverPhotoUrl };
    } else {
      throw new Error(response.data.message || "Failed to process cover photo upload response.");
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Cover photo upload failed.");
  }
};