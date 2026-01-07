"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { Plus, Mail, Shield, MoreVertical } from "lucide-react"

export default function UsuariosPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const users = [
        { id: 1, name: "Juan Pérez", email: "juan@empresa.com", role: "Administrador", status: "Activo" },
        { id: 2, name: "María García", email: "maria@empresa.com", role: "Contador", status: "Activo" },
        { id: 3, name: "Carlos López", email: "carlos@empresa.com", role: "Usuario", status: "Activo" },
        { id: 4, name: "Ana Martínez", email: "ana@empresa.com", role: "Usuario", status: "Inactivo" },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="flex-1">
                <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Gestión de Usuarios</h1>
                                <p className="text-muted-foreground mt-2">Administra los accesos y permisos de tu equipo</p>
                            </div>
                            <Button className="gap-2 hidden sm:flex">
                                <Plus className="w-4 h-4" />
                                Nuevo Usuario
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Usuario</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Rol</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                    <Shield className="w-3 h-3" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-sm font-semibold ${user.status === "Activo" ? "text-green-500" : "text-muted-foreground"}`}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )
}
