import { getAxiosInstance } from "@/lib/axios-client";
import type { ICliente, IClienteFormData } from "@/features/shared/types";

const API_ENDPOINT = "/api/clientes";

    export const clientesService = {
    // Get all clients
    getAll: async () => {
        const axios = getAxiosInstance();
        const response = await axios.get<ICliente[]>(API_ENDPOINT);
        return response.data;
    },

    // Get single client
    getById: async (ruc: string) => {
        const axios = getAxiosInstance();
        const response = await axios.get<ICliente>(`${API_ENDPOINT}/${ruc}/`);
        return response.data;
    },

    // Create client
    create: async (data: IClienteFormData) => {
        const axios = getAxiosInstance();
        const response = await axios.post<ICliente>(API_ENDPOINT, data);
        return response.data;
    },

    // Update client
    update: async (ruc: string, data: IClienteFormData) => {
        const axios = getAxiosInstance();
        const response = await axios.put<ICliente>(`${API_ENDPOINT}/${ruc}/`, data);
        return response.data;
    },

    // Delete client
    delete: async (ruc: string) => {
        const axios = getAxiosInstance();
        await axios.delete(`${API_ENDPOINT}/${ruc}/`);
    },

    // Get statistics
    getStats: async () => {
        const axios = getAxiosInstance();
        const response = await axios.get<{
        total_activos: number;
        ingresos_totales: string;
        pendientes_declaracion: number;
        }>(`${API_ENDPOINT}/statistics/`);
        return response.data;
    },
    };
