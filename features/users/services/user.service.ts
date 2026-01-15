import { axiosClient } from "@/lib/axios-client";
import type {
    IUserManaged,
    IUserFormData,
} from "@/features/shared/types/user";
import type { IApiResponse, IApiListResponse } from "@/features/shared/types/response";


const USERS_ENDPOINT = "/api/auth/usuarios/";

export const userService = {
    getAll: async (): Promise<IUserManaged[]> => {
        const response = await axiosClient.get<IApiListResponse<IUserManaged>>(`${USERS_ENDPOINT}`);
        return response.data.data;
    },

    create: async (data: IUserFormData): Promise<IUserManaged> => {
        const response = await axiosClient.post<IUserManaged>(`${USERS_ENDPOINT}`, data);
        return response.data;
    },
    update: async (id: number, data: IUserFormData): Promise<IUserManaged> => {
        const response = await axiosClient.put<IApiResponse<IUserManaged>>(`${USERS_ENDPOINT}${id}/`, data);
        return response.data.data;
    },
    delete: async (id: number): Promise<void> => {
        await axiosClient.delete<IApiResponse<null>>(`${USERS_ENDPOINT}${id}/`);
    }
};