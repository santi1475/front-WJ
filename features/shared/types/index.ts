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
  sis_clave?: string;
  pe?: string;
  clave_osce?: string;
  clave_sencico?: string;
}

export interface ITipoRegimenLaboral {
  id: number;
  descripcion: string;
}

export interface IResponsableInfo {
  id: number;
  nombre: string;
  celular?: string;
  activo: boolean;
}

export interface ILibroSocietario {
  id: number;
  nombre: string;
}

export interface IHistorialBaja {
  id: number;
  cliente: string;
  cliente_info?: {
    ruc: string;
    razon_social: string;
    estado: boolean;
    tipo_empresa?: string;
    categoria?: string;
  };
  fecha_baja: string;
  fecha_reactivacion?: string | null;
  usuario_baja?: number;
  usuario_baja_info?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
  } | null;
  razon?: string | null;
  estado: "BAJA" | "REACTIVADO";
}

export interface ICliente {
  ruc: string;
  ultimo_digito_ruc?: string;
  razon_social: string;
  propietario: string;
  fecha_ingreso?: string;
  estado: boolean;
  codigo_control?: number;
  responsable?: number;
  responsable_info?: IResponsableInfo | null;
  responsable_nombre?: string;
  regimen_tributario: RegimenTributario;
  tipo_empresa: TipoEmpresa;
  categoria: "A" | "B" | "C" | "N/T";
  regimen_laboral_tipo?: string;
  regimen_laboral_fecha?: string;
  planilla?: boolean;
  ingresos_mensuales: string;
  ingresos_anuales: string;
  libros_societarios: number[];
  libros_societarios_detalles?: ILibroSocietario[];
  selectivo_consumo: boolean;
  credenciales: ICredenciales;
  fecha_baja?: string;
  fecha_reactivacion?: string;
}

export interface IClienteFormData extends Omit<
  ICliente,
  "credenciales" | "libros_societarios_detalles"
> {
  credenciales?: ICredenciales;
}

export interface ModuleConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  requiredRoles: string[];
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
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50",
  },
  B: {
    label: "B",
    className:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50",
  },
  C: {
    label: "C",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50",
  },
  "N/T": {
    label: "No Tiene",
    className:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/50",
  },
  default: {
    label: "Sin categoría",
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700/50",
  },
};
