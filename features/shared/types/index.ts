export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
  user: IUser;
  permissions: string[];
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  is_superuser: boolean;
}

export interface ITokens {
  access: string;
  refresh: string;
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
  sol_usuario?: string;
  sol_clave?: string;
  detraccion_cuenta?: string;
  detraccion_usuario?: string;
  detraccion_clave?: string;
  inei_usuario?: string;
  inei_clave?: string;
  afp_net_usuario?: string;
  afp_net_clave?: string;
  viva_essalud_usuario?: string;
  viva_essalud_clave?: string;
  sis_usuario?: string;
  sis_clave?: string;
  pe?: string;
}

export interface IResponsableInfo {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  full_name: string;
}

export interface ICliente {
  ruc: string;
  razon_social: string;
  propietario: string;
  dni_propietario?: string;
  fecha_ingreso?: string;
  estado: boolean;
  codigo_control?: number;
  responsable?: number;
  responsable_info?: IResponsableInfo | null;
  regimen_tributario: RegimenTributario;
  tipo_empresa: TipoEmpresa;
  categoria: "A" | "B" | "C" | "N/T";
  regimen_laboral_tipo?: string;
  regimen_laboral_fecha?: string;
  ingresos_mensuales: string;
  ingresos_anuales: string;
  libros_societarios: number;
  selectivo_consumo: boolean;
  credenciales: ICredenciales;
}

export interface IClienteFormData extends Omit<ICliente, "credenciales"> {
  credenciales?: ICredenciales;
}

export interface ModuleConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  hasCreatePermission?: boolean;
  hasEditPermission?: boolean;
  hasDeletePermission?: boolean;
}

export type ModuleRegistry = Record<string, ModuleConfig>;

type CategoriaConfig = {
  label: string;
  className: string;
};

export const categoriaConfig: Record<
  ICliente["categoria"] | "default",
  CategoriaConfig
> = {
  A: {
    label: "A",
    className: "bg-green-900/30 text-green-400 border border-green-700/50",
  },
  B: {
    label: "B",
    className: "bg-yellow-900/30 text-yellow-400 border border-yellow-700/50",
  },
  C: {
    label: "C",
    className: "bg-red-900/30 text-red-400 border border-red-700/50",
  },
  "N/T": {
    label: "No Tributario",
    className: "bg-blue-900/30 text-blue-400 border border-blue-700/50",
  },
  default: {
    label: "Sin categoría",
    className: "bg-gray-900/30 text-gray-400 border border-gray-700/50",
  },
};
