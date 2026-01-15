import { axiosClient } from "@/lib/axios-client";
import type { 
  IRole, 
  IRoleFormData, 
} from "@/features/shared/types/roles";
import type { IApiResponse, IApiListResponse } from "@/features/shared/types/response";

const ROLES_ENDPOINT = "/api/auth/roles";

export const rolesService = {
  getAll: async (): Promise<IRole[]> => {
    const response = await axiosClient.get<IApiListResponse<IRole>>(`${ROLES_ENDPOINT}/`);
    return response.data.data;
  },

  create: async (data: IRoleFormData): Promise<IRole> => {
    const response = await axiosClient.post<IRole>(`${ROLES_ENDPOINT}/`, data);
    return response.data;
  },

  update: async (id: number, data: IRoleFormData): Promise<IRole> => {
    const response = await axiosClient.put<IApiResponse<IRole>>(`${ROLES_ENDPOINT}/${id}/`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete<IApiResponse<null>>(`${ROLES_ENDPOINT}/${id}/`);
  },
};