"use client"

import { useEffect, useState } from "react"
import { clientesService } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClientForm } from "./client-form"
import { CredentialsViewer } from "./credentials-viewer"
import { Loader2, Plus, Search, Key, X, Check } from "lucide-react"
import type { AxiosError } from "axios"
import { categoriaConfig } from "@/features/shared/types"
import { useAuth } from "@/hooks/use-auth"
import { ExcelButton } from "./excel-button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export function ClientsTable() {
    const { isAdminOrSuperAdmin } = useAuth()
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCredentialsClient, setSelectedCredentialsClient] = useState<ICliente | null>(null)
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedRucs, setSelectedRucs] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            setLoading(true)
            const data = await clientesService.getAll()
            setClients(data)
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>
            setError(axiosError.response?.data?.detail || "Error al cargar los clientes.")
            console.error("Fetch error:", err)
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

    const handleRefresh = () => {
        fetchClients()
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
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Buscar por RUC o razón social..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white"
                        disabled={isSelectionMode}
                    />
                </div>

                {isSelectionMode ? (
                    <>
                        <Button
                            onClick={handleExport}
                            disabled={isExporting || selectedRucs.length === 0}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isExporting ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 mr-2" />
                            )}
                            Confirmar ({selectedRucs.length})
                        </Button>
                        <Button
                            onClick={toggleSelectionMode}
                            variant="destructive"
                            disabled={isExporting}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                        </Button>
                    </>
                ) : (
                    <>
                        <ExcelButton
                            onClick={toggleSelectionMode}
                            isSelectionMode={isSelectionMode}
                        />
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Cliente
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                        >
                            Actualizar
                        </Button>
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>}

            {/* Table */}
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
                            <TableHead className="text-slate-300">Codigo de control</TableHead>
                            <TableHead className="text-slate-300">Responsable</TableHead>
                            <TableHead className="text-slate-300">Régimen Tributario</TableHead>
                            <TableHead className="text-slate-300">Regime Laboral</TableHead>
                            <TableHead className="text-slate-300">Estado</TableHead>
                            <TableHead className="text-slate-300 text-center">Categoria</TableHead>
                            <TableHead className="text-slate-300 text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow className="border-slate-800">
                                <TableCell colSpan={6} className="text-center text-slate-400 py-8">
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
                                    <TableCell className="text-slate-300">{client.codigo_control || "-"}</TableCell>
                                    <TableCell className="text-slate-300">
                                        {client.responsable_info?.full_name || client.responsable_info?.username || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                                            {client.regimen_tributario}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                                            {client.regimen_laboral_tipo}
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
                                    <TableCell className="text-slate-300 text-center">
                                        <Badge className={categoriaConfig[client.categoria].className} variant="outline">
                                            {categoriaConfig[client.categoria].label}
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
