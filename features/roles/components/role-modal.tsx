"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PermissionsSelector } from "./permissions-selector"
import { usePermissions } from "@/hooks/use-permissions"
import type { IRolePopulated, IPermission } from "@/features/shared/types"

const roleSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    permissions: z.array(z.number()).min(1, "Debes seleccionar al menos un permiso"),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: RoleFormData) => void
    editingRole?: IRolePopulated | null
}

export function RoleModal({ open, onOpenChange, onSave, editingRole }: RoleModalProps) {
    // Forzamos el tipado del hook si no está inferido correctamente
    const { permissions } = usePermissions() as { permissions: IPermission[] }
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<RoleFormData>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            permissions: [],
        },
    })

    useEffect(() => {
        if (open) {
            if (editingRole) {
                form.reset({
                    name: editingRole.name,
                    // Ya no es necesario (p: any) porque editingRole está tipado
                    permissions: editingRole.permissions.map((p) => p.id),
                })
            } else {
                form.reset({
                    name: "",
                    permissions: [],
                })
            }
        }
    }, [open, editingRole, form])

    const onSubmit = async (data: RoleFormData) => {
        setIsSubmitting(true)
        try {
            onSave(data)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingRole ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
                    <DialogDescription>
                        {editingRole
                            ? "Actualiza los detalles y permisos del rol"
                            : "Define el nombre y permisos para el nuevo rol"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Rol</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Administrador, Editor, Revisor" {...field} />
                                    </FormControl>
                                    <FormDescription>Nombre único para identificar este rol</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Permissions Selector */}
                        <FormField
                            control={form.control}
                            name="permissions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Permisos</FormLabel>
                                    <FormControl>
                                        <PermissionsSelector
                                            permissions={permissions}
                                            selectedPermissions={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Form Actions */}
                        <div className="flex gap-3 justify-end pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar Rol"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}