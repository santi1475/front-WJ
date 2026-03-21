"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { clientesService, type IClientFilters } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { categoriaConfig } from "@/features/shared/types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search, Users } from "lucide-react"
import { toast } from "sonner"

interface AdvancedFiltersResultsProps {
    filters: Record<string, string>
}

const PAGE_SIZE = 50

export function AdvancedFiltersResults({ filters }: AdvancedFiltersResultsProps) {
    const router = useRouter()
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [hasSearched, setHasSearched] = useState(false)

    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isPaginating, setIsPaginating] = useState(false)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        const hasActiveFilters = Object.keys(filters).some(
            (key) => key !== "page" && filters[key]
        )

        if (!hasActiveFilters) {
            setClients([])
            setHasSearched(false)
            setTotalCount(0)
            return
        }

        const pageNum = filters.page ? parseInt(filters.page) : 1
        setCurrentPage(pageNum)
        fetchResults(undefined, pageNum)
        setHasSearched(true)
    }, [filters])

    const fetchResults = async (url?: string, page: number = 1) => {
        try {
            if (url) {
                setIsPaginating(true)
            } else {
                setLoading(true)
            }
            setError("")

            if (url) {
                const axios = (await import("@/lib/axios-client")).getAxiosInstance()
                let targetUrl = url
                if (targetUrl.startsWith("http://") && typeof window !== "undefined" && window.location.protocol === "https:") {
                    targetUrl = targetUrl.replace("http://", "https://")
                }
                const response = await axios.get(targetUrl)
                setClients(response.data.results)
                setNextUrl(response.data.next)
                setPrevUrl(response.data.previous)
                setTotalCount(response.data.count || 0)
                setCurrentPage(page)
            } else {
                const apiFilters: IClientFilters = { page, page_size: PAGE_SIZE }
                if (filters.categoria) apiFilters.categoria = filters.categoria as IClientFilters["categoria"]
                if (filters.responsable) apiFilters.responsable = filters.responsable
                if (filters.regimen_laboral_tipo) apiFilters.regimen_laboral_tipo = filters.regimen_laboral_tipo
                if (filters.regimen_tributario) apiFilters.regimen_tributario = filters.regimen_tributario as any
                if (filters.ultimo_digito_ruc) apiFilters.ultimo_digito_ruc = filters.ultimo_digito_ruc
                if (filters.libros_societarios) apiFilters.libros_societarios = parseInt(filters.libros_societarios)
                if (filters.selectivo_consumo) apiFilters.selectivo_consumo = filters.selectivo_consumo

                const data = await clientesService.list(apiFilters)
                setClients(data.results)
                setNextUrl(data.next)
                setPrevUrl(data.previous)
                setTotalCount(data.count || 0)
            }
        } catch (err: any) {
            console.error("Error fetching filtered clients:", err)
            if (err.response?.status === 422) {
                const detail = err.response.data?.detail || err.response.data?.errores || "Error de validación en la consulta"
                toast.error("Validación fallida", {
                    description: typeof detail === "string" ? detail : JSON.stringify(detail),
                })
            }
            setError("Error al cargar los resultados. Intente nuevamente.")
        } finally {
            setLoading(false)
            setIsPaginating(false)
        }
    }

    const handlePageChange = (url: string, page: number) => {
        fetchResults(url, page)
    }

    if (!hasSearched) {
        return (
            <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                            <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                            Selecciona tus filtros
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Configura los filtros en la tarjeta superior y presiona &ldquo;Aplicar Filtros&rdquo;
                            para ver los resultados aquí.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Resultados de Búsqueda</CardTitle>
                    </div>
                    {!loading && (
                        <Badge variant="outline" className="text-muted-foreground">
                            {totalCount} cliente{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {error && (
                    <div className="p-3 mb-4 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                            Buscando clientes con los filtros aplicados...
                        </span>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20 mb-4">
                            <Search className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Sin resultados</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                            No se encontraron clientes que coincidan con los filtros seleccionados.
                            Prueba modificando los criterios de búsqueda.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        {/* ── Columnas verticales: cada <th> apila su ícono/abrev arriba del label ── */}
                                        <TableHead className="w-[50px]">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">N°</span>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex flex-col gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID</span>
                                                <span className="text-xs font-semibold">RUC</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">#</span>
                                                <span className="text-xs font-semibold">Últ.</span>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex flex-col gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Empresa</span>
                                                <span className="text-xs font-semibold">Razón Social</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dueño</span>
                                                <span className="text-xs font-semibold">Propietario</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Encargado</span>
                                                <span className="text-xs font-semibold">Responsable</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tributario</span>
                                                <span className="text-xs font-semibold">Régimen</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Laboral</span>
                                                <span className="text-xs font-semibold">Régimen</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nivel</span>
                                                <span className="text-xs font-semibold">Categoría</span>
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <div className="flex flex-col items-center gap-0.5 text-muted-foreground">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Imp.</span>
                                                <span className="text-xs font-semibold">ISC</span>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client, index) => (
                                        <TableRow
                                            key={client.ruc}
                                            className="hover:bg-muted/70 cursor-pointer transition-colors"
                                            onDoubleClick={() => router.push(`/dashboard/clientes/${client.ruc}`)}
                                        >
                                            <TableCell className="text-muted-foreground">
                                                {(currentPage - 1) * PAGE_SIZE + index + 1}
                                            </TableCell>
                                            <TableCell className="font-mono text-blue-600 font-medium dark:text-blue-400">
                                                {client.ruc}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {client.ultimo_digito_ruc ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="font-mono text-xs w-6 h-6 p-0 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                                    >
                                                        {client.ultimo_digito_ruc}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium text-foreground">
                                                {client.razon_social}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-center">
                                                {client.propietario}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-center">
                                                {client.responsable_info?.nombre || "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {client.regimen_tributario}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        !client.regimen_laboral_tipo || client.regimen_laboral_tipo === "none"
                                                            ? "opacity-50"
                                                            : ""
                                                    }
                                                >
                                                    {client.regimen_laboral_tipo && client.regimen_laboral_tipo !== "none"
                                                        ? client.regimen_laboral_tipo
                                                        : "No asignado"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={(categoriaConfig[client.categoria] || categoriaConfig.default).className}
                                                    variant="outline"
                                                >
                                                    {(categoriaConfig[client.categoria] || categoriaConfig.default).label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {client.selectivo_consumo ? (
                                                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-700/50" variant="outline">
                                                        Sí
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between border-t pt-4 mt-4 text-sm dark:border-slate-800">
                            <div className="flex-1 text-muted-foreground">
                                Página {currentPage}
                                {totalCount > 0 && (
                                    <span className="ml-2 text-xs">
                                        (mostrando {(currentPage - 1) * 50 + 1}–{Math.min(currentPage * 50, totalCount)} de {totalCount})
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => prevUrl && handlePageChange(prevUrl, currentPage - 1)}
                                    disabled={!prevUrl || isPaginating}
                                    className={isPaginating && prevUrl ? "opacity-50" : ""}
                                >
                                    {isPaginating && prevUrl ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => nextUrl && handlePageChange(nextUrl, currentPage + 1)}
                                    disabled={!nextUrl || isPaginating}
                                    className={isPaginating && nextUrl ? "opacity-50" : ""}
                                >
                                    Siguiente
                                    {isPaginating && nextUrl ? <Loader2 className="h-4 w-4 ml-1 animate-spin" /> : null}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}