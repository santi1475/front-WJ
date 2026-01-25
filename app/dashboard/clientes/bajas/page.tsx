"use client"

import { useEffect, useState } from "react"
import { clientesService } from "@/features/clientes/services/clientes"
import type { ICliente } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, RotateCcw, ArrowLeft } from "lucide-react"
import type { AxiosError } from "axios"
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
import Link from "next/link"

export default function BajasPage() {
    const [clients, setClients] = useState<ICliente[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [clientToReactivate, setClientToReactivate] = useState<ICliente | null>(null)
    const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false)

    useEffect(() => {
        fetchBajas()
    }, [])

    const fetchBajas = async () => {
        try {
            setLoading(true)
            const data = await clientesService.getBajas()
            setClients(data)
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>
            setError(axiosError.response?.data?.detail || "Error al cargar el historial de bajas.")
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleReactivate = (client: ICliente) => {
        setClientToReactivate(client)
        setIsReactivateDialogOpen(true)
    }

    const confirmReactivate = async () => {
        if (!clientToReactivate) return

        try {
            await clientesService.reactivar(Number(clientToReactivate.ruc))
            toast.success("Cliente reactivado exitosamente")
            // Remove from list
            setClients((prev) => prev.filter((c) => c.ruc !== clientToReactivate.ruc))
        } catch (error) {
            console.error(error)
            toast.error("No se pudo reactivar al cliente")
        } finally {
            setIsReactivateDialogOpen(false)
            setClientToReactivate(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Historial de Bajas</h1>
                    <p className="text-slate-400">Clientes dados de baja y disponibles para reactivación.</p>
                </div>
            </div>

            {error && <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>}

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-900/50">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-300">RUC</TableHead>
                                <TableHead className="text-slate-300">Razón Social</TableHead>
                                <TableHead className="text-slate-300">Fecha de Baja</TableHead>
                                <TableHead className="text-slate-300 text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow className="border-slate-800">
                                    <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                                        No hay clientes dados de baja
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client) => (
                                    <TableRow key={client.ruc} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="font-mono text-blue-400">{client.ruc}</TableCell>
                                        <TableCell className="text-white">{client.razon_social}</TableCell>
                                        <TableCell className="text-slate-300">
                                            {client.fecha_baja ? new Date(client.fecha_baja).toLocaleDateString() : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                onClick={() => handleReactivate(client)}
                                                size="sm"
                                                variant="outline"
                                                className="border-green-800 text-green-400 hover:bg-green-900/20 hover:text-green-300"
                                            >
                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                Reactivar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AlertDialog open={isReactivateDialogOpen} onOpenChange={setIsReactivateDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Reactivar cliente?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            El cliente "{clientToReactivate?.razon_social}" volverá a estar activo y aparecerá en la lista principal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-700 border-slate-600">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmReactivate}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Reactivar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
