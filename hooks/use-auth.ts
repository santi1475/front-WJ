"use client";

import { useAuthStore } from "@/lib/store";
import type { IUser } from "@/features/shared/types";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useAuthStore((state) => state.logout);

  const normalize = (p: string) => (p.includes(".") ? p.split(".")[1] : p);

  /**
   * Verifica si el usuario tiene al menos uno de los permisos requeridos
   * @param requiredPermissions - Array de permisos requeridos
   * @returns true si el usuario tiene al menos uno de los permisos o es superusuario
   */
  const hasPermission = (requiredPermissions: string[]): boolean => {
    if (!user) return false;
    if (user.is_superuser) return true;

    const userPermissions = user.permissions || [];
    const normalizedUserPermissions = userPermissions.map(normalize);

    return requiredPermissions.some((p) => {
      const normalizedReq = normalize(p);
      return (
        userPermissions.includes(p) ||
        normalizedUserPermissions.includes(normalizedReq)
      );
    });
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
    const normalizedReq = normalize(permission);

    return userPermissions.some((p) => {
      return p === permission || normalize(p) === normalizedReq;
    });
  };

  /**
   * Verifica si el usuario es admin o superadmin
   * @returns true si el usuario es superadmin o tiene id 1 (admin)
   */
  const isAdminOrSuperAdmin = (): boolean => {
    if (!user) return false;
    return user.is_superuser || user.id === 1;
  };

  return {
    user,
    isAuthenticated,
    hasPermission,
    can,
    isAdminOrSuperAdmin,
    setUser,
    clearAuth,
    logout,
  };
}
