export type RouteType = "public" | "protected" | "admin";

export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
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
  } as const satisfies RouteConfig,

  FACTURAS: {
    path: "/dashboard/facturas",
    label: "Facturas",
    icon: "Receipt",
    type: "protected",
  } as const satisfies RouteConfig,

  REPORTES: {
    path: "/dashboard/reportes",
    label: "Reportes",
    icon: "LineChart",
    type: "admin",
  } as const satisfies RouteConfig,

  CONFIGURACION: {
    path: "/dashboard/configuracion",
    label: "Configuración",
    icon: "Settings",
    type: "admin",
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
];

export const ADMIN_ROUTES = [ROUTES.REPORTES.path, ROUTES.CONFIGURACION.path];
