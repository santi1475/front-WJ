"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { toast } from "sonner"

interface Client {
    id: string
    razaSocial: string
    ruc: string
    responsable: string
    categoria: "A" | "B" | "C"
    estado: "activo" | "inactivo"
    propietario: string
    fechaIngreso: string
    claveSol?: string
    solUser?: string
}

interface NewClientFormProps {
    onClose: () => void
    onAdd: (client: Client) => void
}

export default function NewClientForm({ onClose, onAdd }: NewClientFormProps) {
    const [formData, setFormData] = useState({
        razaSocial: "",
        ruc: "",
        responsable: "JOSE",
        categoria: "A" as "A" | "B" | "C",
        estado: "activo" as "activo" | "inactivo",
        propietario: "",
        solUser: "",
        claveSol: "",
    })

    const handleSubmit = () => {
        if (!formData.razaSocial || !formData.ruc || !formData.propietario) {
            toast.error("Por favor completa todos los campos requeridos")
            return
        }

        const newClient: Client = {
            id: Date.now().toString(),
            ...formData,
            fechaIngreso: new Date().toISOString().split("T")[0],
        }

        onAdd(newClient)
        toast.success("Cliente agregado exitosamente")
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl mx-auto px-4">
                <Card className="bg-card border-border p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-card-foreground">Agregar Nuevo Cliente</h2>
                        <Button variant="outline" size="sm" onClick={onClose} className="rounded-full h-auto p-2 bg-transparent">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Razón Social *</Label>
                            <Input
                                placeholder="Ej. Acme Corporation S.A."
                                value={formData.razaSocial}
                                onChange={(e) => setFormData({ ...formData, razaSocial: e.target.value })}
                                className="bg-input border-border text-card-foreground"
                            />
                        </div>

                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">RUC *</Label>
                            <Input
                                placeholder="Ej. 20123456789"
                                value={formData.ruc}
                                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                                className="bg-input border-border text-card-foreground"
                            />
                        </div>

                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Propietario *</Label>
                            <Input
                                placeholder="Ej. Juan Pérez"
                                value={formData.propietario}
                                onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                                className="bg-input border-border text-card-foreground"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Responsable</Label>
                                <Select
                                    value={formData.responsable}
                                    onValueChange={(value) => setFormData({ ...formData, responsable: value })}
                                >
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="JOSE">JOSE</SelectItem>
                                        <SelectItem value="DIANA">DIANA</SelectItem>
                                        <SelectItem value="CARLOS">CARLOS</SelectItem>
                                        <SelectItem value="MARIA">MARIA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Categoría</Label>
                                <Select
                                    value={formData.categoria}
                                    onValueChange={(value) => setFormData({ ...formData, categoria: value as "A" | "B" | "C" })}
                                >
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="A">A - Verde</SelectItem>
                                        <SelectItem value="B">B - Amarillo</SelectItem>
                                        <SelectItem value="C">C - Rojo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Usuario SOL</Label>
                            <Input
                                placeholder="Ej. user.sol@example.com"
                                value={formData.solUser}
                                onChange={(e) => setFormData({ ...formData, solUser: e.target.value })}
                                className="bg-input border-border text-card-foreground"
                            />
                        </div>

                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Clave SOL</Label>
                            <Input
                                type="password"
                                placeholder="Ej. SolPass123456!"
                                value={formData.claveSol}
                                onChange={(e) => setFormData({ ...formData, claveSol: e.target.value })}
                                className="bg-input border-border text-card-foreground"
                            />
                        </div>

                        <div>
                            <Label className="text-muted-foreground text-sm mb-2 block">Estado</Label>
                            <Select
                                value={formData.estado}
                                onValueChange={(value) => setFormData({ ...formData, estado: value as "activo" | "inactivo" })}
                            >
                                <SelectTrigger className="bg-input border-border">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSubmit}>
                            Agregar Cliente
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
