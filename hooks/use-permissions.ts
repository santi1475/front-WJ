"use client";

import { useState, useEffect } from "react";
import { permissionsService } from "@/features/roles/services/permissions.service";
import type { IPermission } from "@/features/shared/types/roles";
// Eliminado: import axios from "axios" (ya no se usa)

export function usePermissions() {
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
        try {
            setIsLoading(true);
            const data = await permissionsService.getAll();
            setPermissions(data);
        } catch (err: unknown) {
            console.error("Error fetching permissions:", err);
            setError("No se pudieron cargar los permisos.");
        } finally {
            setIsLoading(false);
        }
        };

        fetchPermissions();
    }, []);

    return { permissions, isLoading, error };
}
