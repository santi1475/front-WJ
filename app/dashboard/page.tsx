"use client"

import { useEffect, useState } from "react"
import { clientesService } from "@/features/clientes/services/clientes"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ClientsTableResponsive } from "@/features/clientes/components/clients-table-responsive"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useResponsive } from "@/hooks/use-responsive"

export default function DashboardPage() {
    const [stats, setStats] = useState<unknown>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const { isMobile } = useResponsive()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await clientesService.getStats()
                setStats(data)
            } catch (err: unknown) {
                setError("Error al cargar estadísticas")
                console.error("Stats error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div>
                <h1 className={`font-bold text-white ${isMobile ? "text-2xl" : "text-3xl"}`}>Dashboard</h1>
                <p className="text-slate-400 mt-2">Bienvenido al sistema contable</p>
            </div>

            {/* KPI Cards */}
            {loading ? (
                <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-slate-800/50 rounded-lg animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <Card className="border-red-800/50 bg-red-900/10">
                    <CardContent className="flex items-center gap-2 pt-6">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-red-400">{error}</span>
                    </CardContent>
                </Card>
            ) : (
                <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    <KPICard
                        title="Clientes Activos"
                        value={stats?.total_activos || 0}
                        description="Empresas registradas"
                        color="blue"
                    />
                    <KPICard
                        title="Ingresos Totales"
                        value={`S/ ${stats?.ingresos_totales || "0"}`}
                        description="Volumen anual"
                        color="green"
                    />
                    <KPICard
                        title="Pendientes"
                        value={stats?.pendientes_declaracion || 0}
                        description="Declaraciones pendientes"
                        color="amber"
                    />
                </div>
            )}

            {/* Clients Table */}
            <Card className="border-slate-800 bg-slate-900/50 w-full">
                <CardHeader>
                    <CardTitle>Gestión de Clientes</CardTitle>
                    <CardDescription>Administra los datos de tus clientes</CardDescription>
                </CardHeader>
                <CardContent className="w-full overflow-hidden">
                    <ClientsTableResponsive />
                </CardContent>
            </Card>
        </div>
    )
}
