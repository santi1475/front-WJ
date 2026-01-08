import type { NavItem } from "@/lib/types/user";

export const sidebarNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "BarChart3",
    color: "text-blue-500",
  },
  {
    id: "tributario",
    label: "Gestión Tributaria",
    href: "/dashboard/tributario",
    icon: "FileText",
    color: "text-orange-500",
  },
  {
    id: "reportes",
    label: "Reportes Financieros",
    href: "/dashboard/reportes",
    icon: "PieChart",
    color: "text-purple-500",
  },
  {
    id: "usuarios",
    label: "Gestión de Usuarios",
    href: "/dashboard/usuarios",
    icon: "Users",
    color: "text-green-500",
  },
  {
    id: "configuracion",
    label: "Configuración",
    href: "/dashboard/configuracion",
    icon: "Settings",
    color: "text-gray-500",
  },
];
