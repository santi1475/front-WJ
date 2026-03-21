import { Description } from "@radix-ui/react-dialog";
import { UserPermission } from "@/features/auth/types/permissions";

export interface RouteConfig {
  path: string;
  label: string;
  icon: string;
  permissions?: UserPermission[]; // Use the enum type
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
    children: [
      {
        path: "/dashboard/clientes",
        label: "Todos los Clientes",
        icon: "Users",
        permissions: [UserPermission.VIEW_CLIENTE],
      },
      {
        path: "/dashboard/clientes/filtros",
        label: "Filtros Avanzados",
        icon: "SlidersHorizontal",
        permissions: [UserPermission.CAN_USE_ADVANCED_FILTERS],
      },
    ],
    permissions: [UserPermission.VIEW_CLIENTE, UserPermission.ADD_CLIENTE],
  } as const satisfies RouteConfig,

  FACTURAS: {
    path: "/dashboard/facturas",
    label: "Facturas",
    icon: "Receipt",
    permissions: [UserPermission.VIEW_LOGENTRY],
  } as const satisfies RouteConfig,

  REPORTES: {
    path: "/dashboard/reportes",
    label: "Reportes",
    icon: "LineChart",
    permissions: ["ver_reportes"] as any,
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
        permissions: [UserPermission.VIEW_GROUP],
      },
      {
        path: "/dashboard/users",
        label: "Usuarios",
        icon: "UserCog",
        permissions: [UserPermission.VIEW_PERMISSION],
      },
    ],
    permissions: [UserPermission.VIEW_HISTORIALBAJA],
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
  "/dashboard/clientes/filtros",
  "/dashboard/configuracion/roles",
  "/dashboard/configuracion/usuarios",
];
