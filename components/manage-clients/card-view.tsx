"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Copy, Plus, Trash2, X } from "lucide-react"
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

interface Credential {
    id: string
    plataforma: string
    usuario: string
    contrasena: string
}

interface CardViewProps {
    client: Client
    onClose: () => void
    isAdmin?: boolean
    onUpdate?: (client: Client) => void
}

export default function CardView({ client, onClose, isAdmin = false, onUpdate }: CardViewProps) {
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
    const [formData, setFormData] = useState(client)
    const [credentials, setCredentials] = useState<Credential[]>([
        { id: "1", plataforma: "Netflix", usuario: "user@example.com", contrasena: "pass123456" },
        { id: "2", plataforma: "SENSICO", usuario: "sensico_user", contrasena: "sens1234" },
    ])
    const [newCredential, setNewCredential] = useState({ plataforma: "", usuario: "", contrasena: "" })
    const [showAddForm, setShowAddForm] = useState(false)

    const togglePasswordVisibility = (id: string) => {
        const newVisible = new Set(visiblePasswords)
        if (newVisible.has(id)) {
            newVisible.delete(id)
        } else {
            newVisible.add(id)
        }
        setVisiblePasswords(newVisible)
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard`)
    }

    const addCredential = () => {
        if (!newCredential.plataforma || !newCredential.usuario || !newCredential.contrasena) {
            toast.error("Completa todos los campos")
            return
        }
        setCredentials([
            ...credentials,
            {
                id: Date.now().toString(),
                ...newCredential,
            },
        ])
        setNewCredential({ plataforma: "", usuario: "", contrasena: "" })
        setShowAddForm(false)
        toast.success("Plataforma agregada")
    }

    const removeCredential = (id: string) => {
        setCredentials(credentials.filter((c) => c.id !== id))
        toast.success("Plataforma eliminada")
    }

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(formData)
            toast.success("Cambios guardados")
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-8 overflow-y-auto z-50">
            <div className="w-full max-w-6xl mx-auto px-4 pb-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-card-foreground">{formData.razaSocial}</h2>
                        <p className="text-muted-foreground">RUC: {formData.ruc}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={onClose} className="rounded-full h-auto p-2 bg-transparent">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card 1: Información Comercial */}
                    <Card className="bg-card border-border p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-card-foreground">Información Comercial</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Razón Social</Label>
                                <div className="bg-secondary rounded px-3 py-2 text-card-foreground">{formData.razaSocial}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">RUC</Label>
                                <div className="bg-secondary rounded px-3 py-2 text-card-foreground">{formData.ruc}</div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Propietario</Label>
                                <Input
                                    value={formData.propietario}
                                    onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                                    className="bg-input border-border text-card-foreground"
                                />
                            </div>
                            {isAdmin && (
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
                            )}
                            <div className="grid grid-cols-2 gap-4 pt-2">
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
                        </div>
                    </Card>

                    {/* Card 2: Acceso SUNAT & Tributación */}
                    <Card className="bg-card border-border p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-card-foreground">Acceso SUNAT & Tributación</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Usuario SOL</Label>
                                <Input
                                    value={formData.solUser || ""}
                                    onChange={(e) => setFormData({ ...formData, solUser: e.target.value })}
                                    className="bg-input border-border text-card-foreground"
                                />
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Clave SOL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type={visiblePasswords.has("sol-clave") ? "text" : "password"}
                                        value={formData.claveSol || ""}
                                        onChange={(e) => setFormData({ ...formData, claveSol: e.target.value })}
                                        className="bg-input border-border text-card-foreground"
                                    />
                                    <Button variant="outline" size="sm" onClick={() => togglePasswordVisibility("sol-clave")}>
                                        {visiblePasswords.has("sol-clave") ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(formData.claveSol || "", "Clave SOL")}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Régimen Tributario</Label>
                                <Select defaultValue="RMT">
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="RMT">Régimen Mype Tributario</SelectItem>
                                        <SelectItem value="RER">Régimen Especial</SelectItem>
                                        <SelectItem value="RUS">Régimen Único Simplificado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Régimen Laboral</Label>
                                <Select defaultValue="general">
                                    <SelectTrigger className="bg-input border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="construccion">Construcción</SelectItem>
                                        <SelectItem value="mineria">Minería</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>

                    {/* Card 3: Banco de la Nación / Detracciones */}
                    <Card className="bg-card border-border p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-card-foreground">Banco de la Nación / Detracciones</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Número de Cuenta</Label>
                                <Input defaultValue="1234567890" className="bg-input border-border text-card-foreground" />
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">Clave de Cuenta</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type={visiblePasswords.has("cuenta-clave") ? "text" : "password"}
                                        defaultValue="BancoClave789!"
                                        className="bg-input border-border text-card-foreground"
                                    />
                                    <Button variant="outline" size="sm" onClick={() => togglePasswordVisibility("cuenta-clave")}>
                                        {visiblePasswords.has("cuenta-clave") ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => copyToClipboard("BancoClave789!", "Clave Cuenta")}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm mb-2 block">DNI Titular</Label>
                                <Input defaultValue="12345678" className="bg-input border-border text-card-foreground" />
                            </div>
                        </div>
                    </Card>

                    {/* Card 4: Credenciales Extra */}
                    <Card className="bg-card border-border p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-card-foreground">Credenciales Plataformas</h3>
                            <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Agregar
                            </Button>
                        </div>

                        {/* Add Credential Form */}
                        {showAddForm && (
                            <div className="bg-secondary/30 rounded-lg p-4 space-y-3 border border-border">
                                <Input
                                    placeholder="Plataforma (ej. Netflix, SENSICO)"
                                    value={newCredential.plataforma}
                                    onChange={(e) =>
                                        setNewCredential({
                                            ...newCredential,
                                            plataforma: e.target.value,
                                        })
                                    }
                                    className="bg-input border-border text-card-foreground"
                                />
                                <Input
                                    placeholder="Usuario"
                                    value={newCredential.usuario}
                                    onChange={(e) =>
                                        setNewCredential({
                                            ...newCredential,
                                            usuario: e.target.value,
                                        })
                                    }
                                    className="bg-input border-border text-card-foreground"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        placeholder="Contraseña"
                                        value={newCredential.contrasena}
                                        onChange={(e) =>
                                            setNewCredential({
                                                ...newCredential,
                                                contrasena: e.target.value,
                                            })
                                        }
                                        className="bg-input border-border text-card-foreground"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                                        Cancelar
                                    </Button>
                                    <Button size="sm" onClick={addCredential}>
                                        Agregar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Credentials List */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {credentials.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No hay plataformas agregadas</p>
                            ) : (
                                credentials.map((cred) => (
                                    <div
                                        key={cred.id}
                                        className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-card-foreground text-sm">{cred.plataforma}</p>
                                            <p className="text-xs text-muted-foreground truncate">{cred.usuario}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-1"
                                                onClick={() => copyToClipboard(cred.contrasena, "Contraseña")}
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-1 hover:text-red-600"
                                                onClick={() => removeCredential(cred.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </div>
    )
}
