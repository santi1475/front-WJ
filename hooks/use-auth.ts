"use client"

import { useAuthStore } from "@/lib/store"
import type { IUser } from "@/features/shared/types"

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const setUser = useAuthStore((state) => state.setUser)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const logout = useAuthStore((state) => state.logout)

  const isAdmin = user?.role === "ADMIN" || user?.is_superuser === true;
  const isContador = user?.role === "CONTADOR"
  const isAsistente = user?.role === "ASISTENTE"

  const can = (requiredRole: IUser["role"]) => {
    if (user?.is_superuser) return true;
    const roleHierarchy: Record<IUser["role"], number> = {
      ADMIN: 3,
      CONTADOR: 2,
      ASISTENTE: 1,
    }
    return roleHierarchy[user?.role || "ASISTENTE"] >= roleHierarchy[requiredRole]
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isContador,
    isAsistente,
    can,
    setUser,
    clearAuth,
    logout,
  }
}
