"use client";

import { useState, useCallback } from "react";
import type { ListFilters } from "../types/entities";

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

export function useCRUD<T extends { id?: number }>(
  service: any,
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

  const fetchList = useCallback(
    async (filters?: ListFilters) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await service.list({
          page: filters?.page || state.page,
          page_size: filters?.page_size || state.pageSize,
          ...filters,
        } as any);

        setState((prev) => ({
          ...prev,
          items: response.results,
          total: response.count,
          page: filters?.page || state.page,
          loading: false,
        }));
      } catch (error: any) {
        const message = error.response?.data?.detail || "Error al cargar datos";
        setState((prev) => ({ ...prev, error: message, loading: false }));
        options?.onError?.(message);
      }
    },
    [service, state.page, state.pageSize, options]
  );

  const create = useCallback(
    async (data: Partial<T>) => {
      try {
        const newItem = await service.create(data);
        setState((prev) => ({
          ...prev,
          items: [newItem, ...prev.items],
          total: prev.total + 1,
        }));
        options?.onSuccess?.("Creado exitosamente");
        return newItem;
      } catch (error: any) {
        const message =
          error.response?.data?.detail || "Error al crear registro";
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
        throw error;
      }
    },
    [service, options]
  );

  const update = useCallback(
    async (id: number, data: Partial<T>) => {
      try {
        const updated = await service.update(id, data);
        setState((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            (item as any).id === id ? updated : item
          ),
        }));
        options?.onSuccess?.("Actualizado exitosamente");
        return updated;
      } catch (error: any) {
        const message =
          error.response?.data?.detail || "Error al actualizar registro";
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
        throw error;
      }
    },
    [service, options]
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await service.delete(id);
        setState((prev) => ({
          ...prev,
          items: prev.items.filter((item) => (item as any).id !== id),
          total: prev.total - 1,
        }));
        options?.onSuccess?.("Eliminado exitosamente");
      } catch (error: any) {
        const message =
          error.response?.data?.detail || "Error al eliminar registro";
        setState((prev) => ({ ...prev, error: message }));
        options?.onError?.(message);
        throw error;
      }
    },
    [service, options]
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
