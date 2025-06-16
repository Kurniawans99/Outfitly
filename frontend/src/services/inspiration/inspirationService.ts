import axios from "axios";
import { InspirationPost } from "./inspiration.types";

// Gunakan base URL dari environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL + "/inspiration";

// Helper untuk membuat instance axios dengan token otentikasi
const getAuthApi = () => {
  const token = localStorage.getItem("authToken");
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

interface GetPostsParams {
  sort?: 'popular' | 'newest';
  tags?: string;
  search?: string;
}

// Mengambil semua postingan inspirasi dengan filter
export const getAllInspirationPosts = async (params: GetPostsParams): Promise<InspirationPost[]> => {
  const api = getAuthApi();
  const response = await api.get("/", { params });
  return response.data.data;
};

// Mengambil detail satu postingan
export const getInspirationPostById = async (postId: string): Promise<InspirationPost> => {
    const api = getAuthApi();
    const response = await api.get(`/${postId}`);
    return response.data.data;
};

// Toggle like pada postingan
export const toggleLike = async (postId: string): Promise<InspirationPost> => {
    const api = getAuthApi();
    const response = await api.post(`/${postId}/like`);
    return response.data.data;
};

// Toggle save/bookmark pada postingan
export const toggleSave = async (postId: string): Promise<InspirationPost> => {
    const api = getAuthApi();
    const response = await api.post(`/${postId}/save`);
    return response.data.data;
};

// Menambah komentar baru
export const addComment = async (postId: string, content: string): Promise<InspirationPost> => {
    const api = getAuthApi();
    const response = await api.post(`/${postId}/comments`, { content });
    return response.data.data;
}

export const createInspirationPost = async (formData: FormData): Promise<InspirationPost> => {
    const token = localStorage.getItem("authToken");
    // Untuk multipart/form-data, kita perlu setup header secara khusus
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
    const response = await api.post("/", formData);
    return response.data.data;
}