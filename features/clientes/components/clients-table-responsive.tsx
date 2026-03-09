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
import { Loader2, Plus, Search, Edit2, ChevronDown, Key, ArrowRight } from "lucide-react"
import { AxiosError } from "axios"
import { categoriaConfig } from "@/features/shared/types"
import { useResponsive } from "@/hooks/use-responsive"
import { useAuth } from "@/hooks/use-auth"
import axios from "axios"
import { ExcelButton } from "./excel-button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Check, X } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

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
            } else if (err instanceof Error) {
                console.error("System Error:", err.message)
            } else {
                console.error("Unknown Error:", err)
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

    const handleViewCredentials = (client: ICliente) => {
        setSelectedCredentialsClient(client)
        setIsCredentialsModalOpen(true)
    }

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode)
        setSelectedRucs([])
    }

    const toggleSelectAll = () => {
        if (selectedRucs.length === filteredClients.length) {
            setSelectedRucs([])
        } else {
            setSelectedRucs(filteredClients.map((c) => c.ruc))
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

    if (loading && clients.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <Input
                        placeholder="Buscar por RUC o razón social..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full bg-muted/50 border-input text-foreground focus:bg-background focus:ring-2 dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100"
                    />
                </div>
                <div className="flex gap-2">
                    {isSelectionMode ? (
                        <>
                            <Button
                                onClick={handleExport}
                                disabled={isExporting || selectedRucs.length === 0}
                                className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                            >
                                {isExporting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                <span className="hidden sm:inline">Confirmar ({selectedRucs.length})</span>
                                <span className="sm:hidden">({selectedRucs.length})</span>
                            </Button>
                            <Button
                                onClick={toggleSelectionMode}
                                variant="destructive"
                                disabled={isExporting}
                                className="flex-1 sm:flex-none"
                            >
                                <X className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Cancelar</span>
                            </Button>
                        </>
                    ) : (
                        <>
                            <ExcelButton
                                onClick={toggleSelectionMode}
                                isSelectionMode={isSelectionMode}
                            />
                            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none text-white">
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Nuevo</span>
                            </Button>
                            <Button
                                onClick={() => fetchClients()}
                                variant="outline"
                                className="border-input hover:bg-muted"
                            >
                                Actualizar
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>}

            {/* Desktop Table View */}
            {!isMobile && (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                {isSelectionMode && (
                                    <TableHead className="w-12.5">
                                        <Checkbox
                                            checked={filteredClients.length > 0 && selectedRucs.length === filteredClients.length}
                                            onCheckedChange={toggleSelectAll}
                                            className="border-border bg-input"
                                        />
                                    </TableHead>
                                )}
                                <TableHead className="w-12.5 font-semibold text-slate-700 dark:text-slate-300">N°</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">RUC</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center dark:text-slate-300" title="Último Dígito">Últ.</TableHead>
                                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Razón Social</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center dark:text-slate-300">Propietario</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center dark:text-slate-300">Responsable</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center dark:text-slate-300">Categoria</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-center dark:text-slate-300">Estado</TableHead>
                                <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        No hay clientes registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClients.map((client, index) => (
                                    <TableRow
                                        key={client.ruc}
                                        className="cursor-pointer"
                                        onDoubleClick={() => router.push(`/dashboard/clientes/${client.ruc}`)}
                                    >
                                        {isSelectionMode && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRucs.includes(client.ruc)}
                                                    onCheckedChange={() => toggleSelectClient(client.ruc)}
                                                    className="border-border bg-input"
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className="text-slate-600 dark:text-slate-400">{(currentPage - 1) * 50 + index + 1}</TableCell>
                                        <TableCell className="font-mono text-blue-600 font-medium dark:text-blue-400">{client.ruc}</TableCell>
                                        <TableCell className="text-center">
                                            {client.ultimo_digito_ruc ? (
                                                <Badge variant="outline" className="font-mono text-xs w-6 h-6 p-0 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                                    {client.ultimo_digito_ruc}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">{client.razon_social}</TableCell>
                                        <TableCell className="text-slate-600 text-center dark:text-slate-400">{client.propietario}</TableCell>
                                        <TableCell className="text-slate-600 text-center dark:text-slate-400">
                                            {client.responsable_info?.nombre || "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={(categoriaConfig[client.categoria] || categoriaConfig.default).className} variant="outline">
                                                {(categoriaConfig[client.categoria] || categoriaConfig.default).label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                className={
                                                    client.estado
                                                        ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                        : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                                }
                                                variant="outline"
                                            >
                                                {client.estado ? "Activo" : "Inactivo"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    onClick={() => handleViewCredentials(client)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-yellow-400 hover:bg-yellow-900/20"
                                                    title="Ver credenciales"
                                                >
                                                    <Key className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Mobile Card View */}
            {isMobile && (
                <div className="space-y-3">
                    {filteredClients.length === 0 ? (
                        <Card className="bg-muted/30">
                            <CardContent className="pt-6 text-center text-muted-foreground">No hay clientes registrados</CardContent>
                        </Card>
                    ) : (
                        filteredClients.map((client) => (
                            <Card
                                key={client.ruc}
                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                onDoubleClick={() => router.push(`/dashboard/clientes/${client.ruc}`)}
                            >
                                <CardContent className="pt-6">
                                    {/* Main row */}
                                    <div className="flex items-start justify-between gap-2">
                                        {isSelectionMode && (
                                            <div className="pt-1">
                                                <Checkbox
                                                    checked={selectedRucs.includes(client.ruc)}
                                                    onCheckedChange={() => toggleSelectClient(client.ruc)}
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-mono text-blue-500 text-sm font-semibold">{client.ruc}</p>
                                                {client.ultimo_digito_ruc && (
                                                    <Badge variant="outline" className="font-mono text-xs w-6 h-6 p-0 inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                                                        {client.ultimo_digito_ruc}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="font-medium truncate text-foreground">{client.razon_social}</p>
                                            <p className="text-muted-foreground text-sm">{client.propietario}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button
                                                onClick={() => handleViewCredentials(client)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-yellow-400 hover:bg-yellow-900/20 h-8 w-8 p-0"
                                                title="Ver credenciales"
                                            >
                                                <Key className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => setExpandedRow(expandedRow === client.ruc ? null : client.ruc)}
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expandedRow === client.ruc ? "rotate-180" : ""}`}
                                                />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {expandedRow === client.ruc && (
                                        <div className="mt-4 pt-4 border-t space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground text-sm">Responsable:</span>
                                                <span className="text-foreground text-sm">
                                                    {client.responsable_info?.nombre || "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground text-sm">Régimen:</span>
                                                <Badge variant="outline" className="text-foreground">
                                                    {client.regimen_tributario}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground text-sm">Estado:</span>
                                                <Badge
                                                    className={
                                                        client.estado
                                                            ? "bg-green-900/30 text-green-400 border border-green-700/50"
                                                            : "bg-red-900/30 text-red-400 border border-red-700/50"
                                                    }
                                                    variant="outline"
                                                >
                                                    {client.estado ? "Activo" : "Inactivo"}
                                                </Badge>
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
            {(!loading && clients.length > 0) && (
                <div className="flex items-center justify-between border-t pt-4 mt-4 text-sm w-full dark:border-slate-800">
                    <div className="flex-1 text-muted-foreground mr-4">
                        Página {currentPage}
                    </div>
                    <div className="flex gap-2">
                        {showAllClients && clients.length === 50 ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/dashboard/clientes')}
                            >
                                Ver todos los clientes
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchClients(prevUrl!, currentPage - 1)}
                                    disabled={!prevUrl || isPaginating}
                                    className={isPaginating && prevUrl ? "opacity-50" : ""}
                                >
                                    {isPaginating && prevUrl ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fetchClients(nextUrl!, currentPage + 1)}
                                    disabled={!nextUrl || isPaginating}
                                    className={isPaginating && nextUrl ? "opacity-50" : ""}
                                >
                                    Siguiente
                                    {isPaginating && nextUrl ? <Loader2 className="h-4 w-4 ml-1 animate-spin" /> : null}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Client Form Modal */}
            <ClientForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                client={selectedClient}
                onSuccess={() => {
                    fetchClients()
                }}
            />

            {/* Credentials Modal */}
            <CredentialsViewer
                open={isCredentialsModalOpen}
                onOpenChange={setIsCredentialsModalOpen}
                client={selectedCredentialsClient}
            />
        </div>
    )
}
