import axios, { type AxiosError } from "axios"
import type { ILoginCredentials, ILoginResponse } from "@/features/shared/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const AUTH_ENDPOINT = "/api/auth"

export const authService = {
  login: async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
    const loginUrl = `${API_BASE_URL}${AUTH_ENDPOINT}/token/`
    console.log("🔐 Login URL:", loginUrl)
    console.log("📤 Credentials:", credentials)
    try {
      const response = await axios.post<ILoginResponse>(loginUrl, credentials)
      console.log("✅ Login Response:", response.data)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error("❌ Login Error:", axiosError.response?.status, axiosError.response?.data)
      throw error
    }
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
