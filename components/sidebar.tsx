"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { useSidebarContext } from "@/app/dashboard/layout"
import { useResponsive } from "@/hooks/use-responsive"
import { SIDEBAR_ROUTES, type RouteConfig } from "@/config/routes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    LogOut,
    Circle,
    ChevronDown,
    ChevronRight,
    Menu,
    X
} from "lucide-react"
import * as Icons from "lucide-react"
import { bg } from "zod/v4/locales"

type LucideIcon = typeof Icons.Activity

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuthStore()
    const { isSidebarOpen, setIsSidebarOpen } = useSidebarContext()
    const { isDesktop } = useResponsive()

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    const [openMenus, setOpenMenus] = useState<string[]>([])

    useEffect(() => {
        // Auto-close sidebar if not in main dashboard ON MOBILE ONLY
        if (!isDesktop && pathname !== "/dashboard" && pathname !== "/dashboard/") {
            setIsSidebarOpen(false)
        }

        SIDEBAR_ROUTES.forEach((route) => {
            if (route.children) {
                const isChildActive = route.children.some((child) => child.path === pathname)
                if (isChildActive && !openMenus.includes(route.label)) {
                    setOpenMenus((prev) => [...prev, route.label])
                }
            }
        })
    }, [pathname, isDesktop])

    const handleLogout = () => {
        logout()
        router.replace("/login")
    }

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
        )
    }

    const hasPermission = (route: RouteConfig): boolean => {
        if (!user) return false

        // Superusuarios tienen acceso total
        if (user.is_superuser) return true

        // Verificar permisos específicos de la ruta
        if (route.permissions && route.permissions.length > 0) {
            const userPermissions = user.permissions || []

            // Normalize permissions function: strips "app." prefix if present
            const normalize = (p: string) => p.includes('.') ? p.split('.')[1] : p

            // Create a set of normalized user permissions for easier checking
            const normalizedUserPermissions = new Set(userPermissions.map(normalize))
            const rawUserPermissions = new Set(userPermissions)

            // El usuario necesita AL MENOS UNO de los permisos listados
            // Check both raw match and normalized match
            const hasAccess = route.permissions.some((p) => {
                const permString = String(p) // Ensure it's a string comparison
                const normalizedRoutePerm = normalize(permString)
                return rawUserPermissions.has(permString) || normalizedUserPermissions.has(normalizedRoutePerm)
            })

            return hasAccess
        }

        // Si la ruta no tiene permisos definidos, es accesible para todos los usuarios autenticados
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
                            "w-full flex items-center transition-all duration-300 rounded-xl font-medium group/link border border-transparent hover:translate-x-1",
                            isActive
                                ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/5 text-blue-400 border-l-blue-500/80 shadow-[0_0_15px_-3px_rgba(37,99,235,0.15)] font-black tracking-wide"
                                : "text-slate-400/90 hover:bg-slate-800/40 hover:text-slate-100 hover:border-slate-700/50",
                            isSidebarOpen
                                ? "h-9 px-3 justify-start gap-3"
                                : "justify-center p-0 h-9 w-9 mx-auto"  
                        )}
                        title={!isSidebarOpen ? route.label : undefined}
                    >
                        <div className="flex items-center gap-3">
                            <IconComponent className={cn("shrink-0 h-5 w-5 transition-transform", isOpen && isSidebarOpen && "text-blue-400 scale-110")} />
                            {isSidebarOpen && <span className="truncate tracking-wide">{route.label}</span>}
                        </div>

                        {isSidebarOpen && (
                            isOpen
                                ? <ChevronDown className="h-4 w-4 text-blue-400 opacity-80 ml-auto transition-transform" />
                                : <ChevronRight className="h-4 w-4 opacity-50 ml-auto transition-transform" />
                        )}
                    </Button>

                    {/* Submenú (Visible si está abierto, con estilos adaptados si el sidebar está cerrado) */}
                    {isOpen && (
                        <div className={cn(
                            "mt-1.5 animate-in slide-in-from-top-2 fade-in duration-200",
                            isSidebarOpen
                                ? "ml-4 space-y-1 border-l-2 border-slate-800/60 pl-2"
                                : "flex flex-col items-center gap-1 border-l-2 border-blue-500/30 ml-3 pl-1"  // ← esto
                        )}>
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
                        "w-full flex items-center transition-all duration-300 rounded-xl font-medium group/link border border-transparent hover:translate-x-1",
                        isActive
                            ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/5 text-blue-400 border-l-blue-500/80 shadow-[0_0_15px_-3px_rgba(37,99,235,0.15)] font-black tracking-wide"
                            : "text-slate-400/90 hover:bg-slate-800/40 hover:text-slate-100 hover:border-slate-700/50",
                        isSidebarOpen ? "h-9 px-3 justify-start gap-3" : "justify-center p-0 h-9 w-9 mx-auto scale-95 hover:translate-x-0"
                    )}
                    title={!isSidebarOpen ? route.label : undefined}
                >
                    <IconComponent className={cn("shrink-0 h-4 w-4 transition-transform", isActive && "text-blue-400 scale-110")} />
                    {isSidebarOpen && <span className="truncate tracking-wide">{route.label}</span>}
                </Button>
            </Link>
        )
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <div
                className={cn(
                    "h-screen bg-[#020617] bg-gradient-to-br from-slate-950 via-[#0a0f1c] to-slate-950 border-r border-slate-800/60 flex flex-col fixed left-0 top-0 z-40 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl shadow-black/50 overflow-hidden",
                    isSidebarOpen ? "w-64" : "w-20",
                    // Mobile behavior: always w-64 when open, but use transform to hide/show
                    "max-lg:w-64 max-lg:shadow-3xl max-lg:z-50",
                    !isSidebarOpen && "max-lg:-translate-x-full"
                )}
            >
                {/* Header del Sidebar */}
                <div className="p-4 h-20 border-b border-slate-800/60 flex items-center justify-between overflow-hidden relative group/header bg-slate-950/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity duration-200" />
                    {isSidebarOpen && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-200 relative z-10 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-white font-black text-xs tracking-tighter">WJ</span>
                            </div>
                            <h2 className="text-xl font-black text-white whitespace-nowrap tracking-tight">
                                ERP
                            </h2>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-slate-400 hover:text-white hover:bg-slate-800/80 ml-auto shrink-0 transition-all duration-200 relative z-10 rounded-xl"
                    >
                        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Navegación Scrollable */}
                <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800/50 hover:scrollbar-thumb-slate-700/50">
                    <div className="space-y-1.5 mt-2">
                        {SIDEBAR_ROUTES.map((route) => renderRoute(route))}
                    </div>
                </nav>

                {/* Footer / Usuario */}
                <div className="border-t border-slate-800/60 p-4 bg-slate-950/20 backdrop-blur-md">
                    {mounted && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className={cn(
                                        "w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/30 transition-all duration-200 rounded-xl",
                                        isSidebarOpen ? "h-11 justify-center gap-2 px-3" : "h-11 w-11 mx-auto justify-center p-0"
                                    )}
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="h-5 w-5 shrink-0" />
                                    {isSidebarOpen && <span className="font-bold tracking-wide">Salir del Sistema</span>}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-700">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">¿Cerrar sesión?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                        ¿Estás seguro que deseas cerrar tu sesión actual?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white border-red-700">
                                        Cerrar Sesión
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    {!mounted && (
                        <Button
                            variant="destructive"
                            className={cn(
                                "w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/30 transition-all duration-200 rounded-xl",
                                isSidebarOpen ? "h-11 justify-center gap-2 px-3" : "h-11 w-11 mx-auto justify-center p-0"
                            )}
                            title="Cerrar Sesión"
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            {isSidebarOpen && <span className="font-bold tracking-wide">Salir del Sistema</span>}
                        </Button>
                    )
                    }
                </div>
            </div>
        </>
    )
}