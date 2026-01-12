"use client"

import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Copy, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Client {
    id: string
    razaSocial: string
    ruc: string
    responsable: string
    categoria: "A" | "B" | "C"
    estado: "activo" | "inactivo"
    propietario: string
    fechaIngreso: string
    claveSol?: string
    solUser?: string
}

interface DataGridViewProps {
    clients: Client[]
    onSelectClient: (client: Client) => void
    selectedClientId?: string
    onDeleteClient: (clientId: string) => void
}

export default function DataGridView({ clients, onSelectClient, selectedClientId, onDeleteClient }: DataGridViewProps) {
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
    const [filterResponsable, setFilterResponsable] = useState<string | null>(null)

    const responsables = useMemo(() => {
        return [...new Set(clients.map((c) => c.responsable))].sort()
    }, [clients])

    const filteredClients = useMemo(() => {
        if (!filterResponsable) return clients
        return clients.filter((c) => c.responsable === filterResponsable)
    }, [clients, filterResponsable])

    const togglePasswordVisibility = (id: string) => {
        const newVisible = new Set(visiblePasswords)
        if (newVisible.has(id)) {
            newVisible.delete(id)
        } else {
            newVisible.add(id)
        }
        setVisiblePasswords(newVisible)
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    const handleDelete = (client: Client) => {
        if (confirm(`¿Estás seguro de que deseas eliminar a ${client.razaSocial}?`)) {
            onDeleteClient(client.id)
            toast.success("Cliente eliminado")
        }
    }

    const getCategoryColor = (categoria: "A" | "B" | "C") => {
        switch (categoria) {
            case "A":
                return "bg-emerald-500/20 text-emerald-600 border-emerald-500"
            case "B":
                return "bg-amber-500/20 text-amber-600 border-amber-500"
            case "C":
                return "bg-red-500/20 text-red-600 border-red-500"
        }
    }

    const getStatusColor = (estado: "activo" | "inactivo") => {
        return estado === "activo" ? "bg-emerald-500" : "bg-red-500"
    }

    return (
        <div className="w-full space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
                <label className="text-sm font-medium text-muted-foreground">Filtrar por Responsable:</label>
                <Select
                    value={filterResponsable || "all"}
                    onValueChange={(value) => setFilterResponsable(value === "all" ? null : value)}
                >
                    <SelectTrigger className="w-48 bg-input border-border">
                        <SelectValue placeholder="Todos los responsables" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">Todos los responsables</SelectItem>
                        {responsables.map((responsable) => (
                            <SelectItem key={responsable} value={responsable}>
                                {responsable}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {filterResponsable && (
                    <span className="text-sm text-muted-foreground">
                        Mostrando {filteredClients.length} de {clients.length} clientes
                    </span>
                )}
            </div>

            {/* Data Grid */}
            <div className="border border-border rounded-lg overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-secondary border-b border-border sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-12">Estado</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground min-w-64 sticky left-12 bg-secondary">
                                    Razón Social / RUC
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground min-w-40">Responsable</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground min-w-32">Categoría</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Propietario</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Ingreso</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground min-w-48">Clave SOL</th>
                                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-20">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                        No clients found
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className={`border-b border-border hover:bg-secondary/50 transition-colors ${selectedClientId === client.id ? "bg-primary/10" : ""
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className={`w-3 h-3 rounded-full ${getStatusColor(client.estado)}`} title={client.estado} />
                                        </td>

                                        <td className="px-4 py-3 sticky left-12 bg-card">
                                            <div className="font-medium text-card-foreground">{client.razaSocial}</div>
                                            <div className="text-xs text-muted-foreground">{client.ruc}</div>
                                        </td>

                                        <td className="px-4 py-3 font-medium text-card-foreground">{client.responsable}</td>

                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={getCategoryColor(client.categoria)}>
                                                Categoría {client.categoria}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3 text-card-foreground">{client.propietario}</td>

                                        <td className="px-4 py-3 text-muted-foreground text-sm">{client.fechaIngreso}</td>

                                        <td className="px-4 py-3">
                                            {client.claveSol ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm text-card-foreground">
                                                        {visiblePasswords.has(client.id) ? client.claveSol : "•".repeat(client.claveSol.length)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-auto p-1 hover:bg-secondary"
                                                        onClick={() => togglePasswordVisibility(client.id)}
                                                    >
                                                        {visiblePasswords.has(client.id) ? (
                                                            <EyeOff className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <Eye className="w-3.5 h-3.5" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-auto p-1 hover:bg-secondary"
                                                        onClick={() => copyToClipboard(client.claveSol!, "Contraseña")}
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto p-1 hover:bg-secondary"
                                                    onClick={() => onSelectClient(client)}
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-auto p-1 hover:bg-secondary hover:text-red-600"
                                                    onClick={() => handleDelete(client)}
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
