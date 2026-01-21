import { Description } from "@radix-ui/react-dialog";

export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
  permissions?: string[];
  children?: RouteConfig[];
}

export const ROUTES = {
  LOGIN: {
    path: "/login",
    label: "Iniciar Sesión",
    icon: "LogIn",
  } as const satisfies RouteConfig,

  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard",
    icon: "BarChart3",

  } as const satisfies RouteConfig,

  CLIENTES: {
    path: "/dashboard/clientes",
    label: "Clientes",
    icon: "Users",
    permissions: ["gestion.view_cliente", "gestion.add_cliente"],
  } as const satisfies RouteConfig,

  FACTURAS: {
    path: "/dashboard/facturas",
    label: "Facturas",
    icon: "Receipt",
    permissions: ["ver_facturas"],
  } as const satisfies RouteConfig,

  REPORTES: {
    path: "/dashboard/reportes",
    label: "Reportes",
    icon: "LineChart",
    permissions: ["ver_reportes"],
  } as const satisfies RouteConfig,

  CONFIGURACION: {
    path: "/dashboard/configuracion",
    label: "Configuración",
    icon: "Settings",
    children: [
      {
        path: "/dashboard/roles",
        label: "Roles y Permisos",
        icon: "Shield",
        permissions: ["ver_roles", "gestion_seguridad"],
      },
      {
        path: "/dashboard/users",
        label: "Usuarios",
        icon: "UserCog",
        permissions: ["ver_usuarios"],
      }
    ],
    permissions: ["ver_configuracion"],
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
  "/dashboard/configuracion/usuarios",
];