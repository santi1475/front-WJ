export interface NavSection {
    title: string
    items: {
        id: string
        label: string
        href: string
        icon: string
        color?: string
    }[]
    sectionIcon?: string
}

export const sidebarSections: NavSection[] = [
    {
        title: "Principal",
        sectionIcon: "BarChart3",
        items: [
            { 
                id: "dashboard", 
                label: "Dashboard General", 
                href: "/dashboard", 
                icon: "BarChart3", 
                color: "text-blue-500" 
            }
        ],
    },
    {
        title: "Gestión",
        sectionIcon: "FileText",
        items: [
            {
                id: "tributario",
                label: "Gestión Tributaria",
                href: "/dashboard/tributario",
                icon: "FileText",
                color: "text-purple-500",
            },
            {
                id: "reportes",
                label: "Reportes Financieros",
                href: "/dashboard/reportes",
                icon: "PieChart",
                color: "text-green-500",
            },
            {
                id: "roles-permisos",
                label: "Roles y Permisos",
                href: "/dashboard/roles-permisos",
                icon: "ShieldCheck",
                color: "text-green-500",
            }
        ],
    },
    {
        title: "Administración",
        sectionIcon: "Users",
        items: [
            {
                id: "usuarios",
                label: "Gestión de Usuarios",
                href: "/dashboard/usuarios",
                icon: "Users",
                color: "text-orange-500",
            },
        ],
    },
]