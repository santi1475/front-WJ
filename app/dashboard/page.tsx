"use client"

import { useEffect, useState } from "react"
import { clientesService } from "@/features/clientes/services/clientes"
import type { IClientStats } from "@/features/clientes/services/clientes"
import { KPICard } from "@/components/dashboard/kpi-card"
import { ClientsTableResponsive } from "@/features/clientes/components/clients-table-responsive"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useResponsive } from "@/hooks/use-responsive"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
    const [stats, setStats] = useState<IClientStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const { isMobile } = useResponsive()
    const { isAdminOrSuperAdmin } = useAuth()

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
        <div className="space-y-8 w-full px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 -z-10" />
                <h1 className={`font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 ${isMobile ? "text-3xl" : "text-4xl"}`}>
                    Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium tracking-wide">Panel central de operaciones del sistema contable.</p>
            </div>

            {/* KPI Cards */}
            {loading ? (
                <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl animate-pulse backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50" />
                    ))}
                </div>
            ) : error ? (
                <Card className="border-rose-500/30 bg-rose-500/10 shadow-lg shadow-rose-500/5">
                    <CardContent className="flex items-center gap-3 pt-6 rounded-2xl">
                        <div className="p-2 bg-rose-500/20 rounded-full">
                            <AlertCircle className="h-5 w-5 text-rose-500" />
                        </div>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">{error}</span>
                    </CardContent>
                </Card>
            ) : (
                <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    <KPICard
                        title="Clientes Activos"
                        value={stats?.total_activos || 0}
                        description="Empresas registradas operando"
                        color="blue"
                    />
                    <KPICard
                        title="Pendientes"
                        value={stats?.pendientes_declaracion || "N/T"}
                        description="<Módulo en desarrollo>"
                        color="amber"
                    />
                </div>
            )}

            {/* Clients Table */}
            <Card className="w-full border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/50 dark:shadow-black/40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800/60 pb-6">
                    <CardTitle className="text-xl md:text-2xl font-black">Directorio de Clientes</CardTitle>
                    <CardDescription className="font-medium text-slate-500">Gestión centralizada del portafolio empresarial</CardDescription>
                </CardHeader>
                <CardContent className="w-full pt-6 overflow-visible">
                    <ClientsTableResponsive
                        disableEdit={!isAdminOrSuperAdmin()}
                        showAllClients={true}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
