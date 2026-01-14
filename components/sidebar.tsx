"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { useSidebarContext } from "@/app/dashboard/layout"
import { SIDEBAR_ROUTES, type RouteConfig } from "@/config/routes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LogOut,
    Circle,
    ChevronDown,
    ChevronRight,
    Menu,
    X
} from "lucide-react"
import * as Icons from "lucide-react"

type LucideIcon = typeof Icons.Activity

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuthStore()
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext()

    const [openMenus, setOpenMenus] = useState<string[]>([])

    useEffect(() => {
        SIDEBAR_ROUTES.forEach((route) => {
            if (route.children) {
                const isChildActive = route.children.some((child) => child.path === pathname)
                if (isChildActive && !openMenus.includes(route.label)) {
                    setOpenMenus((prev) => [...prev, route.label])
                }
            }
        })
    }, [pathname]) // Solo se ejecuta cuando cambia la ruta

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const toggleMenu = (label: string) => {
        if (!isSidebarOpen) {
            setIsSidebarOpen(true)
            setOpenMenus([label])
            return
        }
        setOpenMenus((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
        )
    }

    const hasPermission = (route: RouteConfig): boolean => {
        if (!user) return false

        if (user.is_superuser || user.role === "ADMIN") return true
        
        if (route.permissions && route.permissions.length > 0) {
            const userPermissions = user.permissions || []
            const hasAccess = route.permissions.some((p) => userPermissions.includes(p))
            if (!hasAccess) return false
        }

        if (route.type === "admin" && user.role !== "ADMIN") {
            return false
        }

        return true
    }

    const renderRoute = (route: RouteConfig) => {
        if (!hasPermission(route)) return null

        const IconComponent = (Icons[route.icon as keyof typeof Icons] as LucideIcon) || Circle

        const isActive = pathname === route.path
        const hasChildren = route.children && route.children.length > 0
        const isOpen = openMenus.includes(route.label)

        const isChildActive = hasChildren && route.children?.some((c) => c.path === pathname)

        if (hasChildren) {
            return (
                <div key={route.label} className="mb-1">
                    <Button
                        variant="ghost"
                        onClick={() => toggleMenu(route.label)}
                        className={cn(
                            "w-full justify-between transition-colors",
                            (isActive || isChildActive)
                                ? "bg-slate-800 text-blue-400"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                            !isSidebarOpen && "justify-center px-2"
                        )}
                        title={!isSidebarOpen ? route.label : undefined}
                    >
                        <div className="flex items-center">
                            <IconComponent className={cn("h-4 w-4", isSidebarOpen ? "mr-3" : "mr-0")} />
                            {isSidebarOpen && <span className="truncate">{route.label}</span>}
                        </div>

                        {isSidebarOpen && (
                            isOpen ? <ChevronDown className="h-4 w-4 opacity-50 ml-auto" /> : <ChevronRight className="h-4 w-4 opacity-50 ml-auto" />
                        )}
                    </Button>

                    {/* Submenú (Solo visible si el menú está desplegado Y el sidebar abierto) */}
                    {isOpen && (
                        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-2 animate-in slide-in-from-top-2 duration-200">
                            {route.children!.map((child) => renderRoute(child))}
                        </div>
                    )}
                </div>
            )
        }

        // Renderizado para items simples (Links)
        return (
            <Link key={route.path} href={route.path} className="block mb-1">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start",
                        isActive
                            ? "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                        !isSidebarOpen && "justify-center px-2"
                    )}
                    title={!isSidebarOpen ? route.label : undefined}
                >
                    <IconComponent className={cn("h-4 w-4", isSidebarOpen ? "mr-3" : "mr-0")} />
                    {isSidebarOpen && <span className="truncate">{route.label}</span>}
                </Button>
            </Link>
        )
    }

    return (
        <div
            className={cn(
                "h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out",
                isSidebarOpen ? "w-64" : "w-20",
                "max-lg:hidden" // Ocultar en móviles (usarás un sheet/drawer aparte para mobile)
            )}
        >
            {/* Header del Sidebar */}
            <div className="p-4 h-16 border-b border-slate-800 flex items-center justify-between overflow-hidden">
                {isSidebarOpen && (
                    <div className="animate-in fade-in duration-300">
                        <h2 className="text-xl font-bold text-white whitespace-nowrap">
                            WJ <span className="text-blue-500">ERP</span>
                        </h2>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-slate-400 hover:text-white hover:bg-slate-800 ml-auto shrink-0"
                >
                    {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Navegación Scrollable */}
            <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800">
                <div className="space-y-1">
                    {SIDEBAR_ROUTES.map((route) => renderRoute(route))}
                </div>
            </nav>

            {/* Footer / Usuario */}
            <div className="border-t border-slate-800 p-4">
                {user && (
                    <div className={cn(
                        "flex items-center gap-3 mb-4",
                        !isSidebarOpen && "justify-center"
                    )}>
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                                <p className="text-xs text-slate-400 capitalize truncate">{user.role?.toLowerCase()}</p>
                            </div>
                        )}
                    </div>
                )}

                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className={cn(
                        "w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50",
                        !isSidebarOpen && "px-0 justify-center"
                    )}
                    title="Cerrar Sesión"
                >
                    <LogOut className={cn("h-4 w-4", isSidebarOpen ? "mr-2" : "mr-0")} />
                    {isSidebarOpen && "Salir"}
                </Button>
            </div>
        </div>
    )
}