"use client"

import { useState } from "react"
import { MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PermissionsBadges } from "./permissions-badges"

interface Role {
    id: number
    name: string
    permissions: any[]
    isSystem?: boolean
}

interface RolesTableProps {
    roles: Role[]
    onEdit: (role: Role) => void
    onDelete: (roleId: number) => void
}

export function RolesTable({ roles, onEdit, onDelete }: RolesTableProps) {
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    const handleDeleteConfirm = (roleId: number) => {
        setDeleteConfirm(null)
        onDelete(roleId)
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold">Rol</TableHead>
                            <TableHead className="font-semibold">Permisos</TableHead>
                            <TableHead className="font-semibold text-right w-12">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id} className="hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="font-semibold text-foreground">{role.name}</div>
                                        {role.isSystem && (
                                            <Badge variant="secondary" className="text-xs">
                                                Sistema
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <PermissionsBadges permissions={role.permissions} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(role)} className="gap-2">
                                                <Edit2 className="h-4 w-4" />
                                                Editar
                                            </DropdownMenuItem>
                                            {!role.isSystem && (
                                                <DropdownMenuItem onClick={() => setDeleteConfirm(role.id)} className="gap-2 text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Eliminar Rol</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleDeleteConfirm(deleteConfirm!)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
