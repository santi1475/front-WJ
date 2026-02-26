import { getAxiosInstance } from "@/lib/axios-client";
import { ILibroSocietario } from "@/features/shared/types";

export const libroSocietarioService = {
  getAll: async (): Promise<ILibroSocietario[]> => {
    const axios = getAxiosInstance();
    const { data } = await axios.get<ILibroSocietario[]>(
      "/api/gestion/libros-societarios/",
    );
    return data;
  },
};
