import axios from "axios";
import { ClothingItem } from "../wardrobeService"; 
import { InspoItem } from "../inspiration/inspiration.types"; 

const API_URL = import.meta.env.VITE_API_BASE_URL + "/planner";

export interface PlannedOutfitItem {
  itemType: "WardrobeItem" | "InspoItem";
  item: ClothingItem | InspoItem; // Item yang sudah di-populate
}

export interface PlannedOutfit {
  _id: string;
  user: string; // ID pengguna
  date: string; // Tanggal dalam format string ISO
  outfitName?: string;
  occasion?: string;
  items: PlannedOutfitItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanOutfitPayload {
  date: string; 
  outfitName?: string;
  occasion?: string;
  items: Array<{ itemType: "WardrobeItem" | "InspoItem"; item: string }>; // Hanya ID item
}

// Response API umum
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

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

// Mengambil outfit yang direncanakan untuk periode tertentu
export const getPlannedOutfits = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<PlannedOutfit[]>> => {
  const api = getAuthApi();
  const response = await api.get("/", {
    params: { startDate, endDate },
  });
  return response.data;
};

// Merencanakan (membuat/memperbarui) outfit
export const planOutfit = async (
  payload: PlanOutfitPayload
): Promise<ApiResponse<PlannedOutfit>> => {
  const api = getAuthApi();
  const response = await api.post("/", payload);
  return response.data;
};

// Menghapus outfit yang direncanakan
export const deletePlannedOutfit = async (
  outfitId: string
): Promise<ApiResponse<{}>> => {
  const api = getAuthApi();
  const response = await api.delete(`/${outfitId}`);
  return response.data;
};