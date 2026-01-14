export type RouteType = "public" | "protected" | "admin";

export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
  permissions?: string[];
  type: RouteType;
  children?: RouteConfig[];
}

export const ROUTES = {
  LOGIN: {
    path: "/login",
    label: "Iniciar Sesión",
    icon: "LogIn",
    type: "public",
  } as const satisfies RouteConfig,

  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard",
    icon: "BarChart3",
    type: "protected",

  } as const satisfies RouteConfig,

  CLIENTES: {
    path: "/dashboard/clientes",
    label: "Clientes",
    icon: "Users",
    type: "protected",
    permissions: ["ver_clientes", "gestion_clientes"],
  } as const satisfies RouteConfig,

  FACTURAS: {
    path: "/dashboard/facturas",
    label: "Facturas",
    icon: "Receipt",
    type: "protected",
    permissions: ["ver_facturas"],
  } as const satisfies RouteConfig,

  REPORTES: {
    path: "/dashboard/reportes",
    label: "Reportes",
    icon: "LineChart",
    type: "admin",
    permissions: ["ver_reportes"],
  } as const satisfies RouteConfig,

  CONFIGURACION: {
    path: "/dashboard/configuracion",
    label: "Configuración",
    icon: "Settings",
    type: "protected", 
    children: [
      {
        path: "/dashboard/configuracion/roles",
        label: "Roles y Permisos",
        icon: "Shield",
        type: "protected",
        permissions: ["ver_roles", "gestion_seguridad"],
      },
      {
        path: "/dashboard/configuracion/usuarios",
        label: "Usuarios",
        icon: "UserCog",
        type: "protected",
        permissions: ["ver_usuarios"],
      }
    ]
  } as const satisfies RouteConfig,
} as const;

export const SIDEBAR_ROUTES: RouteConfig[] = [
  ROUTES.DASHBOARD,
  ROUTES.CLIENTES,
  ROUTES.FACTURAS,
  ROUTES.REPORTES,
  ROUTES.CONFIGURACION, 
];

export const PUBLIC_ROUTES = [ROUTES.LOGIN.path];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD.path,
  ROUTES.CLIENTES.path,
  ROUTES.FACTURAS.path,
  ROUTES.REPORTES.path,
  ROUTES.CONFIGURACION.path,
  "/dashboard/configuracion/roles", 
  "/dashboard/configuracion/usuarios"
];