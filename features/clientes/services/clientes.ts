import { getAxiosInstance } from "@/lib/axios-client";
import type { ICliente, IClienteFormData } from "@/features/shared/types";
import type {
    PaginatedResponse,
    ListFilters,
    ICRUDService,
} from "@/features/shared/types/entities";

const API_ENDPOINT = "/api/gestion/clientes";

// Definimos stats interface aquí o en tipos compartidos
interface IClientStats {
    total_activos: number;
    ingresos_totales: string;
    pendientes_declaracion: number;
}

// Implementamos la interfaz ICRUDService explícitamente para asegurar compatibilidad
const clientesServiceImplementation: ICRUDService<
    ICliente,
    IClienteFormData,
    IClienteFormData
> & {
    getAll: () => Promise<ICliente[]>;
    getById: (ruc: string) => Promise<ICliente>;
    getStats: () => Promise<IClientStats>;
} = {
  // Método requerido por useCRUD para paginación
list: async (params?: ListFilters): Promise<PaginatedResponse<ICliente>> => {
    const axios = getAxiosInstance();
    const response = await axios.get<PaginatedResponse<ICliente>>(
        API_ENDPOINT,
        { params }
    );
    return response.data;
},

getAll: async (): Promise<ICliente[]> => {
    const axios = getAxiosInstance();
    // Ajusta la URL si tu backend tiene un endpoint 'all' o si el root devuelve lista sin paginar
    const response = await axios.get<ICliente[]>(`${API_ENDPOINT}/all/`);
    return response.data;
},

getById: async (ruc: string): Promise<ICliente> => {
    const axios = getAxiosInstance();
    const response = await axios.get<ICliente>(`${API_ENDPOINT}/${ruc}/`);
    return response.data;
},

create: async (data: IClienteFormData): Promise<ICliente> => {
    const axios = getAxiosInstance();
    const response = await axios.post<ICliente>(API_ENDPOINT, data);
    return response.data;
},

update: async (
    ruc: string | number,
    data: IClienteFormData
): Promise<ICliente> => {
    const axios = getAxiosInstance();
    const response = await axios.put<ICliente>(`${API_ENDPOINT}/${ruc}/`, data);
    return response.data;
},

delete: async (ruc: string | number): Promise<void> => {
    const axios = getAxiosInstance();
    await axios.delete(`${API_ENDPOINT}/${ruc}/`);
},

getStats: async (): Promise<IClientStats> => {
    const axios = getAxiosInstance();
    const response = await axios.get<IClientStats>(
        `${API_ENDPOINT}/statistics/`
    );
        return response.data;
    },
};

export const clientesService = clientesServiceImplementation;
