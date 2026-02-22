"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { clientesService } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClientForm } from "./client-form"
import { CredentialsViewer } from "./credentials-viewer"
import { Loader2, Plus, Search, Key, X, Check, ArrowBigDownDash } from "lucide-react"
import type { AxiosError } from "axios"
import { categoriaConfig } from "@/features/shared/types"
import { ExcelButton } from "./excel-button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
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
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCredentialsClient, setSelectedCredentialsClient] = useState<ICliente | null>(null)
    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false)
    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedRucs, setSelectedRucs] = useState<string[]>([])
    const [isExporting, setIsExporting] = useState(false)
    const [clientToDelete, setClientToDelete] = useState<ICliente | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
        (client) =>
            client.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.propietario.toLowerCase().includes(searchTerm.toLowerCase()),
    )

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
            toast.error("Debe seleccionar al menos un cliente", { position: "bottom-right" })
            return
        }

        try {
            setIsExporting(true)
            const toastId = toast.loading("Exportando clientes...", { position: "bottom-right" })

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
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por razón social o propietario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-muted/50 border-input focus:bg-background dark:bg-slate-950 dark:border-slate-700 dark:text-white"
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
                        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Cliente
                        </Button>
                        <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="border-input hover:bg-muted dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:bg-transparent"
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
                        <TableRow className="hover:bg-transparent">
                            {isSelectionMode && (
                                <TableHead className="w-50px text-muted-foreground">
                                    <Checkbox
                                        checked={filteredClients.length > 0 && selectedRucs.length === filteredClients.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                            )}
                            <TableHead className="w-50px text-muted-foreground">N°</TableHead>
                            <TableHead className="text-muted-foreground">RUC</TableHead>
                            <TableHead className="text-muted-foreground">Razón Social</TableHead>
                            <TableHead className="text-muted-foreground text-center">Propietario</TableHead>
                            <TableHead className="text-muted-foreground text-center">Codigo de control</TableHead>
                            <TableHead className="text-muted-foreground text-center">Responsable</TableHead>
                            <TableHead className="text-muted-foreground text-center">Régimen Tributario</TableHead>
                            <TableHead className="text-muted-foreground text-center">Régimen Laboral</TableHead>
                            <TableHead className="text-muted-foreground text-center">Categoria</TableHead>
                            <TableHead className="text-muted-foreground text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={isSelectionMode ? 12 : 11} className="text-center text-muted-foreground py-8">
                                    No hay clientes registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client, index) => (
                                <TableRow
                                    key={client.ruc}
                                    className="hover:bg-muted/70 cursor-pointer"
                                    onDoubleClick={() => router.push(`/dashboard/clientes/${client.ruc}`)}
                                >
                                    {isSelectionMode && (
                                        <TableCell className="w-50px">
                                            <Checkbox
                                                checked={selectedRucs.includes(client.ruc)}
                                                onCheckedChange={() => toggleSelectClient(client.ruc)}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className="font-mono text-blue-600 font-medium dark:text-blue-400">{client.ruc}</TableCell>
                                    <TableCell className="font-medium text-foreground">{client.razon_social}</TableCell>
                                    <TableCell className="text-muted-foreground text-center">{client.propietario}</TableCell>
                                    <TableCell className="text-muted-foreground text-center">{client.codigo_control || "-"}</TableCell>
                                    <TableCell className="text-muted-foreground text-center">
                                        {client.responsable_info?.nombre || "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">
                                            {client.regimen_tributario}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary">
                                            {client.regimen_laboral_tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={(categoriaConfig[client.categoria] || categoriaConfig.default).className} variant="outline">
                                            {(categoriaConfig[client.categoria] || categoriaConfig.default).label}
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
                                            <Button
                                                onClick={() => handleDeactivate(client)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:bg-red-900/20"
                                                title="Dar de baja"
                                            >
                                                <ArrowBigDownDash className="h-4 w-4" />
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro de dar de baja a este cliente?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            El cliente &quot;{clientToDelete?.razon_social}&quot; pasará a estado inactivo y no aparecerá en la lista principal.
                            Podrá consultarlo y reactivarlo desde el historial de bajas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDeactivate}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Dar de baja
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    )
}
