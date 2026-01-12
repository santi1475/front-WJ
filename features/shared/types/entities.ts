export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ListFilters {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: string | number | undefined; // Permite filtros adicionales pero controlados
}

export interface EntityState<T> {
  items: T[]
  total: number
  loading: boolean
  error: string | null
  filters: ListFilters
}

export interface ICRUDService<T, CreateDTO, UpdateDTO> {
  list: (params?: ListFilters) => Promise<PaginatedResponse<T>>;
  create: (data: CreateDTO) => Promise<T>;
  update: (id: string | number, data: UpdateDTO) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
}