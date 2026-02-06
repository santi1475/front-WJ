export interface IResponsable {
  id: number;
  nombre: string;
  celular?: string;
  activo: boolean;
  created_at?: string;
}

export interface IResponsableFormData {
  nombre: string;
  celular?: string;
  activo: boolean;
}
