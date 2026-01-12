"use client"

import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { LogOut, Circle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SIDEBAR_ROUTES } from "@/config/routes"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        // Aviso temporal de cierre de sesión
        if (typeof window !== "undefined") {
            alert("Sesión cerrada");
        }
        logout()
        router.push("/login")
    }

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 max-lg:hidden">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Contable<span className="text-blue-500">System</span></h2>
                <p className="text-xs text-slate-400 mt-1">ERP & Gestión</p>
            </div>

            {/* Navigation Dinámica */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {SIDEBAR_ROUTES.map((route) => {
                    const IconComponent = (Icons[route.icon as keyof typeof Icons] as LucideIcon) || Circle;
                    const isActive = pathname === route.path;

                    return (
                        <Link key={route.path} href={route.path}>
                            <Button 
                                variant="ghost" 
                                className={cn(
                                    "w-full justify-start mb-1",
                                    isActive 
                                        ? "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300" 
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                                )}
                            >
                                <IconComponent className="h-4 w-4 mr-3" />
                                {route.label}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="border-t border-slate-800 p-4 space-y-4">
                {user && (
                    <div className="p-3 bg-slate-800/50 rounded-lg text-sm border border-slate-700/50">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Usuario</p>
                        <p className="text-white font-medium truncate">{user.username}</p>
                        <div className="flex items-center mt-1">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            <span className="text-xs text-slate-400">{user.role}</span>
                        </div>
                    </div>
                )}
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
}