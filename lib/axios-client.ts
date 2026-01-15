import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "./store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

let axiosInstance: AxiosInstance | null = null;

export const getAxiosInstance = (): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { tokens } = useAuthStore.getState();
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
          console.log("Token agregado al request:", config.method?.toUpperCase(), config.url);
        } else {
          console.warn("No hay token disponible para:", config.method?.toUpperCase(), config.url);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log("Error 401 detectado");
          originalRequest._retry = true;
          const { tokens, updateTokens, clearAuth } = useAuthStore.getState();

          if (tokens?.refresh) {
            try {
              console.log("Intentando refrescar token con refresh token");
              const response = await axios.post(
                `${API_BASE_URL}/api/auth/token/refresh/`,
                {
                  refresh: tokens.refresh,
                }
              );

              const newTokens = {
                access: response.data.access,
                refresh: response.data.refresh || tokens.refresh,
              };

              updateTokens(newTokens);
              console.log("Token refrescado exitosamente");

              if (axiosInstance) {
                originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              console.error("Error al refrescar token:", refreshError);
              clearAuth();
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              return Promise.reject(refreshError);
            }
          } else {
            console.warn("No hay refresh token disponible, redirigiendo al login");
            clearAuth();
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return axiosInstance;
};

export const axiosClient = getAxiosInstance();
