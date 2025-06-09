import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/wardrobe"; //

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

export const getWardrobeItems = async (params: GetItemsParams) => {
  const api = getAuthApi();
  const response = await api.get("/", { params });
  return response.data;
};

export const createWardrobeItem = async (formData: FormData) => {
  const api = getAuthApi();
  const response = await api.post("/", formData);
  return response.data;
};

export const updateWardrobeItem = async (id: string, formData: FormData) => {
  const api = getAuthApi();
  const response = await api.put(`/${id}`, formData);
  return response.data;
};

export const deleteWardrobeItem = async (id: string) => {
  const api = getAuthApi();
  const response = await api.delete(`/${id}`);
  return response.data;
};
