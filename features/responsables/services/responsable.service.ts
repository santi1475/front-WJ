import axios from "axios";
import type { IResponsable, IResponsableFormData } from "../types/responsable";
import { useAuthStore } from "@/lib/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to get headers with auth token
const getHeaders = () => {
  const { tokens } = useAuthStore.getState();
  return {
    Authorization: `Bearer ${tokens?.access}`,
    "Content-Type": "application/json",
  };
};

export const responsableService = {
  getAll: async (): Promise<IResponsable[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/api/gestion/responsables/`,
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  },

  getById: async (id: number): Promise<IResponsable> => {
    const response = await axios.get(
      `${API_BASE_URL}/api/gestion/responsables/${id}/`,
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  },

  create: async (data: IResponsableFormData): Promise<IResponsable> => {
    const response = await axios.post(
      `${API_BASE_URL}/api/gestion/responsables/`,
      data,
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<IResponsableFormData>,
  ): Promise<IResponsable> => {
    const response = await axios.patch(
      `${API_BASE_URL}/api/gestion/responsables/${id}/`,
      data,
      {
        headers: getHeaders(),
      },
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/api/gestion/responsables/${id}/`, {
      headers: getHeaders(),
    });
  },
};
