import { getAxiosInstance } from "@/lib/axios-client";
import type { IResponsable, IResponsableFormData } from "../types/responsable";

const API_ENDPOINT = "/api/gestion/responsables";

export const responsableService = {
  getAll: async (): Promise<IResponsable[]> => {
    const axios = getAxiosInstance();
    const response = await axios.get(`${API_ENDPOINT}/`);
    return response.data;
  },

  getById: async (id: number): Promise<IResponsable> => {
    const axios = getAxiosInstance();
    const response = await axios.get(`${API_ENDPOINT}/${id}/`);
    return response.data;
  },

  create: async (data: IResponsableFormData): Promise<IResponsable> => {
    const axios = getAxiosInstance();
    const response = await axios.post(`${API_ENDPOINT}/`, data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<IResponsableFormData>,
  ): Promise<IResponsable> => {
    const axios = getAxiosInstance();
    const response = await axios.patch(`${API_ENDPOINT}/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const axios = getAxiosInstance();
    await axios.delete(`${API_ENDPOINT}/${id}/`);
  },
};
