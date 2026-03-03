import { axiosClient } from "@/lib/axios-client";
import { ITipoRegimenLaboral } from "@/features/shared/types";

export const tipoRegimenLaboralService = {
  getAll: async (): Promise<ITipoRegimenLaboral[]> => {
    const { data } = await axiosClient.get<ITipoRegimenLaboral[]>(
      "/api/gestion/tipos-regimen-laboral/",
    );
    return data;
  },
};
