"use client"

import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Sidebar() {
    const router = useRouter()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white">Contable</h2>
                <p className="text-xs text-slate-400 mt-1">ERP System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-800">
                        <LayoutDashboard className="h-4 w-4 mr-3" />
                        Dashboard
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-800">
                        <Users className="h-4 w-4 mr-3" />
                        Clientes
                    </Button>
                </Link>
            </nav>

            {/* User Info & Logout */}
            <div className="border-t border-slate-800 p-4 space-y-4">
                {user && (
                    <div className="p-3 bg-slate-800/50 rounded text-sm">
                        <p className="text-slate-400 text-xs">Usuario</p>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-slate-400 text-xs mt-1">
                            Rol: <span className="text-blue-400">{user.role}</span>
                        </p>
                    </div>
                )}
                <Button
                    onClick={handleLogout}
                    className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-700/50"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    )
}
