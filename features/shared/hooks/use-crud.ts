"use client";

import { useState, useCallback } from "react";
import type {
  ListFilters,
  PaginatedResponse,
  ICRUDService,
} from "@/features/shared/types/entities";
import { AxiosError } from "axios";
import { handleApiSuccess } from "@/lib/api-utils";

interface UseCRUDOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

interface UseCRUDState<T> {
  items: T[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
}
export function useCRUD<T, K extends keyof T, C = Partial<T>, U = Partial<T>>(
  service: ICRUDService<T, C, U>,
  pkField: K, // Campo obligatorio para saber cuál es el ID (ej: 'ruc')
  options?: UseCRUDOptions
) {
  const [state, setState] = useState<UseCRUDState<T>>({
    items: [],
    total: 0,
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
  });

  // Helper para extraer el mensaje de error de Axios sin usar any
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return (
        error.response?.data?.detail || error.message || "Error desconocido"
      );
    }
    return error instanceof Error ? error.message : "Error inesperado";
  };

  const fetchList = useCallback(
    async (filters?: ListFilters) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response: PaginatedResponse<T> = await service.list({
          page: filters?.page || state.page,
          page_size: filters?.page_size || state.pageSize,
          ...filters,
        });

        setState((prev) => ({
          ...prev,
          items: response.results,
          total: response.count,
          page: filters?.page || state.page,
          loading: false,
        }));
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        setState((prev) => ({ ...prev, error: message, loading: false }));
        options?.onError?.(message);
      }
    },
    [service, state.page, state.pageSize, options]
  );

  const create = useCallback(
    async (data: C) => {
      try {
        const newItem = await service.create(data);
        setState((prev) => ({
          ...prev,
          items: [newItem, ...prev.items],
          total: prev.total + 1,
        }));
        const msg = "Creado exitosamente";
        if (options?.onSuccess) options.onSuccess(msg);
        else handleApiSuccess(msg);
        return newItem;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
        throw error;
      }
    },
    [service, options]
  );

  const update = useCallback(
    async (id: string | number, data: U) => {
      try {
        const updated = await service.update(id, data);
        setState((prev) => ({
          ...prev,
          items: prev.items.map((item) => {
            // Comparación segura accediendo a la propiedad genérica pkField
            const itemId = item[pkField] as unknown as string | number;
            return itemId === id ? updated : item;
          }),
        }));
        const msg = "Actualizado exitosamente";
        if (options?.onSuccess) options.onSuccess(msg);
        else handleApiSuccess(msg);
        return updated;
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
        throw error;
      }
    },
    [service, pkField, options]
  );

  const remove = useCallback(
    async (id: string | number) => {
      try {
        await service.delete(id);
        setState((prev) => ({
          ...prev,
          items: prev.items.filter((item) => {
            const itemId = item[pkField] as unknown as string | number;
            return itemId !== id;
          }),
          total: prev.total - 1,
        }));
        const msg = "Eliminado exitosamente";
        if (options?.onSuccess) options.onSuccess(msg);
        else handleApiSuccess(msg);
      } catch (error: unknown) {
        const message = getErrorMessage(error);
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
        throw error;
      }
    },
    [service, pkField, options]
  );

  return {
    ...state,
    fetchList,
    create,
    update,
    remove,
    setPageSize: (size: number) =>
      setState((prev) => ({ ...prev, pageSize: size })),
    setPage: (page: number) => setState((prev) => ({ ...prev, page })),
    clearError: () => setState((prev) => ({ ...prev, error: null })),
  };
}
