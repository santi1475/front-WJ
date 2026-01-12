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
          originalRequest._retry = true;
          const { tokens, updateTokens, clearAuth } = useAuthStore.getState();

          if (tokens?.refresh) {
            try {
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

              if (axiosInstance) {
                originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              clearAuth();
              if (typeof window !== "undefined") {
                window.location.href = "/login";
              }
              return Promise.reject(refreshError);
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
