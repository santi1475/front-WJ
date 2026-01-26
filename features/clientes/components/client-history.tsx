"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { IHistorialEvento } from "@/features/shared/types"
import { Badge } from "@/components/ui/badge"

interface ClientHistoryProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    historial: IHistorialEvento[]
}

export function ClientHistory({ open, onOpenChange, historial }: ClientHistoryProps) {
    const getBadgeColor = (tipo: string) => {
        switch (tipo) {
            case "INGRESO":
                return "bg-green-900/30 text-green-400 border-green-700/50"
            case "BAJA":
                return "bg-red-900/30 text-red-400 border-red-700/50"
            case "REACTIVACION":
                return "bg-blue-900/30 text-blue-400 border-blue-700/50"
            default:
                return "bg-slate-800 text-slate-300 border-slate-700"
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch (e) {
            return dateString
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Historial del Cliente</DialogTitle>
                </DialogHeader>

                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-300">Fecha</TableHead>
                                <TableHead className="text-slate-300">Tipo de Evento</TableHead>
                                <TableHead className="text-slate-300">Responsable</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {historial && historial.length > 0 ? (
                                historial.map((evento, index) => (
                                    <TableRow key={index} className="border-slate-800 hover:bg-slate-800/30">
                                        <TableCell className="font-mono text-slate-300">
                                            {formatDate(evento.fecha)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getBadgeColor(evento.tipo_evento)}
                                            >
                                                {evento.tipo_evento}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {evento.responsable_nombre}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow className="border-slate-800">
                                    <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                                        No hay historial registrado para este cliente
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
