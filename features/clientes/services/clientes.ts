import { getAxiosInstance } from "@/lib/axios-client";
import type {
  ICliente,
  IClienteFormData,
  IHistorialBaja,
  RegimenTributario,
} from "@/features/shared/types";
import type {
  PaginatedResponse,
  ICRUDService,
} from "@/features/shared/types/entities";
import type { AxiosError } from "axios";

const API_ENDPOINT = "/api/gestion/clientes";

export interface IClientStats {
  total_activos: number;
  ingresos_totales: string;
  pendientes_declaracion: number;
}

export interface IClientFilters {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  estado?: boolean;
  categoria?: "A" | "B" | "C" | "N/T";
  regimen_tributario?: RegimenTributario;
  responsable?: number;
}

export interface IClientServiceError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

const clientesServiceImplementation: ICRUDService<
  ICliente,
  IClienteFormData,
  IClienteFormData
> & {
  getAll: (
    url?: string,
    searchStr?: string,
  ) => Promise<PaginatedResponse<ICliente>>;
  getAllForDashboard: (
    url?: string,
    searchStr?: string,
  ) => Promise<PaginatedResponse<ICliente>>;
  getById: (ruc: string) => Promise<ICliente>;
  getStats: () => Promise<IClientStats>;
  search: (query: string) => Promise<ICliente[]>;
  getByStatus: (activo: boolean) => Promise<ICliente[]>;
  getByCategory: (categoria: "A" | "B" | "C" | "N/T") => Promise<ICliente[]>;
  getByRegimen: (regimen: RegimenTributario) => Promise<ICliente[]>;
  partialUpdate: (
    ruc: string,
    data: Partial<IClienteFormData>,
  ) => Promise<ICliente>;
  exportSelected: (rucs: string[]) => Promise<Blob>;
  exportAll: (searchQuery?: string) => Promise<Blob>;
  darBaja: (id: string | number) => Promise<void>;
  reactivar: (id: string | number) => Promise<void>;
  getBajas: () => Promise<ICliente[]>;
  getHistorialBajas: () => Promise<IHistorialBaja[]>;
} = {
  list: async (
    params?: IClientFilters,
  ): Promise<PaginatedResponse<ICliente>> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<PaginatedResponse<ICliente>>(
        API_ENDPOINT,
        { params },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error("Error al listar clientes:", axiosError.response?.data);
      throw error;
    }
  },

  getAll: async (
    url?: string,
    searchStr?: string,
  ): Promise<PaginatedResponse<ICliente>> => {
    try {
      const axios = getAxiosInstance();
      if (
        url &&
        url.startsWith("http://") &&
        window.location.protocol === "https:"
      ) {
        url = url.replace("http://", "https://");
      }

      const config =
        searchStr && !url ? { params: { search: searchStr } } : undefined;
      const targetUrl = url || `${API_ENDPOINT}/`;

      const response = await axios.get<PaginatedResponse<ICliente>>(
        targetUrl,
        config,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al obtener todos los clientes:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  getAllForDashboard: async (
    url?: string,
    searchStr?: string,
  ): Promise<PaginatedResponse<ICliente>> => {
    try {
      const axios = getAxiosInstance();
      // Resolve HTTPS for next/prev DRF pagination URLs missing it behind proxies
      if (
        url &&
        url.startsWith("http://") &&
        window.location.protocol === "https:"
      ) {
        url = url.replace("http://", "https://");
      }

      const config =
        searchStr && !url ? { params: { search: searchStr } } : undefined;
      const targetUrl = url || `${API_ENDPOINT}/dashboard-all/`;

      const response = await axios.get<PaginatedResponse<ICliente>>(
        targetUrl,
        config,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al obtener todos los clientes para dashboard:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  getById: async (ruc: string): Promise<ICliente> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<ICliente>(`${API_ENDPOINT}/${ruc}/`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        `Error al obtener cliente ${ruc}:`,
        axiosError.response?.data,
      );
      throw error;
    }
  },

  create: async (data: IClienteFormData): Promise<ICliente> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.post<ICliente>(`${API_ENDPOINT}/`, data);
      console.log("Cliente creado exitosamente:", response.data.ruc);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error("Error al crear cliente:", axiosError.response?.data);
      throw error;
    }
  },

  update: async (
    ruc: string | number,
    data: IClienteFormData,
  ): Promise<ICliente> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.put<ICliente>(
        `${API_ENDPOINT}/${ruc}/`,
        data,
      );
      console.log("Cliente actualizado exitosamente:", ruc);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        `Error al actualizar cliente ${ruc}:`,
        axiosError.response?.data,
      );
      throw error;
    }
  },

  partialUpdate: async (
    ruc: string,
    data: Partial<IClienteFormData>,
  ): Promise<ICliente> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.patch<ICliente>(
        `${API_ENDPOINT}/${ruc}/`,
        data,
      );
      console.log("Cliente actualizado parcialmente:", ruc);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        `Error al actualizar parcialmente cliente ${ruc}:`,
        axiosError.response?.data,
      );
      throw error;
    }
  },

  delete: async (ruc: string | number): Promise<void> => {
    try {
      const axios = getAxiosInstance();
      await axios.delete(`${API_ENDPOINT}/${ruc}/`);
      console.log("Cliente eliminado exitosamente:", ruc);
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        `Error al eliminar cliente ${ruc}:`,
        axiosError.response?.data,
      );
      throw error;
    }
  },

  /**
   * Obtiene estadísticas generales de clientes
   * @returns Estadísticas de clientes
   */
  getStats: async (): Promise<IClientStats> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<IClientStats>(
        `${API_ENDPOINT}/statistics/`,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al obtener estadísticas:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  search: async (query: string): Promise<ICliente[]> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<ICliente[]>(`${API_ENDPOINT}/`, {
        params: { search: query },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error("Error al buscar clientes:", axiosError.response?.data);
      throw error;
    }
  },

  getByStatus: async (activo: boolean): Promise<ICliente[]> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<ICliente[]>(`${API_ENDPOINT}/`, {
        params: { estado: activo },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error("Error al filtrar por estado:", axiosError.response?.data);
      throw error;
    }
  },

  getByCategory: async (
    categoria: "A" | "B" | "C" | "N/T",
  ): Promise<ICliente[]> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<ICliente[]>(`${API_ENDPOINT}/`, {
        params: { categoria },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al filtrar por categoría:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  getByRegimen: async (regimen: RegimenTributario): Promise<ICliente[]> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<ICliente[]>(`${API_ENDPOINT}/`, {
        params: { regimen_tributario: regimen },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error("Error al filtrar por régimen:", axiosError.response?.data);
      throw error;
    }
  },

  exportSelected: async (rucs: string[]): Promise<Blob> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.post(
        `${API_ENDPOINT}/exportar-seleccion/`,
        { rucs },
        { responseType: "blob" },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al exportar clientes seleccionados:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  exportAll: async (searchQuery?: string): Promise<Blob> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get(`${API_ENDPOINT}/exportar-filtro/`, {
        params: searchQuery ? { search: searchQuery } : undefined,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al exportar todos los clientes:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  darBaja: async (id: string | number): Promise<void> => {
    try {
      const axios = getAxiosInstance();
      await axios.post(`${API_ENDPOINT}/${id}/dar-baja/`);
      console.log("Cliente dado de baja exitosamente:", id);
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        `Error al dar de baja cliente ${id}:`,
        axiosError.response?.data,
      );
      throw error;
    }
  },

  reactivar: async (id: string | number): Promise<void> => {
    try {
      const axios = getAxiosInstance();
      await axios.post(`${API_ENDPOINT}/${id}/reactivar/`);
      console.log("Cliente reactivado exitosamente:", id);
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        `Error al reactivar cliente ${id}:`,
        axiosError.response?.data,
      );
      throw error;
    }
  },

  getBajas: async (): Promise<ICliente[]> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<ICliente[]>(`${API_ENDPOINT}/bajas/`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al obtener clientes dados de baja:",
        axiosError.response?.data,
      );
      throw error;
    }
  },

  getHistorialBajas: async (): Promise<IHistorialBaja[]> => {
    try {
      const axios = getAxiosInstance();
      const response = await axios.get<IHistorialBaja[]>(
        `${API_ENDPOINT}/historial-bajas/`,
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<IClientServiceError>;
      console.error(
        "Error al obtener historial de bajas:",
        axiosError.response?.data,
      );
      throw error;
    }
  },
};

export const clientesService = clientesServiceImplementation;
