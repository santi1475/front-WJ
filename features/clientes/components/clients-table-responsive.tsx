"use client"

import { useEffect, useState } from "react"
import { clientesService } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClientModal } from "./client-modal"
import { Loader2, Plus, Search, Edit2, ChevronDown } from "lucide-react"
import { useResponsive } from "@/hooks/use-responsive"

export function ClientsTableResponsive() {
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const { isMobile } = useResponsive()

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            setLoading(true)
            const data = await clientesService.getAll()
            setClients(data)
        } catch (err: any) {
            setError("Error al cargar clientes")
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
                                <TableHead className="text-slate-300">RUC</TableHead>
                                <TableHead className="text-slate-300">Razón Social</TableHead>
                                <TableHead className="text-slate-300">Propietario</TableHead>
                                <TableHead className="text-slate-300">Régimen</TableHead>
                                <TableHead className="text-slate-300">Estado</TableHead>
                                <TableHead className="text-slate-300 text-right">Acciones</TableHead>
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
                                filteredClients.map((client) => (
                                    <TableRow key={client.ruc} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="font-mono text-blue-400">{client.ruc}</TableCell>
                                        <TableCell className="text-white">{client.razon_social}</TableCell>
                                        <TableCell className="text-slate-300">{client.propietario}</TableCell>
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
                                            <Button
                                                onClick={() => handleEdit(client)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-400 hover:bg-blue-900/20"
                                            >
                                                Editar
                                            </Button>
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
                                        <div className="flex-1 min-w-0">
                                            <p className="font-mono text-blue-400 text-sm font-semibold">{client.ruc}</p>
                                            <p className="text-white font-medium truncate">{client.razon_social}</p>
                                            <p className="text-slate-400 text-sm">{client.propietario}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button
                                                onClick={() => handleEdit(client)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-400 hover:bg-blue-900/20 h-8 w-8 p-0"
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

            {/* Client Modal */}
            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                client={selectedClient}
                onSave={() => {
                    setIsModalOpen(false)
                    fetchClients()
                }}
            />
        </div>
    )
}
