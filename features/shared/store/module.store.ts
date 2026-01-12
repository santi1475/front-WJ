import { axiosClient } from "@/lib/axios-client"
import type { PaginatedResponse } from "../types/entities"

export interface CRUDServiceConfig {
  baseUrl: string
  resourceName: string
}

export class CRUDService<T extends { id?: number }> {
  private config: CRUDServiceConfig

  constructor(config: CRUDServiceConfig) {
    this.config = config
  }

  private getUrl(action?: string) {
    const base = `${this.config.baseUrl}${this.config.resourceName}/`
    return action ? `${base}${action}/` : base
  }

  async list(filters?: Record<string, any>): Promise<PaginatedResponse<T>> {
    const response = await axiosClient.get<PaginatedResponse<T>>(this.getUrl(), { params: filters })
    return response.data
  }

  async get(id: number): Promise<T> {
    const response = await axiosClient.get<T>(`${this.getUrl()}${id}/`)
    return response.data
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await axiosClient.post<T>(this.getUrl(), data)
    return response.data
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const response = await axiosClient.put<T>(`${this.getUrl()}${id}/`, data)
    return response.data
  }

  async patch(id: number, data: Partial<T>): Promise<T> {
    const response = await axiosClient.patch<T>(`${this.getUrl()}${id}/`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`${this.getUrl()}${id}/`)
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await axiosClient.post(this.getUrl("bulk-delete"), { ids })
  }

  async search(query: string): Promise<T[]> {
    const response = await axiosClient.get<T[]>(this.getUrl("search"), {
      params: { q: query },
    })
    return response.data
  }
}
