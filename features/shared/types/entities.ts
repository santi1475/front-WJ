export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ListFilters {
  search?: string
  page?: number
  page_size?: number
  ordering?: string
  [key: string]: any
}

export interface EntityState<T> {
  items: T[]
  total: number
  loading: boolean
  error: string | null
  filters: ListFilters
}
