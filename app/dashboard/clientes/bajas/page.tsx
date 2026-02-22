"use client"

import { useEffect, useState, useMemo } from "react"
import { clientesService } from "@/features/clientes/services/clientes"
import type { ICliente } from "@/features/shared/types"
import type { IHistorialBaja } from "@/features/shared/types"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, RotateCcw, ArrowLeft, History } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BajasPage() {
    const [clients, setClients] = useState<ICliente[]>([])
    const [historial, setHistorial] = useState<IHistorialBaja[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [clientToReactivate, setClientToReactivate] = useState<ICliente | null>(null)
    const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false)

    useEffect(() => {
        fetchBajas()
        fetchHistorial()
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

    const fetchHistorial = async () => {
        try {
            const data = await clientesService.getHistorialBajas()
            setHistorial(data)
        } catch (err) {
            console.error("Error al cargar historial:", err)
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
            toast.success("Cliente reactivado exitosamente", { position: "bottom-right" })
            fetchBajas()
            fetchHistorial()
        } catch (error) {
            console.error(error)
            toast.error("No se pudo reactivar al cliente", { position: "bottom-right" })
        } finally {
            setIsReactivateDialogOpen(false)
            setClientToReactivate(null)
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getEstadoBadge = (estado: string) => {
        if (estado === 'BAJA') {
            return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50">Baja</Badge>
        }
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50">Reactivado</Badge>
    }

    const flattenedEventos = useMemo(() => {
        const eventos: any[] = [];
        historial.forEach(registro => {
            eventos.push({
                ...registro,
                currentEstado: 'BAJA',
                fechaEvento: registro.fecha_baja,
                uniqueId: `${registro.id}-baja`
            });
            if (registro.estado === 'REACTIVADO' && registro.fecha_reactivacion) {
                eventos.push({
                    ...registro,
                    currentEstado: 'REACTIVADO',
                    fechaEvento: registro.fecha_reactivacion,
                    uniqueId: `${registro.id}-reactivacion`
                });
            }
        });

        return eventos.sort((a, b) => new Date(b.fechaEvento).getTime() - new Date(a.fechaEvento).getTime());
    }, [historial]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/clientes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Bajas de Clientes</h1>
                    <p className="text-muted-foreground">Clientes dados de baja y historial de cambios de estado.</p>
                </div>
            </div>

            {error && <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>}

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                </div>
            ) : (
                <Tabs defaultValue="clientes" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/80 border border-border dark:bg-muted/20 dark:border-border/50">
                        <TabsTrigger value="clientes" className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Clientes en Baja ({clients.length})
                        </TabsTrigger>
                        <TabsTrigger value="historial" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            Historial Completo ({historial.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="clientes" className="mt-4">
                        <div className="border border-border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-muted-foreground">RUC</TableHead>
                                        <TableHead className="text-muted-foreground">Razón Social</TableHead>
                                        <TableHead className="text-muted-foreground">Propietario</TableHead>
                                        <TableHead className="text-muted-foreground">Fecha de Baja</TableHead>
                                        <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                No hay clientes dados de baja
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        clients.map((client) => (
                                            <TableRow key={client.ruc}>
                                                <TableCell className="font-mono text-primary font-medium">{client.ruc}</TableCell>
                                                <TableCell className="font-medium text-foreground">{client.razon_social}</TableCell>
                                                <TableCell className="text-muted-foreground">{client.propietario}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {client.fecha_baja ? new Date(client.fecha_baja).toLocaleDateString('es-PE') : "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        onClick={() => handleReactivate(client)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-green-600 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
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
                    </TabsContent>

                    <TabsContent value="historial" className="mt-4">
                        <div className="border border-border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-muted-foreground">RUC</TableHead>
                                        <TableHead className="text-muted-foreground">Razón Social</TableHead>
                                        <TableHead className="text-muted-foreground">Tipo Empresa</TableHead>
                                        <TableHead className="text-muted-foreground">Categoría</TableHead>
                                        <TableHead className="text-muted-foreground">Evento</TableHead>
                                        <TableHead className="text-muted-foreground">Fecha del Evento</TableHead>
                                        <TableHead className="text-muted-foreground">Usuario</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {flattenedEventos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                No hay registro de eventos
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        flattenedEventos.map((evento) => (
                                            <TableRow key={evento.uniqueId}>
                                                <TableCell className="font-mono text-primary font-medium">{evento.cliente_info?.ruc || evento.cliente}</TableCell>
                                                <TableCell className="font-medium text-foreground">{evento.cliente_info?.razon_social}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{evento.cliente_info?.tipo_empresa || "-"}</TableCell>
                                                <TableCell className="text-muted-foreground text-center">
                                                    {evento.cliente_info?.categoria ? (
                                                        <Badge variant="outline">{evento.cliente_info.categoria}</Badge>
                                                    ) : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {getEstadoBadge(evento.currentEstado)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {formatDate(evento.fechaEvento)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {evento.usuario_baja_info?.full_name || "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            )}

            <AlertDialog open={isReactivateDialogOpen} onOpenChange={setIsReactivateDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Reactivar cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            El cliente &quot;{clientToReactivate?.razon_social}&quot; volverá a estar activo y aparecerá en la lista principal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
