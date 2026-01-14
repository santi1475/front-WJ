"use client";

import { useState, useEffect } from "react";
import { mockRoles, mockPermissions } from "@/lib/mock-data";

export function useRoles() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setRoles(mockRoles);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const addRole = (data: any) => {
    const newRole = {
      id: Math.max(...roles.map((r) => r.id), 0) + 1,
      name: data.name,
      permissions: data.permissions.map((id: number) =>
        mockPermissions.find((p) => p.id === id)
      ),
      isSystem: false,
    };
    setRoles([...roles, newRole]);
  };

  const updateRole = (roleId: number, data: any) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              name: data.name,
              permissions: data.permissions.map((id: number) =>
                mockPermissions.find((p) => p.id === id)
              ),
            }
          : role
      )
    );
  };

  const deleteRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId));
  };

  return { roles, isLoading, addRole, updateRole, deleteRole };
}
