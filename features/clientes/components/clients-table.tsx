"use client"

import { useEffect, useState } from "react"
import { clientesService } from "../services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClientModal } from "./client-modal"
import { Loader2, Plus, Search } from "lucide-react"
import { type AxiosError } from "axios"
import { categoriaConfig } from "@/features/shared/types"

export function ClientsTable() {
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<ICliente | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

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
                    />
                </div>
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
            </div>

            {/* Error Message */}
            {error && <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>}

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-300">RUC</TableHead>
                            <TableHead className="text-slate-300">Razón Social</TableHead>
                            <TableHead className="text-slate-300">Propietario</TableHead>
                            <TableHead className="text-slate-300">Codigo de control</TableHead>
                            <TableHead className="text-slate-300">Responsable</TableHead>
                            <TableHead className="text-slate-300">Régimen Tributario</TableHead>
                            <TableHead className="text-slate-300">Regime Laboral</TableHead>
                            <TableHead className="text-slate-300">Estado</TableHead>
                            <TableHead className="text-slate-300">Categoria</TableHead>
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
                                    <TableCell className="text-slate-300">{client.codigo_control || "-"}</TableCell>
                                    <TableCell className="text-slate-300">{client.responsable}</TableCell>
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
                                    <TableCell className="text-slate-300">
                                        <Badge className={categoriaConfig[client.categoria].className} variant="outline">
                                            {categoriaConfig[client.categoria].label}
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
