"use client"
import type { ICliente } from "@/features/shared/types"
import { ClientForm } from "./client-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ClientModalProps {
    isOpen: boolean
    onClose: () => void
    client: ICliente | null
    onSave: () => void
}

export function ClientModal({ isOpen, onClose, client, onSave }: ClientModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl border-slate-800 bg-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-white">{client ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                </DialogHeader>
                <ClientForm
                    client={client || undefined}
                    onSuccess={() => {
                        onClose()
                        onSave()
                    }}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    )
}
