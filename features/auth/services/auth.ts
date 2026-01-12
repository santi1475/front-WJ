import axios from "axios"
import type { ILoginCredentials, ILoginResponse } from "@/features/shared/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const AUTH_ENDPOINT = "/api/auth"

export const authService = {
  login: async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    const response = await axios.post<ILoginResponse>(`${API_BASE_URL}${AUTH_ENDPOINT}/login/`, credentials)
    return response.data
  },

  logout: async () => {
    // Optional: notify backend about logout
    try {
      await axios.post(`${API_BASE_URL}${AUTH_ENDPOINT}/logout/`)
    } catch (error) {
      console.error("Logout error:", error)
    }
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axios.post(`${API_BASE_URL}${AUTH_ENDPOINT}/token/refresh/`, {
      refresh: refreshToken,
    })
    return response.data
  },
}
