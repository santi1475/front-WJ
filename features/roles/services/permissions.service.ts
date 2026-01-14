import { axiosClient } from "@/lib/axios-client";
import type { IPermission } from "@/features/shared/types/roles";

const PERMISSIONS_ENDPOINT = "/api/auth/permissions";

export const permissionsService = {
    getAll: async (): Promise<IPermission[]> => {
        // PermissionViewSet por defecto devuelve un array directo []
        const response = await axiosClient.get<IPermission[]>(
        `${PERMISSIONS_ENDPOINT}/`
        );
        return response.data;
    },
};
