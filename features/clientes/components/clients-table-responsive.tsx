"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { clientesService } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClientForm } from "@/features/clientes/components/client-form"
import { CredentialsViewer } from "@/features/clientes/components/credentials-viewer"
import { Loader2, Plus, Search, ChevronDown, Key, ArrowRight, RefreshCw, User, Briefcase, Hash, Info, Check, X } from "lucide-react"
import { AxiosError } from "axios"
import { categoriaConfig } from "@/features/shared/types"
import { useResponsive } from "@/hooks/use-responsive"
import { useAuth } from "@/hooks/use-auth"
import { ExcelButton } from "./excel-button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"
import { HighlightedText } from "@/components/ui/highlighted-text"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ClientsTableResponsiveProps {
    disableEdit?: boolean
    showAllClients?: boolean
}

export function ClientsTableResponsive({ disableEdit = false, showAllClients = false }: ClientsTableResponsiveProps) {
    const router = useRouter()
    const { isAdminOrSuperAdmin } = useAuth()
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [selectedCredentialsClient, setSelectedCredentialsClient] = useState<ICliente | null>(null)
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedRucs, setSelectedRucs] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [isExportingAll, setIsExportingAll] = useState(false)
    const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false)
    const [fetchingCredentialsId, setFetchingCredentialsId] = useState<string | null>(null)

    // Pagination states
    const [isPaginating, setIsPaginating] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const { isMobile } = useResponsive()

    useEffect(() => {
        fetchClients(undefined, 1)
    }, [showAllClients, debouncedSearchTerm])

    const fetchClients = async (url?: string, page: number = 1) => {
        try {
            if (url) {
                setIsPaginating(true)
            } else {
                setLoading(true)
            }
            setCurrentPage(page)
            const data = showAllClients
                ? await clientesService.getAllForDashboard(url, debouncedSearchTerm)
                : await clientesService.getAll(url, debouncedSearchTerm)

            setClients(data.results)
            setNextUrl(data.next)
            setPrevUrl(data.previous)
        } catch (err: unknown) {
            setError("Error al cargar clientes")
            if (err instanceof AxiosError) {
                const axiosError = err as AxiosError<{ detail?: string }>
                console.error("API Error:", axiosError.response?.data?.detail || axiosError.message)
            }
        } finally {
            setLoading(false)
            setIsPaginating(false)
        }
    }

    const filteredClients = clients

    const handleCreate = () => {
        setSelectedClient(null)
        setIsModalOpen(true)
    }

    const handleViewCredentials = async (client: ICliente) => {
        try {
            setFetchingCredentialsId(client.ruc)
            const fullClient = await clientesService.getById(client.ruc)
            setSelectedCredentialsClient(fullClient)
            setIsCredentialsModalOpen(true)
        } catch (error) {
            console.error("Error al obtener credenciales del cliente:", error)
            toast.error("Error al cargar las credenciales del cliente", { position: "bottom-right" })
            setSelectedCredentialsClient(client)
            setIsCredentialsModalOpen(true)
        } finally {
            setFetchingCredentialsId(null)
        }
    }

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode)
        setSelectedRucs([])
    }

    const toggleSelectAll = () => {
        const visibleRucs = filteredClients.map((c) => c.ruc)
        const allVisibleSelected = visibleRucs.every(ruc => selectedRucs.includes(ruc));

        if (allVisibleSelected) {
            setSelectedRucs(prev => prev.filter(r => !visibleRucs.includes(r)))
        } else {
            setSelectedRucs(prev => {
                const newSelection = [...prev];
                visibleRucs.forEach(r => {
                    if (!newSelection.includes(r)) newSelection.push(r);
                });
                return newSelection;
            });
        }
    }

    const toggleSelectClient = (ruc: string) => {
        setSelectedRucs((prev) =>
            prev.includes(ruc) ? prev.filter((r) => r !== ruc) : [...prev, ruc]
        )
    }

    const handleExport = async () => {
        if (selectedRucs.length === 0) {
            toast.error("Debe seleccionar al menos un cliente", { position: "bottom-right" })
            return
        }

        try {
            setIsExporting(true)
            const toastId = toast.loading("Exportando clientes...")

            const blob = await clientesService.exportSelected(selectedRucs)

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "Clientes_Seleccionados.xlsx"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success("Exportación completada exitosamente", { id: toastId, position: "bottom-right" })
            setIsSelectionMode(false)
            setSelectedRucs([])
        } catch (error) {
            console.error(error)
            toast.error("Error al exportar clientes", { position: "bottom-right" })
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportAll = async () => {
        try {
            setIsExportingAll(true)
            const toastId = toast.loading("Generando Excel con todos los clientes de la base...", { position: "bottom-right" })

            const blob = await clientesService.exportAll()

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "Todos_Los_Clientes.xlsx"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success("Exportación total completada", { id: toastId, position: "bottom-right" })
        } catch (error) {
            console.error(error)
            toast.error("Error al generar el archivo Excel", { position: "bottom-right" })
        } finally {
            setIsExportingAll(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Search and Actions with Glassmorphism */}
            <div className="flex flex-col sm:flex-row gap-3 items-center bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm animate-in fade-in duration-300">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Buscar por RUC o razón social..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-11 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {isSelectionMode ? (
                        <>
                            <Button
                                onClick={handleExport}
                                disabled={isExporting || selectedRucs.length === 0}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-emerald-500/10 flex-1 sm:flex-none"
                            >
                                {isExporting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                <span className="hidden sm:inline">Exportar ({selectedRucs.length})</span>
                                <span className="sm:hidden">({selectedRucs.length})</span>
                            </Button>
                            <Button
                                onClick={toggleSelectionMode}
                                variant="outline"
                                disabled={isExporting}
                                className="rounded-xl h-11 border-slate-200 dark:border-slate-800"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <ExcelButton
                                onExportAll={() => setIsExportConfirmOpen(true)}
                                onClickManual={toggleSelectionMode}
                                isSelectionMode={isSelectionMode}
                                isExportingAll={isExportingAll}
                            />
                            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-5 shadow-lg shadow-blue-500/10 flex-1 sm:flex-none">
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Nuevo</span>
                                <span className="sm:hidden">Crear</span>
                            </Button>
                            <Button
                                onClick={() => fetchClients()}
                                variant="ghost"
                                className="rounded-xl h-11 w-11 p-0 text-slate-400 hover:text-blue-600"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-2 animate-in zoom-in duration-300">
                    <Info className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* View Switching */}
            {!isMobile ? (
                /* Desktop Dashboard Table (Harmonized with main ClientsTable) */
                <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="overflow-x-auto rounded-2xl">
                        <Table className="min-w-[700px]">
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                                <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
                                    {isSelectionMode && (
                                        <TableHead className="w-12 text-center">...</TableHead>
                                    )}
                                    <TableHead className="w-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                        <div className="flex items-center justify-center gap-1"><Hash className="h-3 w-3" /></div>
                                    </TableHead>
                                    <TableHead className="min-w-[130px] text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identificación</TableHead>
                                    <TableHead className="min-w-[220px] text-[10px] font-bold text-slate-400 uppercase tracking-widest">Razón Social</TableHead>
                                    <TableHead className="min-w-[120px] text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Responsable</TableHead>
                                    <TableHead className="w-16 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Cat.</TableHead>
                                    <TableHead className="w-20 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</TableHead>
                                    <TableHead className="w-16 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Info</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && clients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isSelectionMode ? 8 : 7} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Consultando base...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredClients.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isSelectionMode ? 8 : 7} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-2 grayscale">
                                                <Info className="h-10 w-10 text-slate-300" />
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin resultados</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClients.map((client, index) => (
                                        <TableRow
                                            key={client.ruc}
                                            className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer border-b border-slate-100 dark:border-slate-800/60 transition-colors"
                                            onDoubleClick={() => router.push(`/dashboard/clientes/${client.ruc}`)}
                                            style={{ animation: `fade-in 0.3s ease-out ${index * 30}ms forwards`, opacity: 0 }}
                                        >
                                            {isSelectionMode && (
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={selectedRucs.includes(client.ruc)}
                                                        onCheckedChange={() => toggleSelectClient(client.ruc)}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell className="text-center font-bold text-slate-300 text-[11px]">
                                                {(currentPage - 1) * 50 + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400 flex items-center gap-2">
                                                        <HighlightedText text={client.ruc} highlight={searchTerm} />
                                                        {client.ultimo_digito_ruc && (
                                                            <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center font-mono text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700">
                                                                {client.ultimo_digito_ruc}
                                                            </Badge>
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 dark:text-white text-base md:text-lg">
                                                        <HighlightedText text={client.razon_social} highlight={searchTerm} />
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                        <User className="h-3 w-3 text-slate-400" />
                                                        <HighlightedText text={client.propietario} highlight={searchTerm} />
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <User className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                                        {client.responsable_nombre || client.responsable_info?.nombre || "N/A"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`font-black text-[9px] rounded-md border-2 ${(categoriaConfig[client.categoria] || categoriaConfig.default).className}`} variant="outline">
                                                    {(categoriaConfig[client.categoria] || categoriaConfig.default).label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    className={`font-black text-[9px] rounded-md ${client.estado
                                                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                            : "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800"
                                                        }`}
                                                    variant="outline"
                                                >
                                                    {client.estado ? "ACTIVO" : "BAJA"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewCredentials(client);
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-10 w-10 p-0 text-amber-500 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50 shadow-sm"
                                                    disabled={fetchingCredentialsId === client.ruc}
                                                >
                                                    {fetchingCredentialsId === client.ruc ? <Loader2 className="h-5 w-5 animate-spin" /> : <Key className="h-5 w-5" />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ) : (
                /* Mobile Card View - Premium Upgrade */
                <div className="space-y-4">
                    {loading && clients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50 grayscale animate-pulse">
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sincronizando clientes móviles...</p>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sin resultados</p>
                        </div>
                    ) : (
                        filteredClients.map((client, index) => (
                            <Card
                                key={client.ruc}
                                className="group relative border-slate-200 dark:border-slate-800 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden active:scale-[0.98] transition-all"
                                onClick={() => setExpandedRow(expandedRow === client.ruc ? null : client.ruc)}
                                style={{ animation: `fade-in 0.4s ease-out ${index * 40}ms forwards`, opacity: 0 }}
                            >
                                <div className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors ${client.estado ? "bg-blue-600" : "bg-rose-500"}`} />
                                <CardContent className="p-5 pl-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-blue-600 dark:text-blue-400 text-sm tracking-tighter font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                                    <HighlightedText text={client.ruc} highlight={searchTerm} />
                                                    {client.ultimo_digito_ruc && (
                                                        <span className="flex items-center justify-center bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded text-[10px] h-4 w-4">
                                                            {client.ultimo_digito_ruc}
                                                        </span>
                                                    )}
                                                </span>
                                                <Badge className={`h-4 text-[8px] font-black tracking-tighter rounded-md border-0 ${(categoriaConfig[client.categoria] || categoriaConfig.default).className}`}>
                                                    {(categoriaConfig[client.categoria] || categoriaConfig.default).label}
                                                </Badge>
                                            </div>
                                            <h3 className="font-black text-slate-900 dark:text-white text-lg md:text-xl leading-tight">
                                                <HighlightedText text={client.razon_social} highlight={searchTerm} />
                                            </h3>
                                            <p className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2 tracking-tight line-clamp-1">
                                                <User className="h-4 w-4" />
                                                <HighlightedText text={client.propietario} highlight={searchTerm} />
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewCredentials(client);
                                                }}
                                                size="sm"
                                                variant="outline"
                                                className="h-10 w-10 p-0 rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-white/5 shadow-sm text-amber-500"
                                                disabled={fetchingCredentialsId === client.ruc}
                                            >
                                                {fetchingCredentialsId === client.ruc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                                            </Button>
                                            <ChevronDown className={`h-4 w-4 text-slate-300 transition-transform duration-300 ${expandedRow === client.ruc ? "rotate-180 text-blue-500" : ""}`} />
                                        </div>
                                    </div>

                                    {/* Expanded details - Premium Glass Style */}
                                    {expandedRow === client.ruc && (
                                        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80 animate-in slide-in-from-top-2 duration-300">
                                            <div className="grid gap-3">
                                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsable</span>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {client.responsable_nombre || client.responsable_info?.nombre || "S/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Régimen</span>
                                                    <Badge variant="outline" className="bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-[10px] rounded-lg border-indigo-100 dark:border-indigo-800">
                                                        {client.regimen_tributario}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    className="w-full bg-slate-900 dark:bg-blue-600 text-white font-black text-xs h-12 rounded-xl mt-2 group shadow-lg active:scale-95 transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/dashboard/clientes/${client.ruc}`);
                                                    }}
                                                >
                                                    Gestionar Expediente
                                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && clients.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-2 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xs">
                            {currentPage}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Panel de navegación</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {showAllClients && clients.length === 50 ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/dashboard/clientes')}
                                className="rounded-xl h-11 px-6 font-bold text-xs uppercase bg-white dark:bg-slate-900 shadow-sm grow sm:grow-0"
                            >
                                Ver todos
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchClients(prevUrl!, currentPage - 1)}
                                    disabled={!prevUrl || isPaginating}
                                    className="rounded-xl h-11 px-5 grow sm:grow-0 font-bold text-xs uppercase"
                                >
                                    {isPaginating && prevUrl ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Anterior"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchClients(nextUrl!, currentPage + 1)}
                                    disabled={!nextUrl || isPaginating}
                                    className="rounded-xl h-11 px-5 grow sm:grow-0 font-bold text-xs uppercase bg-blue-600 text-white border-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
                                >
                                    {isPaginating && nextUrl ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : "Siguiente"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modals & Dialogs (Preserving functionality) */}
            <ClientForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                client={selectedClient}
                onSuccess={() => fetchClients()}
            />

            <CredentialsViewer
                open={isCredentialsModalOpen}
                onOpenChange={setIsCredentialsModalOpen}
                client={selectedCredentialsClient}
            />

            <AlertDialog open={isExportConfirmOpen} onOpenChange={setIsExportConfirmOpen}>
                <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white w-[95%] sm:max-w-md rounded-3xl p-8 shadow-2xl">
                    <AlertDialogHeader className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center mb-2 text-emerald-500">
                            <Briefcase className="h-7 w-7" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight tracking-tight">Exportación Masiva</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 font-medium leading-relaxed">
                            Se descargarán todos los clientes registrados en el sistema. Dependiendo del volumen de datos, esto puede tomar unos segundos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
                        <AlertDialogCancel className="bg-white/5 border-transparent hover:bg-white/10 text-white h-12 rounded-xl grow font-bold uppercase text-[10px] tracking-widest mt-0">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setIsExportConfirmOpen(false);
                                handleExportAll();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl grow font-bold shadow-lg shadow-blue-500/20"
                        >
                            Descargar Excel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div >
    )
}
