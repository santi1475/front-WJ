export interface IPermission {
  id: number;
  name: string;
  codename: string;
  content_type: number;
}

export interface IRole {
  id: number;
  name: string;
  permissions: number[]; // El backend devuelve IDs
}

export interface IRolePopulated extends Omit<IRole, 'permissions'> {
  permissions: IPermission[]; // Para el frontend usamos objetos completos
}

export interface IRoleFormData {
  name: string;
  permissions: number[];
}

// Interfaces de Respuesta del API (Basadas en tu views.py)
export interface IApiResponse<T> {
  code: number;
  status?: string;
  message?: string;
  data: T;
}

export interface IApiListResponse<T> {
  code: number;
  status: string;
  count: number;
  data: T[];
}