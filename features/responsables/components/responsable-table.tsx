"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit2, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { responsableService } from "../services/responsable.service"
import type { IResponsable } from "../types/responsable"
import { ResponsableDialog } from "./responsable-dialog"
import { toast } from "sonner"
import type { AxiosError } from "axios"

export function ResponsableTable() {
    const [data, setData] = useState<IResponsable[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<IResponsable | undefined>()
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    const filteredData = data.filter((item) =>
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const loadData = async () => {
        setIsLoading(true)
        try {
            const res = await responsableService.getAll()
            setData(res)
        } catch (error) {
            console.error("Error loading responsables:", error)
            toast.error("Error al cargar los responsables")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleCreate = () => {
        setSelectedItem(undefined)
        setDialogOpen(true)
    }

    const handleEdit = (item: IResponsable) => {
        setSelectedItem(item)
        setDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await responsableService.delete(id)
            toast.success("Responsable eliminado correctamente")
            loadData()
            setDeleteConfirm(null)
        } catch (error: unknown) {
            console.error("Error deleting responsable:", error)
            const err = error as AxiosError
            // Check for integrity error (foreign key constraint)
            if (err.response?.status === 500 || (err.response?.data as any)?.detail?.includes("ProtectedError")) {
                toast.error("No se puede eliminar porque tiene clientes asignados. Intente desactivarlo en su lugar.", {
                    duration: 5000,
                })
            } else {
                toast.error("Error al eliminar el responsable. Puede tener registros vinculados.")
            }
            setDeleteConfirm(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar responsable..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Responsable
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Celular</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron resultados
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.nombre}</TableCell>
                                    <TableCell>{item.celular || "-"}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.activo ? "default" : "secondary"} className={item.activo ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200"}>
                                            {item.activo ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(item.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <ResponsableDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                responsable={selectedItem}
                onSuccess={loadData}
            />

            <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al responsable.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
