"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { clientesService } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClientForm } from "./client-form"
import { CredentialsViewer } from "./credentials-viewer"
import { Loader2, Plus, Search, Key, X, Check, ArrowBigDownDash, RefreshCw, Hash, User, ShieldCheck, Briefcase, LayoutGrid, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"
import { HighlightedText } from "@/components/ui/highlighted-text"
import { responsableService } from "@/features/responsables/services/responsable.service"
import { IResponsable } from "@/features/responsables/types/responsable"
import type { AxiosError } from "axios"
import { categoriaConfig } from "@/features/shared/types"
import { ExcelButton } from "./excel-button"
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

export function ClientsTable() {
    const router = useRouter()
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCredentialsClient, setSelectedCredentialsClient] = useState<ICliente | null>(null)
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedRucs, setSelectedRucs] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [isExportingAll, setIsExportingAll] = useState(false)
    const [clientToDelete, setClientToDelete] = useState<ICliente | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false)
    const [fetchingCredentialsId, setFetchingCredentialsId] = useState<string | null>(null)

    // Responsible Export states
    const [responsables, setResponsables] = useState<IResponsable[]>([])
    const [selectedResponsableIds, setSelectedResponsableIds] = useState<number[]>([])
    const [isResponsableModalOpen, setIsResponsableModalOpen] = useState(false)
    const [isExportingResponsible, setIsExportingResponsible] = useState(false)

    // Pagination states
    const [isPaginating, setIsPaginating] = useState(false)
    const [nextUrl, setNextUrl] = useState<string | null>(null)
    const [prevUrl, setPrevUrl] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetchClients(undefined, 1)
    }, [debouncedSearchTerm])

    useEffect(() => {
        const fetchResponsables = async () => {
            try {
                const data = await responsableService.getAll()
                setResponsables(data)
            } catch (error) {
                console.error("Error loading responsables:", error)
            }
        }
        fetchResponsables()
    }, [])

    const fetchClients = async (url?: string, page: number = 1) => {
        try {
            if (url) {
                setIsPaginating(true)
            } else {
                setLoading(true)
            }
            setCurrentPage(page)
            const data = await clientesService.getAll(url, debouncedSearchTerm)
            setClients(data.results)
            setNextUrl(data.next)
            setPrevUrl(data.previous)
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>
            setError(axiosError.response?.data?.detail || "Error al cargar los clientes.")
            console.error("Fetch error:", err)
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

    const handleRefresh = () => {
        fetchClients()
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

        let toastId;
        try {
            setIsExporting(true)
            toastId = toast.loading("Exportando clientes...", { position: "bottom-right" })

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
            toast.error("Error al exportar clientes", { id: toastId, position: "bottom-right" })
        } finally {
            setIsExporting(false)
        }
    }

    const handleExportAll = async () => {
        let toastId;
        try {
            setIsExportingAll(true)
            toastId = toast.loading("Generando Excel con todos los clientes de la base...", { position: "bottom-right" })

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
            toast.error("Error al generar el archivo Excel", { id: toastId, position: "bottom-right" })
        } finally {
            setIsExportingAll(false)
        }
    }

    const handleExportByResponsables = async () => {
        if (selectedResponsableIds.length === 0) {
            toast.error("Debe seleccionar al menos un responsable", { position: "bottom-right" })
            return
        }

        let toastId;
        try {
            setIsExportingResponsible(true)
            toastId = toast.loading("Generando Excel por responsables...", { position: "bottom-right" })

            const blob = await clientesService.exportByResponsables(selectedResponsableIds)

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "Clientes_Por_Responsable.xlsx"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success("Exportación por responsable completada", { id: toastId, position: "bottom-right" })
            setIsResponsableModalOpen(false)
        } catch (error) {
            console.error(error)
            toast.error("Error al generar el archivo Excel o responsables sin clientes", { id: toastId, position: "bottom-right" })
        } finally {
            setIsExportingResponsible(false)
        }
    }

    const handleDeactivate = (client: ICliente) => {
        setClientToDelete(client)
        setIsDeleteDialogOpen(true)
    }

    const confirmDeactivate = async () => {
        if (!clientToDelete) return

        try {
            await clientesService.darBaja(clientToDelete.ruc)
            toast.success("Cliente dado de baja exitosamente", { position: "bottom-right" })
            fetchClients()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo dar de baja al cliente", { position: "bottom-right" })
        } finally {
            setIsDeleteDialogOpen(false)
            setClientToDelete(null)
        }
    }

    return (
        <div className="space-y-6 pt-2">
            {/* Search and Actions with Glassmorphism */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Buscar por razón social, RUC o propietario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-slate-900 dark:text-white"
                        disabled={isSelectionMode}
                    />
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {isSelectionMode ? (
                        <>
                            <Button
                                onClick={handleExport}
                                disabled={isExporting || selectedRucs.length === 0}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                            >
                                {isExporting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Exportar ({selectedRucs.length})
                            </Button>
                            <Button
                                onClick={toggleSelectionMode}
                                variant="outline"
                                disabled={isExporting}
                                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-wrap gap-2 w-full justify-end">
                            <ExcelButton
                                onExportAll={() => setIsExportConfirmOpen(true)}
                                onClickExportResponsible={() => setIsResponsableModalOpen(true)}
                                onClickManual={toggleSelectionMode}
                                isSelectionMode={isSelectionMode}
                                isExportingAll={isExportingAll}
                            />
                            <Button
                                onClick={handleCreate}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Cliente
                            </Button>
                            <Button
                                onClick={handleRefresh}
                                variant="ghost"
                                className="rounded-xl h-11 w-11 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                title="Actualizar datos"
                            >
                                <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-semibold animate-in zoom-in duration-300">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5" />
                        {error}
                    </div>
                </div>
            )}

            {/* Premium Table Container */}
            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    <Table>
                        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                            <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
                                {isSelectionMode && (
                                    <TableHead className="w-12 text-center">
                                        <Checkbox
                                            checked={filteredClients.length > 0 && filteredClients.every(c => selectedRucs.includes(c.ruc))}
                                            onCheckedChange={toggleSelectAll}
                                            className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                    </TableHead>
                                )}
                                <TableHead className="w-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Hash className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RUC / ID</TableHead>
                                <TableHead className="w-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Dig.</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[250px]">Razón Social / Propietario</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Control</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Responsable</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Tributación</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Laboral</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Cat.</TableHead>
                                <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isSelectionMode ? 11 : 10} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="h-16 w-16 rounded-full border-4 border-slate-100 dark:border-slate-800 animate-pulse" />
                                                <Loader2 className="absolute inset-0 h-16 w-16 text-blue-500 animate-spin" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                                                Cargando registros...
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isSelectionMode ? 11 : 10} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-2">
                                                <Info className="h-8 w-8" />
                                            </div>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">Sin resultados</p>
                                            <p className="text-sm text-slate-500 max-w-[250px] mx-auto">
                                                No encontramos clientes que coincidan con &quot;{searchTerm}&quot;
                                            </p>
                                            <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-2 rounded-xl text-xs font-bold uppercase">
                                                Limpiar búsqueda
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClients.map((client, index) => (
                                    <TableRow
                                        key={client.ruc}
                                        className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer border-b border-slate-100 dark:border-slate-800/60 transition-colors duration-200"
                                        onDoubleClick={() => router.push(`/dashboard/clientes/${client.ruc}`)}
                                        style={{ 
                                            animationDelay: `${index * 30}ms`,
                                            opacity: 0,
                                            animation: 'fade-in 0.4s ease-out forwards'
                                        }}
                                    >
                                        {isSelectionMode && (
                                            <TableCell className="text-center">
                                                <Checkbox
                                                    checked={selectedRucs.includes(client.ruc)}
                                                    onCheckedChange={() => toggleSelectClient(client.ruc)}
                                                    className="border-slate-300 dark:border-slate-600"
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className="text-center font-bold text-slate-400 text-xs">
                                            {(currentPage - 1) * 50 + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">
                                                    <HighlightedText text={client.ruc} highlight={searchTerm} />
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {client.ultimo_digito_ruc ? (
                                                <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono text-xs font-black text-slate-900 dark:text-slate-100 shadow-sm">
                                                    {client.ultimo_digito_ruc}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col max-w-[400px]">
                                                <span className="font-black text-slate-900 dark:text-white text-base md:text-lg lg:text-xl line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    <HighlightedText text={client.razon_social} highlight={searchTerm} />
                                                </span>
                                                <div className="flex items-center gap-2 mt-1.5 text-slate-500">
                                                    <User className="h-4 w-4" />
                                                    <span className="text-sm font-bold truncate">
                                                        <HighlightedText text={client.propietario} highlight={searchTerm} />
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`text-s font-black px-2 py-1 rounded-md ${client.codigo_control ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" : "text-slate-300"}`}>
                                                {client.codigo_control ? `#${client.codigo_control}` : "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-s font-bold text-slate-700 dark:text-slate-300">
                                                    {client.responsable_info?.nombre || "Sin Asignar"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 font-black text-[13px] rounded-lg">
                                                {client.regimen_tributario}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {!client.regimen_laboral_tipo || client.regimen_laboral_tipo === "none" ? (
                                                <span className="text-[13px] font-bold text-slate-300 uppercase tracking-tighter">Sin Laboral</span>
                                            ) : (
                                                <Badge variant="outline" className="bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800 font-bold text-[13px] rounded-lg">
                                                    {client.regimen_laboral_tipo}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge 
                                                className={`font-black text-[13px] rounded-lg border-2 ${(categoriaConfig[client.categoria] || categoriaConfig.default).className}`} 
                                                variant="outline"
                                            >
                                                {(categoriaConfig[client.categoria] || categoriaConfig.default).label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2 transition-all">
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewCredentials(client);
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-10 w-10 p-0 text-amber-500 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/40 rounded-xl border border-amber-200/50 dark:border-amber-800/50 shadow-sm"
                                                    title="Ver credenciales"
                                                    disabled={fetchingCredentialsId === client.ruc}
                                                >
                                                    {fetchingCredentialsId === client.ruc ? <Loader2 className="h-5 w-5 animate-spin" /> : <Key className="h-5 w-5" />}
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeactivate(client);
                                                    }}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-10 w-10 p-0 text-rose-500 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/40 rounded-xl border border-rose-200/50 dark:border-rose-800/50 shadow-sm"
                                                    title="Dar de baja"
                                                >
                                                    <ArrowBigDownDash className="h-6 w-6" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination with Refined UI */}
                {(!loading && clients.length > 0) && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 space-y-4 sm:space-y-0">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <span className="text-xs font-black text-blue-600">{currentPage}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Página Actual</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchClients(prevUrl!, currentPage - 1)}
                                disabled={!prevUrl || isPaginating}
                                className="rounded-xl h-10 px-5 font-bold text-xs uppercase bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30"
                            >
                                {isPaginating && prevUrl ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                Anterior
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchClients(nextUrl!, currentPage + 1)}
                                disabled={!nextUrl || isPaginating}
                                className="rounded-xl h-10 px-5 font-bold text-xs uppercase bg-blue-600 dark:bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all disabled:opacity-30"
                            >
                                Siguiente
                                {isPaginating && nextUrl ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : null}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals & Dialogs (Preserving functionality) */}
            <ClientForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                client={selectedClient}
                onSuccess={() => {
                    fetchClients()
                }}
            />

            <AlertDialog open={isResponsableModalOpen} onOpenChange={setIsResponsableModalOpen}>
                <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white max-w-md rounded-3xl p-8 shadow-2xl">
                    <AlertDialogHeader className="space-y-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/20">
                            <LayoutGrid className="h-6 w-6 text-white" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Exportar por Responsable</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 font-medium">
                            Selecciona los responsables para generar el reporte de sus clientes asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-6 space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {responsables.length === 0 ? (
                            <div className="flex flex-col items-center py-8 gap-3 opacity-50">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Sincronizando equipo...</p>
                            </div>
                        ) : (
                            <div className="grid gap-2">
                                <div className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedResponsableIds.includes(0) ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent hover:border-white/10"}`} onClick={() => {
                                    setSelectedResponsableIds(prev => prev.includes(0) ? prev.filter(id => id !== 0) : [...prev, 0])
                                }}>
                                    <Checkbox
                                        id="resp-null"
                                        checked={selectedResponsableIds.includes(0)}
                                        className="h-5 w-5 border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md"
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedResponsableIds(prev => [...prev, 0])
                                            else setSelectedResponsableIds(prev => prev.filter(id => id !== 0))
                                        }}
                                    />
                                    <label className="text-sm font-bold leading-none cursor-pointer flex-1">Sin responsable asignado</label>
                                </div>
                                {responsables.map((resp) => (
                                    <div key={resp.id} className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedResponsableIds.includes(resp.id) ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent hover:border-white/10"}`} onClick={() => {
                                        setSelectedResponsableIds(prev => prev.includes(resp.id) ? prev.filter(id => id !== resp.id) : [...prev, resp.id])
                                    }}>
                                        <Checkbox
                                            id={`resp-${resp.id}`}
                                            checked={selectedResponsableIds.includes(resp.id)}
                                            className="h-5 w-5 border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md"
                                            onCheckedChange={(checked) => {
                                                if (checked) setSelectedResponsableIds(prev => [...prev, resp.id])
                                                else setSelectedResponsableIds(prev => prev.filter(id => id !== resp.id))
                                            }}
                                        />
                                        <label className="text-sm font-bold leading-none cursor-pointer flex-1">{resp.nombre}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel
                            className="bg-white/5 border-transparent hover:bg-white/10 text-white rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest transition-all"
                            onClick={() => setSelectedResponsableIds([])}
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <Button
                            onClick={handleExportByResponsables}
                            disabled={isExportingResponsible || selectedResponsableIds.length === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 flex-1 font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            {isExportingResponsible ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generando...
                                </>
                            ) : (
                                "Exportar Excel"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CredentialsViewer
                open={isCredentialsModalOpen}
                onOpenChange={setIsCredentialsModalOpen}
                client={selectedCredentialsClient}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white rounded-3xl p-8 max-w-md shadow-2xl">
                    <AlertDialogHeader className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-rose-600/20 border border-rose-600/30 flex items-center justify-center mb-2">
                            <ShieldCheck className="h-7 w-7 text-rose-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Confirmar Baja</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 font-medium leading-relaxed">
                            El cliente <span className="text-white font-bold">&quot;{clientToDelete?.razon_social}&quot;</span> pasará a estado inactivo. 
                            <br/><br/>
                            ¿Desea continuar con esta acción irreversible de gestión?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="bg-white/5 border-transparent hover:bg-white/10 text-white h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest grow">Ignorar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeactivate}
                            className="bg-rose-600 hover:bg-rose-700 text-white h-12 rounded-xl grow font-bold shadow-lg shadow-rose-500/20"
                        >
                            Ejecutar Baja
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isExportConfirmOpen} onOpenChange={setIsExportConfirmOpen}>
                <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/10 text-white rounded-3xl p-8 max-w-md shadow-2xl">
                    <AlertDialogHeader className="space-y-4">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center mb-2 text-emerald-500">
                            <Briefcase className="h-7 w-7" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Confirmar Exportación</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 font-medium leading-relaxed">
                            Se descargarán todos los clientes registrados en el sistema. Dependiendo del volumen de datos, esto puede tomar unos segundos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3">
                        <AlertDialogCancel className="bg-white/5 border-transparent hover:bg-white/10 text-white h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest grow">Cerrar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setIsExportConfirmOpen(false);
                                handleExportAll();
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl grow font-bold shadow-lg shadow-blue-500/20"
                        >
                            Confirmar y Descargar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div >
    )
}
