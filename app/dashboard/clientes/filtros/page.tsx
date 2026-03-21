"use client"

import { useMemo, useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { UserPermission } from "@/features/auth/types/permissions"
import { AdvancedFiltersCard } from "@/features/clientes/components/advanced-filters-card"
import { AdvancedFiltersResults } from "@/features/clientes/components/advanced-filters-results"
import { SlidersHorizontal, ShieldAlert, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const FILTER_KEYS = [
    "categoria",
    "regimen_tributario",
    "responsable",
    "regimen_laboral_tipo",
    "ultimo_digito_ruc",
    "libros_societarios",
    "selectivo_consumo",
    "page"
]

export default function FiltrosAvanzadosPage() {
    const { can } = useAuth()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const hasPermission = can(UserPermission.CAN_USE_ADVANCED_FILTERS)

    const currentFilters = useMemo(() => {
        const filters: Record<string, string> = {}
        FILTER_KEYS.forEach((key) => {
            const value = searchParams.get(key)
            if (value) filters[key] = value
        })
        return filters
    }, [searchParams])

    const handleApplyFilters = (newFilters: Record<string, string>) => {
        const params = new URLSearchParams()
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value)
        })
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleClearFilters = () => {
        router.push(pathname)
    }

    if (!isMounted) return null

    if (!hasPermission) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in duration-500">
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6 ring-8 ring-red-50/50 dark:ring-red-900/10">
                    <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Acceso Denegado</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                    No tienes los permisos necesarios (`can_use_advanced_filters`) para acceder a este módulo de búsqueda profesional.
                </p>
                <Button onClick={() => router.push("/dashboard")} variant="outline" className="rounded-xl px-8 h-12 font-bold shadow-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Regresar al Dashboard
                </Button>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen pb-20">
            {/* Background pattern */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0"
                style={{ backgroundImage: "radial-gradient(#2563eb 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}
            />

            <div className="relative z-10 max-w-[1600px] mx-auto px-4 pt-4 md:px-8 space-y-8">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in slide-in-from-top-4 fade-in duration-700">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                                <Sparkles className="h-3 w-3 mr-1.5" />
                                Inteligencia de Datos
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <SlidersHorizontal className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                    Filtros Avanzados
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    Motor de búsqueda especializado para administración tributaria y laboral.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard/clientes")}
                        className="rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 self-start md:self-auto"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al listado
                    </Button>
                </header>

                {/* ── Layout de dos columnas: filtros | resultados ── */}
                <div className="flex flex-col lg:flex-row items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">

                    {/* Columna izquierda — Filtros (ancho fijo, sticky) */}
                    <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:sticky lg:top-6">
                        <AdvancedFiltersCard
                            filters={currentFilters}
                            onApplyFilters={handleApplyFilters}
                            onClearFilters={handleClearFilters}
                        />
                    </aside>

                    {/* Columna derecha — Resultados (ocupa el resto) */}
                    <section className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
                        <AdvancedFiltersResults filters={currentFilters} />
                    </section>
                </div>
            </div>

            {/* Gradient spotlights */}
            <div className="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
        </div>
    )
}