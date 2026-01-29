import { getAxiosInstance } from "@/lib/axios-client";

export interface ITipoRegimenLaboral {
  id: number;
  descripcion: string;
}

export const regimenLaboralService = {
  getAll: async (): Promise<ITipoRegimenLaboral[]> => {
    const axios = getAxiosInstance();
    try {
      console.log(
        "Fetching Regimen Types from:",
        "/api/gestion/tipos-regimen-laboral/",
      );
      const { data } = await axios.get<ITipoRegimenLaboral[]>(
        "/api/gestion/tipos-regimen-laboral/",
      );
      console.log("Regimen Types loaded:", data);
      return data;
    } catch (error) {
      console.error("Error fetching Regimen Types:", error);
      throw error;
    }
  },
};
