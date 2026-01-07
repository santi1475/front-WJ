"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, FileText, PieChart, AlertCircle, CheckCircle2, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import ThemeToggle from "@/components/theme-toggle"

export default function Dashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Mock data for dashboard
    const stats = [
        { label: "Ingresos Mensuales", value: "$125,480", change: "+12.5%", icon: TrendingUp, color: "text-green-500" },
        { label: "Gastos", value: "$48,920", change: "+3.2%", icon: BarChart3, color: "text-orange-500" },
        { label: "Impuestos Pendientes", value: "$15,340", change: "−2.1%", icon: AlertCircle, color: "text-red-500" },
        { label: "Balance Neto", value: "$76,560", change: "+8.3%", icon: CheckCircle2, color: "text-blue-500" },
    ]

    const recentTransactions = [
        { id: 1, description: "Venta Producto A", amount: "$2,500", date: "2025-01-05", status: "Completado" },
        { id: 2, description: "Pago Proveedor", amount: "$−1,200", date: "2025-01-04", status: "Procesando" },
        { id: 3, description: "Servicio Profesional", amount: "$3,800", date: "2025-01-03", status: "Completado" },
        { id: 4, description: "Alquiler Oficina", amount: "$−2,000", date: "2025-01-02", status: "Completado" },
        { id: 5, description: "Comisión Ventas", amount: "$−850", date: "2025-01-01", status: "Completado" },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="flex-1">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-balance">Dashboard Empresarial</h1>
                                <p className="text-muted-foreground mt-2">Bienvenido de vuelta, Administrador</p>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                            <h3 className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</h3>
                                            <p
                                                className={`text-sm mt-2 font-semibold ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {stat.change} vs mes anterior
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Transactions */}
                        <div className="lg:col-span-2">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold mb-6">Transacciones Recientes</h2>
                                <div className="space-y-4">
                                    {recentTransactions.map((tx) => (
                                        <div
                                            key={tx.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold">{tx.description}</p>
                                                <p className="text-sm text-muted-foreground">{tx.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${tx.amount.startsWith("−") ? "text-red-500" : "text-green-500"}`}>
                                                    {tx.amount}
                                                </p>
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tx.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <Card className="p-6 h-full flex flex-col">
                                <h2 className="text-xl font-bold mb-6">Acciones Rápidas</h2>
                                <div className="space-y-3 flex-1">
                                    <Link href="/dashboard/tributario">
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent hover:bg-muted">
                                            <FileText className="w-5 h-5" />
                                            Gestión Tributaria
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/reportes">
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent hover:bg-muted">
                                            <PieChart className="w-5 h-5" />
                                            Reportes Financieros
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/usuarios">
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent hover:bg-muted">
                                            <Users className="w-5 h-5" />
                                            Gestión de Usuarios
                                        </Button>
                                    </Link>
                                    <Link href="/settings">
                                        <Button variant="outline" className="w-full justify-start gap-2 bg-transparent hover:bg-muted">
                                            <Settings className="w-5 h-5" />
                                            Configuración
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
