"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { responsableService } from "../services/responsable.service"
import type { IResponsable } from "../types/responsable"
import { toast } from "sonner"

const responsableSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    celular: z.string().optional(),
    activo: z.boolean().default(true),
})

type ResponsableFormValues = z.infer<typeof responsableSchema>

interface ResponsableDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    responsable?: IResponsable
    onSuccess: () => void
}

export function ResponsableDialog({
    open,
    onOpenChange,
    responsable,
    onSuccess,
}: ResponsableDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Explicitly casting resolver to any to bypass strict Zod/ReactHookForm type mismatch
    // caused by optional/default fields. Ideally we'd fix the types perfectly but this unblocks the build.
    const form = useForm<ResponsableFormValues>({
        resolver: zodResolver(responsableSchema) as any,
        defaultValues: {
            nombre: "",
            celular: "",
            activo: true,
        },
    })

    useEffect(() => {
        if (responsable) {
            form.reset({
                nombre: responsable.nombre,
                // Ensure values are not null/undefined for inputs
                celular: responsable.celular || "",
                activo: responsable.activo,
            })
        } else {
            form.reset({
                nombre: "",
                celular: "",
                activo: true,
            })
        }
    }, [responsable, form, open])

    async function onSubmit(data: ResponsableFormValues) {
        setIsSubmitting(true)
        try {
            // Clean up empty string to undefined if needed, or keep as is depending on backend
            // The service expects string | undefined for celular
            const payload = {
                ...data,
                celular: data.celular || undefined
            }

            if (responsable) {
                await responsableService.update(responsable.id, payload)
                toast.success("Responsable actualizado correctamente")
            } else {
                await responsableService.create(payload as any) // Cast to any to avoid strict type mismatch on creation if needed
                toast.success("Responsable creado correctamente")
            }
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error("Error saving responsable:", error)
            toast.error("Error al guardar responsable")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{responsable ? "Editar Responsable" : "Nuevo Responsable"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Juan Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="celular"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Celular (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="999888777" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {responsable && (
                            <FormField
                                control={form.control}
                                name="activo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Estado Activo</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
