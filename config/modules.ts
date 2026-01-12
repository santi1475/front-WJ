import type { ModuleConfig } from "@/features/shared/types";

export const MODULE_REGISTRY: Record<string, ModuleConfig> = {
  CLIENTES: {
    id: "clientes",
    name: "Clientes",
    path: "/dashboard/clientes",
    icon: "Users",
    description: "Gestión de clientes y contactos",
    requiredRoles: ["ADMIN", "CONTADOR"],
    hasCreatePermission: true,
    hasEditPermission: true,
    hasDeletePermission: true,
  },

  FACTURAS: {
    id: "facturas",
    name: "Facturas",
    path: "/dashboard/facturas",
    icon: "Receipt",
    description: "Gestión de facturas y documentos",
    requiredRoles: ["ADMIN", "CONTADOR"],
    hasCreatePermission: true,
    hasEditPermission: true,
    hasDeletePermission: true,
  },

  COMPROBANTES: {
    id: "comprobantes",
    name: "Comprobantes",
    path: "/dashboard/comprobantes",
    icon: "FileText",
    description: "Gestión de comprobantes de pago",
    requiredRoles: ["ADMIN", "CONTADOR"],
    hasCreatePermission: true,
    hasEditPermission: true,
    hasDeletePermission: true,
  },

  REPORTES: {
    id: "reportes",
    name: "Reportes",
    path: "/dashboard/reportes",
    icon: "LineChart",
    description: "Generación de reportes contables",
    requiredRoles: ["ADMIN"],
    hasCreatePermission: false,
    hasEditPermission: false,
    hasDeletePermission: false,
  },

  CONFIGURACION: {
    id: "configuracion",
    name: "Configuración",
    path: "/dashboard/configuracion",
    icon: "Settings",
    description: "Configuración del sistema",
    requiredRoles: ["ADMIN"],
    hasCreatePermission: false,
    hasEditPermission: true,
    hasDeletePermission: false,
  },

  USUARIOS: {
    id: "usuarios",
    name: "Usuarios",
    path: "/dashboard/usuarios",
    icon: "Users",
    description: "Gestión de usuarios del sistema",
    requiredRoles: ["ADMIN"],
    hasCreatePermission: true,
    hasEditPermission: true,
    hasDeletePermission: true,
  },

  EMPRESA: {
    id: "empresa",
    name: "Empresa",
    path: "/dashboard/empresa",
    icon: "Building",
    description: "Información de la empresa",
    requiredRoles: ["ADMIN"],
    hasCreatePermission: false,
    hasEditPermission: true,
    hasDeletePermission: false,
  },
} as const;

// Helper to get modules for specific role
export const getModulesByRole = (role: string) => {
  return Object.values(MODULE_REGISTRY).filter((module) =>
    module.requiredRoles.includes(role as any)
  );
};

// Helper to check if user can perform action
export const canPerformAction = (
  module: ModuleConfig,
  action: "create" | "edit" | "delete"
) => {
  const permissionMap = {
    create: module.hasCreatePermission,
    edit: module.hasEditPermission,
    delete: module.hasDeletePermission,
  };
  return permissionMap[action] ?? false;
};
