"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RolesTable } from "@/features/roles/components/roles-table"
import { RoleModal } from "@/features/roles/components/role-modal"
import { useRoles } from "@/hooks/use-roles"
import type { IRolePopulated, IRoleFormData } from "@/features/shared/types/roles"

export default function RolesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<IRolePopulated | null>(null)
    
    const { roles, isLoading, addRole, updateRole, deleteRole } = useRoles()

    const handleCreateNew = () => {
        setEditingRole(null)    
        setIsModalOpen(true)
    }

    const handleEdit = (role: IRolePopulated) => {
        setEditingRole(role)
        setIsModalOpen(true)
    }

    const handleDelete = (roleId: number) => {
        deleteRole(roleId)
    }

    const handleSaveRole = (data: IRoleFormData) => {
        if (editingRole) {
            updateRole(editingRole.id, data)
        } else {
            addRole(data)
        }
        setIsModalOpen(false)
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Roles y Permisos</h2>
                    </div>
                    <Button onClick={handleCreateNew} size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Crear Nuevo Rol
                    </Button>
                </div>

                {/* Content */}
                <Card className="">
                    <CardHeader>
                        <CardTitle>Roles del Sistema</CardTitle>
                        <CardDescription>
                            {roles.length} rol{roles.length !== 1 ? "es" : ""} configurado{roles.length !== 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : roles.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">No hay roles creados aún</p>
                                <Button onClick={handleCreateNew} variant="outline">
                                    Crear el primer rol
                                </Button>
                            </div>
                        ) : (
                            <RolesTable roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal */}
            <RoleModal 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
                onSave={handleSaveRole} 
                editingRole={editingRole} 
            />
        </div>
    )
}