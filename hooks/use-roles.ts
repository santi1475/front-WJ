"use client";

import { useState, useEffect, useCallback } from "react";
import { rolesService } from "@/features/roles/services/roles.service";
import { usePermissions } from "@/hooks/use-permissions";
import type { IRole, IRolePopulated, IRoleFormData } from "@/features/shared/types/roles";
import { toast } from "sonner"; // Asumiendo que usas sonner o algún toast

export function useRoles() {
  const [roles, setRoles] = useState<IRolePopulated[]>([]);
  const [rawRoles, setRawRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Necesitamos los permisos para "popular" los roles (convertir IDs a objetos)
  const { permissions: allPermissions, isLoading: isLoadingPermissions } = usePermissions();

  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await rolesService.getAll();
      setRawRoles(data);
    } catch (error) {
      console.error("Error al cargar roles:", error);
      toast.error("Error al cargar la lista de roles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto inicial para cargar roles
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Efecto para combinar roles con permisos cuando ambos estén cargados
  useEffect(() => {
    if (!isLoading && !isLoadingPermissions && rawRoles.length > 0 && allPermissions.length > 0) {
      const populatedRoles: IRolePopulated[] = rawRoles.map((role) => ({
        ...role,
        permissions: role.permissions
          .map((permId) => allPermissions.find((p) => p.id === permId))
          .filter((p): p is typeof p & object => p !== undefined), // Filtrar undefined
      }));
      setRoles(populatedRoles);
    } else if (rawRoles.length === 0) {
        setRoles([]);
    }
  }, [rawRoles, allPermissions, isLoading, isLoadingPermissions]);

  const addRole = async (data: IRoleFormData) => {
    try {
      await rolesService.create(data);
      toast.success("Rol creado exitosamente");
      fetchRoles(); // Recargar la lista
    } catch (error) {
      console.error("Error creando rol:", error);
      toast.error("No se pudo crear el rol");
      throw error;
    }
  };

  const updateRole = async (roleId: number, data: IRoleFormData) => {
    try {
      await rolesService.update(roleId, data);
      toast.success("Rol actualizado exitosamente");
      fetchRoles(); // Recargar la lista
    } catch (error) {
      console.error("Error actualizando rol:", error);
      toast.error("No se pudo actualizar el rol");
      throw error;
    }
  };

  const deleteRole = async (roleId: number) => {
    try {
      await rolesService.delete(roleId);
      toast.success("Rol eliminado exitosamente");
      // Actualización optimista o recarga
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      setRawRoles((prev) => prev.filter((r) => r.id !== roleId));
    } catch (error) {
      console.error("Error eliminando rol:", error);
      toast.error("No se pudo eliminar el rol. Verifique si tiene usuarios asignados.");
    }
  };

  return { 
    roles, 
    isLoading: isLoading || isLoadingPermissions, 
    addRole, 
    updateRole, 
    deleteRole 
  };
}