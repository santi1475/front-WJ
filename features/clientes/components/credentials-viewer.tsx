"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import type { ICliente } from "@/features/shared/types"

interface CredentialsViewerProps {
    client: ICliente | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CredentialsViewer({ client, open, onOpenChange }: CredentialsViewerProps) {
    if (!client) return null

    const handleCopy = (text: string | undefined, label: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success(`${label} copiado al portapapeles`)
    }

    const CredentialItem = ({ label, value, isPassword = false }: { label: string, value?: string, isPassword?: boolean }) => {
        if (!value) return null
        return (
            <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <div>
                    <span className="text-slate-400 text-sm block">{label}</span>
                    <span className={`text-slate-200 font-mono text-sm ${isPassword ? 'blur-sm hover:blur-none transition-all' : ''}`}>
                        {value}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(value, label)}
                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700"
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex flex-col gap-1">
                        <span>Credenciales</span>
                        <span className="text-sm font-normal text-slate-400 font-mono">
                            {client.razon_social} ({client.ruc})
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Credenciales de acceso a los diferentes sistemas. Click para copiar.
                        Pasa el mouse sobre las contraseñas para revelarlas.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                    {/* SUNAT SOL */}
                    {(client.credenciales?.sol_usuario || client.credenciales?.sol_clave) && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">Clave SOL</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="Usuario" value={client.credenciales.sol_usuario} />
                                <CredentialItem label="Clave" value={client.credenciales.sol_clave} isPassword />
                            </CardContent>
                        </Card>
                    )}

                    {/* AFPNET */}
                    {(client.credenciales?.afp_net_usuario || client.credenciales?.afp_net_clave) && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">AFP Net</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="Usuario" value={client.credenciales.afp_net_usuario} />
                                <CredentialItem label="Clave" value={client.credenciales.afp_net_clave} isPassword />
                            </CardContent>
                        </Card>
                    )}

                    {/* DETRACCIONES */}
                    {(client.credenciales?.detraccion_usuario || client.credenciales?.detraccion_clave || client.credenciales?.detraccion_cuenta) && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">Detracciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="Cuenta" value={client.credenciales.detraccion_cuenta} />
                                <CredentialItem label="Usuario" value={client.credenciales.detraccion_usuario} />
                                <CredentialItem label="Clave" value={client.credenciales.detraccion_clave} isPassword />
                            </CardContent>
                        </Card>
                    )}

                    {/* SIS */}
                    {(client.credenciales?.sis_usuario || client.credenciales?.sis_clave) && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">SIS</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="Usuario" value={client.credenciales.sis_usuario} />
                                <CredentialItem label="Clave" value={client.credenciales.sis_clave} isPassword />
                            </CardContent>
                        </Card>
                    )}

                    {/* VIVA ESSALUD */}
                    {(client.credenciales?.viva_essalud_usuario || client.credenciales?.viva_essalud_clave) && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">Viva Essalud</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="Usuario" value={client.credenciales.viva_essalud_usuario} />
                                <CredentialItem label="Clave" value={client.credenciales.viva_essalud_clave} isPassword />
                            </CardContent>
                        </Card>
                    )}

                    {/* INEI */}
                    {(client.credenciales?.inei_usuario || client.credenciales?.inei_clave) && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">INEI</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="Usuario" value={client.credenciales.inei_usuario} />
                                <CredentialItem label="Clave" value={client.credenciales.inei_clave} isPassword />
                            </CardContent>
                        </Card>
                    )}

                    {/* OTROS */}
                    {client.credenciales?.pe && (
                        <Card className="bg-slate-800 border-slate-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-blue-400">Otros</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                <CredentialItem label="PE (Planilla Electrónica)" value={client.credenciales.pe} />
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
