import axios from "axios";

export interface Wardrobe {
  _id: string;
  name: string;
  description: string;
  itemCount: number;
  itemImageUrls: string[]; // For preview
}

export interface ClothingItem {
  _id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemFromUrlPayload {
  name: string;
  category: string;
  color: string;
  tags: string[];
  notes?: string;
  imageUrl: string; // URL gambar dari item inspirasi
}

interface GetItemsResponse {
  success: boolean;
  count: number;
  data: ClothingItem[];
}

interface GetWardrobesResponse {
  success: boolean;
  count: number;
  data: Wardrobe[];
}

const API_URL = import.meta.env.VITE_API_BASE_URL + "/wardrobe";
const getAuthApi = () => {
  const token = localStorage.getItem("authToken");
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getWardrobes = async (params: {
  search?: string;
}): Promise<GetWardrobesResponse> => {
  const api = getAuthApi();
  // Assuming the endpoint for listing wardrobes is the root GET
  const response = await api.get("/lists", { params }); // Example endpoint
  return response.data;
};

export const createWardrobe = async (data: {
  name: string;
  description: string;
}) => {
  const api = getAuthApi();
  const response = await api.post("/lists", data); // Example endpoint
  return response.data;
};

export const createWardrobeItemFromUrl = async (
  wardrobeId: string,
  payload: CreateItemFromUrlPayload
) => {
  const api = getAuthApi();
  const response = await api.post(
    `/lists/${wardrobeId}/items/from-url`,
    payload
  );
  return response.data;
};

export const getWardrobeItems = async (
  wardrobeId: string,
  params: { search?: string; category?: string; color?: string }
): Promise<GetItemsResponse> => {
  const api = getAuthApi();
  // The route now includes the wardrobeId
  const response = await api.get(`/lists/${wardrobeId}/items`, { params });
  return response.data;
};

export const createWardrobeItem = async (
  wardrobeId: string,
  formData: FormData
) => {
  const api = getAuthApi();
  const response = await api.post(`/lists/${wardrobeId}/items`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getWardrobeCategories = async () => {
  const api = getAuthApi();
  const response = await api.get("/categories");
  return response.data;
};

export const updateWardrobeItem = async (id: string, formData: FormData) => {
  const api = getAuthApi();
  const response = await api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteWardrobeItem = async (id: string) => {
  const api = getAuthApi();
  const response = await api.delete(`/${id}`);
  return response.data;
};
