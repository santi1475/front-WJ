"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserModal } from "./user-modal"
import { userService } from "@/features/users/services/user.service"
import type { IUserManaged } from "@/features/shared/types/user"

export function UsersTable() {
    const [users, setUsers] = useState<IUserManaged[]>([])
    const [filteredUsers, setFilteredUsers] = useState<IUserManaged[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<IUserManaged | undefined>()
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [sortConfig, setSortConfig] = useState<{
        key: keyof IUserManaged
        direction: "asc" | "desc"
    }>({ key: "username", direction: "asc" })

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        let result = [...users]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (user) =>
                    user.username.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query) ||
                    user.first_name.toLowerCase().includes(query) ||
                    user.last_name.toLowerCase().includes(query),
            )
        }

        // Sort
        result.sort((a, b) => {
            const aVal = a[sortConfig.key]
            const bVal = b[sortConfig.key]

            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
            }

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
            }

            if (typeof aVal === "boolean" && typeof bVal === "boolean") {
                const aNum = aVal ? 1 : 0
                const bNum = bVal ? 1 : 0
                return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum
            }

            // Para otros tipos (arrays, objects, null), convertir a string para comparar
            const aStr = String(aVal)
            const bStr = String(bVal)
            return sortConfig.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
        })

        setFilteredUsers(result)
    }, [users, searchQuery, sortConfig])

    async function loadUsers() {
        setIsLoading(true)
        try {
            const data = await userService.getAll()
            setUsers(data)
        } catch (err) {
            console.error("Failed to load users:", err)
        } finally {
            setIsLoading(false)
        }
    }

    function handleSort(key: keyof IUserManaged) {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }))
    }

    function handleEdit(user: IUserManaged) {
        setSelectedUser(user)
        setModalOpen(true)
    }

    function handleCreate() {
        setSelectedUser(undefined)
        setModalOpen(true)
    }

    function handleDelete(id: number) {
        setDeleteConfirm(id)
    }

    async function handleDeleteConfirm(id: number) {
        try {
            await userService.delete(id)
            setUsers((prev) => prev.filter((u) => u.id !== id))
        } catch (err) {
            console.error("Failed to delete user:", err)
        } finally {
            setDeleteConfirm(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Input
                    placeholder="Buscar por nombre de usuario, email o nombre"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="size-4" />
                    Create User
                </Button>
            </div>

            {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">{searchQuery ? "No users found" : "No users yet"}</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("username")}>
                                Username
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("email")}>
                                Email
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("first_name")}>
                                Nombre
                            </TableHead>
                            <TableHead>
                                Rol
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("is_active")}>
                                Estado
                            </TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.first_name} {user.last_name}
                                </TableCell>
                                <TableCell>
                                    {user.roles && user.roles.length > 0 ? (
                                        <span className="inline-block rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                            {user.roles[0].name}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Admin</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${user.is_active
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                                            }`}
                                    >
                                        {user.is_active ? "Activo" : "Inactivo"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(user)}>
                                            <Edit2 className="size-4" />
                                            <span className="sr-only">Edit user</span>
                                        </Button>
                                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(user.id)}>
                                            <Trash2 className="size-4" />
                                            <span className="sr-only">Delete user</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <UserModal open={modalOpen} onOpenChange={setModalOpen} user={selectedUser} onSuccess={loadUsers} />

            <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteConfirm && handleDeleteConfirm(deleteConfirm)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
