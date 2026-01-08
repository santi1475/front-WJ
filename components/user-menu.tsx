"use client"

import { useState } from "react"
import Link from "next/link"
import { LogOut, Settings, User } from "lucide-react"
import { currentUser } from "@/lib/mocks/user"

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = () => {
        console.log("Cerrando sesión...")
        // Aquí iría la lógica de logout
    }

    return (
        <div className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full border-2 border-primary/20 hover:border-primary transition-colors overflow-hidden flex items-center justify-center bg-muted"
                title={currentUser.name}
            >
                <img
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <img
                                src={currentUser.avatar || "/placeholder.svg"}
                                alt={currentUser.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{currentUser.name}</p>
                                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link href="/dashboard/configuracion">
                            <button
                                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted transition-colors text-left text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-4 h-4" />
                                Mi Perfil
                            </button>
                        </Link>
                        <Link href="/dashboard/configuracion">
                            <button
                                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-muted transition-colors text-left text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="w-4 h-4" />
                                Configuración
                            </button>
                        </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border py-2">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                handleLogout()
                            }}
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-destructive/10 text-destructive transition-colors text-left text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}

            {/* Close menu when clicking outside */}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
        </div>
    )
}
