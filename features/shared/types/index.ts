
export interface ILoginCredentials {
  username: string
  password: string
}

export interface ILoginResponse {
  access: string
  refresh: string
  user: IUser
}

export interface IUser {
  id: number
  username: string
  email: string
  role: string; 
  permissions: string[],
  is_superuser: boolean;
}

export interface ITokens {
  access: string
  refresh: string
}

export enum RegimenTributario {
  RMT = "RMT",
  ESPECIAL = "ESPECIAL",
  RUS = "RUS",
  GENERAL = "GENERAL",
}

export enum TipoEmpresa {
  SAC = "SAC",
  EIRL = "EIRL",
  SRL = "SRL",
  SA = "SA",
  PN = "PN",
}

export interface ICredenciales {
  sol_usuario?: string
  sol_clave?: string
  detraccion_cuenta?: string
  detraccion_usuario?: string
  detraccion_clave?: string
  inei_usuario?: string
  inei_clave?: string
  afp_net_usuario?: string
  afp_net_clave?: string
  viva_essalud_usuario?: string
  viva_essalud_clave?: string
  pe?: string
}

export interface ICliente {
  ruc: string
  razon_social: string
  propietario: string
  dni_propietario?: string
  estado: boolean
  codigo_control?: number
  responsable?: number
  regimen_tributario: RegimenTributario
  tipo_empresa: TipoEmpresa
  categoria?: "A" | "B" | "C"
  regimen_laboral_tipo?: string
  regimen_laboral_fecha?: string
  ingresos_mensuales: string
  ingresos_anuales: string
  libros_societarios: number
  selectivo_consumo: boolean
  credenciales: ICredenciales
}

export interface IClienteFormData extends Omit<ICliente, "credenciales"> {
  credenciales?: ICredenciales
}

export interface ModuleConfig {
  id: string
  name: string
  path: string
  icon: string
  description: string
  requiredRoles?: string[]; 
  requiredPermissions?: string[]; 
  hasCreatePermission?: boolean
  hasEditPermission?: boolean
  hasDeletePermission?: boolean
}

export type ModuleRegistry = Record<string, ModuleConfig>
