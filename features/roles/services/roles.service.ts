import { axiosClient } from "@/lib/axios-client";
import type { 
  IRole, 
  IRoleFormData, 
  IApiResponse, 
  IApiListResponse 
} from "@/features/shared/types/roles";

const ROLES_ENDPOINT = "/api/auth/roles";

export const rolesService = {
  getAll: async (): Promise<IRole[]> => {
    // El endpoint list devuelve: { code, status, count, data: [...] }
    const response = await axiosClient.get<IApiListResponse<IRole>>(`${ROLES_ENDPOINT}/`);
    return response.data.data;
  },

  create: async (data: IRoleFormData): Promise<IRole> => {
    // El create usa super().create(), por lo que devuelve el objeto IRole directo (status 201)
    const response = await axiosClient.post<IRole>(`${ROLES_ENDPOINT}/`, data);
    return response.data;
  },

  update: async (id: number, data: IRoleFormData): Promise<IRole> => {
    // El update devuelve: { code, message, data: { ... } }
    const response = await axiosClient.put<IApiResponse<IRole>>(`${ROLES_ENDPOINT}/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    // El destroy devuelve: { code, message }
    await axiosClient.delete<IApiResponse<null>>(`${ROLES_ENDPOINT}/${id}/`);
  },
};