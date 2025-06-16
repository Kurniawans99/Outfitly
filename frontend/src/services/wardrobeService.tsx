import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/wardrobe";

export interface WardrobeItem {
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

interface GetItemsResponse {
  success: boolean;
  count: number;
  data: WardrobeItem[];
}

const getAuthApi = () => {
  const token = localStorage.getItem("authToken");
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

interface GetItemsParams {
  search?: string;
  category?: string;
  color?: string;
}

export const getWardrobeCategories = async () => {
  const api = getAuthApi();
  const response = await api.get("/categories");
  return response.data;
};

export const getWardrobeItems = async (
  params: GetItemsParams
): Promise<GetItemsResponse> => {
  const api = getAuthApi();
  const response = await api.get("/", { params });
  return response.data;
};

export const createWardrobeItem = async (formData: FormData) => {
  const api = getAuthApi();
  // Set header untuk form data secara eksplisit
  const response = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateWardrobeItem = async (id: string, formData: FormData) => {
  const api = getAuthApi();
  // Set header untuk form data secara eksplisit
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
