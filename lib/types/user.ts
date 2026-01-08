export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: "admin" | "contador" | "usuario";
    department: string;
}

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: string;
    color?: string;
}

export interface DashboardStats {
    label: string;
    value: string;
    change: string;
    icon: string;
    color: string;
}
