"use client";

import { useAuthStore } from "@/lib/store";
import type { IUser } from "@/features/shared/types";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useAuthStore((state) => state.logout);

  /**
   * Verifica si el usuario tiene al menos uno de los permisos requeridos
   * @param requiredPermissions - Array de permisos requeridos
   * @returns true si el usuario tiene al menos uno de los permisos o es superusuario
   */
  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!user) return false;
    if (user.is_superuser) return true;

    const userPermissions = user.permissions || [];
    return requiredPermissions.some((p) => userPermissions.includes(p));
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission - Permiso a verificar
   * @returns true si el usuario tiene el permiso o es superusuario
   */
  const can = (permission: string): boolean => {
    if (!user) return false;
    if (user.is_superuser) return true;

    const userPermissions = user.permissions || [];
    return userPermissions.includes(permission);
  };

  return {
    user,
    isAuthenticated,
    hasPermission,
    can,
    setUser,
    clearAuth,
    logout,
  };
}
