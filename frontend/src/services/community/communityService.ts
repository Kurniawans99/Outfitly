import axios from "axios";
import { Post } from "./community.types";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/community";

const getAuthApi = () => {
  const token = localStorage.getItem("authToken");
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      'ngrok-skip-browser-warning': '69420', 

    },
  });
};

// Mengambil semua postingan
export const getPosts = async (): Promise<Post[]> => {
  const api = getAuthApi();
  const response = await api.get("/");
  return response.data.data;
};

// Mengambil satu postingan berdasarkan ID
export const getPostById = async (postId: string): Promise<Post> => {
  const api = getAuthApi();
  const response = await api.get(`/${postId}`);
  return response.data.data;
};

// Membuat postingan baru
export const createPost = async (postData: {
  title: string;
  content: string;
  tags: string;
}): Promise<Post> => {
  const api = getAuthApi();
  const response = await api.post("/", postData);
  return response.data.data;
};

// Menambah balasan baru ke postingan
export const addReply = async (
  postId: string,
  content: string
): Promise<Post> => {
  const api = getAuthApi();
  const response = await api.post(`/${postId}/replies`, { content });
  return response.data.data;
};

// Toggle like/unlike pada postingan
export const togglePostLike = async (postId: string): Promise<Post> => {
  const api = getAuthApi();
  const response = await api.post(`/${postId}/like`);
  return response.data.data;
};

// Toggle like/unlike pada balasan
export const toggleReplyLike = async (
  postId: string,
  replyId: string
): Promise<Post> => {
  const api = getAuthApi();
  const response = await api.post(`/${postId}/replies/${replyId}/like`);
  return response.data.data;
};