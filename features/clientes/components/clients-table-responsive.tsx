"use client"

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
import { ClientHistory } from "@/features/clientes/components/client-history"
import { Loader2, Plus, Search, Edit2, ChevronDown, Key, History } from "lucide-react"
import { useResponsive } from "@/hooks/use-responsive"
import { useAuth } from "@/hooks/use-auth"
import axios, { AxiosError } from "axios"
import { ExcelButton } from "./excel-button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Check, X } from "lucide-react"

interface ClientsTableResponsiveProps {
    disableEdit?: boolean
    showAllClients?: boolean // Para el dashboard principal, mostrar todos los clientes
}

export function ClientsTableResponsive({ disableEdit = false, showAllClients = false }: ClientsTableResponsiveProps) {
    const { isAdminOrSuperAdmin } = useAuth()
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [selectedCredentialsClient, setSelectedCredentialsClient] = useState<ICliente | null>(null)
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false)
    const [selectedHistoryClient, setSelectedHistoryClient] = useState<ICliente | null>(null)
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedRucs, setSelectedRucs] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const { isMobile } = useResponsive()

    useEffect(() => {
        fetchClients()
    }, [showAllClients])

    const fetchClients = async () => {
        try {
            setLoading(true)
            // Si showAllClients es true (dashboard), obtener todos los clientes
            // Si no, obtener solo los clientes del usuario (según permisos del backend)
            const data = showAllClients
                ? await clientesService.getAllForDashboard()
                : await clientesService.getAll()
            setClients(data)
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
        }
    }

    const filteredClients = clients.filter(
        (client) => client.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) || client.ruc.includes(searchTerm),
    )

    const handleEdit = (client: ICliente) => {
        setSelectedClient(client)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setSelectedClient(null)
        setIsModalOpen(true)
    }

    const handleViewCredentials = (client: ICliente) => {
        setSelectedCredentialsClient(client)
        setIsCredentialsModalOpen(true)
    }

    const handleViewHistory = (client: ICliente) => {
        setSelectedHistoryClient(client)
        setIsHistoryModalOpen(true)
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
            toast.error("Debe seleccionar al menos un cliente")
            return
        }

        try {
            setIsExporting(true)
            const toastId = toast.loading("Exportando clientes...")

            const blob = await clientesService.exportSelected(selectedRucs)

            // Create download link
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "Clientes_Seleccionados.xlsx"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success("Exportación completada exitosamente", { id: toastId })
            setIsSelectionMode(false)
            setSelectedRucs([])
        } catch (error) {
            console.error(error)
            toast.error("Error al exportar clientes")
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
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Buscar por RUC o razón social..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white w-full"
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
                            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Nuevo</span>
                            </Button>
                            <Button
                                onClick={fetchClients}
                                variant="outline"
                                className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
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
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                {isSelectionMode && (
                                    <TableHead className="w-[50px] text-slate-300">
                                        <Checkbox
                                            checked={filteredClients.length > 0 && selectedRucs.length === filteredClients.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                )}
                                <TableHead className="w-[50px] text-slate-300">N°</TableHead>
                                <TableHead className="text-slate-300">RUC</TableHead>
                                <TableHead className="text-slate-300">Razón Social</TableHead>
                                <TableHead className="text-slate-300">Propietario</TableHead>
                                <TableHead className="text-slate-300">Responsable</TableHead>
                                <TableHead className="text-slate-300">Régimen</TableHead>
                                <TableHead className="text-slate-300">Estado</TableHead>
                                <TableHead className="text-slate-300 text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.length === 0 ? (
                                <TableRow className="border-slate-800">
                                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                                        No hay clientes registrados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClients.map((client, index) => (
                                    <TableRow key={client.ruc} className="border-slate-800 hover:bg-slate-800/30">
                                        {isSelectionMode && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRucs.includes(client.ruc)}
                                                    onCheckedChange={() => toggleSelectClient(client.ruc)}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className="text-slate-400">{index + 1}</TableCell>
                                        <TableCell className="font-mono text-blue-400">{client.ruc}</TableCell>
                                        <TableCell className="text-white">{client.razon_social}</TableCell>
                                        <TableCell className="text-slate-300">{client.propietario}</TableCell>
                                        <TableCell className="text-slate-300">
                                            {client.responsable_info?.full_name || client.responsable_info?.username || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                {client.regimen_tributario}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    onClick={() => handleViewCredentials(client)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-yellow-400 hover:bg-yellow-900/20"
                                                    title="Ver credenciales"
                                                >
                                                    <Key className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleEdit(client)}
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-blue-400 hover:bg-blue-900/20"
                                                    disabled={disableEdit}
                                                    title={disableEdit ? "No tienes permisos para editar" : "Editar cliente"}
                                                >
                                                    Editar
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
                        <Card className="border-slate-800 bg-slate-900/50">
                            <CardContent className="pt-6 text-center text-slate-400">No hay clientes registrados</CardContent>
                        </Card>
                    ) : (
                        filteredClients.map((client) => (
                            <Card key={client.ruc} className="border-slate-800 bg-slate-900/50">
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
                                            <p className="font-mono text-blue-400 text-sm font-semibold">{client.ruc}</p>
                                            <p className="text-white font-medium truncate">{client.razon_social}</p>
                                            <p className="text-slate-400 text-sm">{client.propietario}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <Button
                                                onClick={() => handleViewHistory(client)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-slate-400 hover:bg-slate-800 h-8 w-8 p-0"
                                                title="Ver historial"
                                            >
                                                <History className="h-4 w-4" />
                                            </Button>
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
                                                onClick={() => handleEdit(client)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-400 hover:bg-blue-900/20 h-8 w-8 p-0"
                                                disabled={disableEdit}
                                                title={disableEdit ? "No tienes permisos para editar" : "Editar cliente"}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                onClick={() => setExpandedRow(expandedRow === client.ruc ? null : client.ruc)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-slate-400 hover:bg-slate-800 h-8 w-8 p-0"
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform ${expandedRow === client.ruc ? "rotate-180" : ""}`}
                                                />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {expandedRow === client.ruc && (
                                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Responsable:</span>
                                                <span className="text-slate-300 text-sm">
                                                    {client.responsable_info?.full_name || client.responsable_info?.username || "-"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Régimen:</span>
                                                <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                    {client.regimen_tributario}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400 text-sm">Estado:</span>
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

            <ClientHistory
                open={isHistoryModalOpen}
                onOpenChange={setIsHistoryModalOpen}
                historial={selectedHistoryClient?.historial || []}
            />
        </div>
    )
}
