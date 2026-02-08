"use client"

import React from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import type { ICliente } from "@/features/shared/types"
import { SunatLauncher } from "./sunat-launcher"
import { SunafilLauncher } from "./sunafil-launcher"

interface CredentialsViewerProps {
    client: ICliente | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface ActionLink {
    label: string
    href?: string
    onClick?: () => void
    ariaLabel?: string
}

export function CredentialsViewer({ client, open, onOpenChange }: CredentialsViewerProps) {
    const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set())

    if (!client) return null

    const handleCopy = (text: string | undefined, label: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success(`${label} copiado al portapapeles`, { position: "bottom-right" })
    }

    const togglePasswordVisibility = (key: string) => {
        setRevealedPasswords(prev => {
            const newSet = new Set(prev)
            if (newSet.has(key)) {
                newSet.delete(key)
            } else {
                newSet.add(key)
            }
            return newSet
        })
    }

    const CredentialItem = ({ label, value, fieldKey, isPassword = false, actionLinks = [] }: {
        label: string
        value?: string
        fieldKey?: string
        isPassword?: boolean
        actionLinks?: ActionLink[]
    }) => {
        if (!value) return null
        const isRevealed = fieldKey && revealedPasswords.has(fieldKey)

        return (
            <div className="grid grid-cols-[120px_1fr_auto] gap-3 items-center py-2 border-b border-border/50 last:border-0" role="region" aria-label={label}>
                <span className="text-muted-foreground text-sm font-medium">{label}</span>
                <span
                    className={`text-foreground font-mono text-sm truncate ${isPassword && !isRevealed ? 'blur-sm select-none' : ''
                        }`}
                    role={isPassword ? "status" : undefined}
                    aria-label={isPassword ? `${label} - oculto` : undefined}
                >
                    {value}
                </span>
                <div className="flex gap-1 items-center" role="group" aria-label={`Acciones para ${label}`}>
                    {isPassword && fieldKey && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePasswordVisibility(fieldKey)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            aria-label={isRevealed ? "Ocultar contraseña" : "Mostrar contraseña"}
                            title={isRevealed ? "Ocultar" : "Mostrar"}
                        >
                            {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(value, label)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        aria-label={`Copiar ${label}`}
                        title="Copiar"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {actionLinks.map((link, idx) => (
                        <Button
                            key={idx}
                            variant="ghost"
                            size="icon"
                            onClick={link.onClick}
                            className="h-7 w-7"
                            aria-label={link.ariaLabel || link.label}
                            title={link.label}
                        >
                            {link.label}
                        </Button>
                    ))}
                </div>
            </div>
        )
    }

    const SystemCard = ({
        title,
        icon: Icon,
        children,
        actionLinks = [],
        customActions
    }: {
        title: string
        icon?: React.ReactNode
        children: React.ReactNode
        actionLinks?: ActionLink[]
        customActions?: React.ReactNode
    }) => {
        return (
            <Card className="bg-card border-border/60 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-4 border-b border-border/40 bg-muted/20">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <CardTitle className="text-sm font-semibold text-primary/90 flex items-center gap-2">
                            {Icon && <span className="text-muted-foreground">{Icon}</span>}
                            {title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            {customActions}
                            {actionLinks.length > 0 && (
                                <div className="flex gap-1" role="group" aria-label={`Enlaces rápidos de ${title}`}>
                                    {actionLinks.map((link, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            size="sm"
                                            onClick={link.onClick}
                                            className="h-7 px-2 text-xs bg-background/50"
                                            aria-label={link.ariaLabel}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-0 text-sm">
                    {children}
                </CardContent>
            </Card>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex flex-col gap-1">
                        <span>Credenciales de Acceso</span>
                        {client.ruc && (
                            <span className="text-sm font-normal text-muted-foreground font-mono">
                                {client.razon_social} • {client.ruc}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription className="mt-2">
                        Gestión de accesos y contraseñas para los portales institucionales.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 md:grid-cols-1 mt-2">
                    {/* SUNAT SOL */}
                    {(client.credenciales?.sol_usuario || client.credenciales?.sol_clave) && (
                        <SystemCard
                            title="CLAVE SOL (SUNAT)"
                            customActions={
                                <div className="flex gap-2">
                                    <SunatLauncher
                                        ruc={client.ruc}
                                        usuario={client.credenciales.sol_usuario}
                                        clave={client.credenciales.sol_clave}
                                    />
                                    <SunafilLauncher
                                        ruc={client.ruc}
                                        usuario={client.credenciales.sol_usuario}
                                        clave={client.credenciales.sol_clave}
                                    />
                                </div>
                            }
                        >
                            <CredentialItem
                                label="Usuario"
                                value={client.credenciales.sol_usuario}
                                fieldKey="sol_usuario"
                            />
                            <CredentialItem
                                label="Clave"
                                value={client.credenciales.sol_clave}
                                fieldKey="sol_clave"
                                isPassword
                            />
                        </SystemCard>
                    )}

                    {/* AFPNET */}
                    {(client.credenciales?.afp_net_usuario || client.credenciales?.afp_net_clave) && (
                        <SystemCard title="AFP NET">
                            <CredentialItem
                                label="Usuario"
                                value={client.credenciales.afp_net_usuario}
                                fieldKey="afp_net_usuario"
                            />
                            <CredentialItem
                                label="Clave"
                                value={client.credenciales.afp_net_clave}
                                fieldKey="afp_net_clave"
                                isPassword
                            />
                        </SystemCard>
                    )}

                    {/* DETRACCIONES */}
                    {(client.credenciales?.detraccion_usuario || client.credenciales?.detraccion_clave || client.credenciales?.detraccion_cuenta) && (
                        <SystemCard title="CUENTA DE DETRACCIONES">
                            <CredentialItem
                                label="N° Cuenta"
                                value={client.credenciales.detraccion_cuenta}
                                fieldKey="detraccion_cuenta"
                            />
                            <CredentialItem
                                label="Usuario"
                                value={client.credenciales.detraccion_usuario}
                                fieldKey="detraccion_usuario"
                            />
                            <CredentialItem
                                label="Clave"
                                value={client.credenciales.detraccion_clave}
                                fieldKey="detraccion_clave"
                                isPassword
                            />
                        </SystemCard>
                    )}

                    {/* SIS */}
                    {(client.credenciales?.sis_usuario || client.credenciales?.sis_clave) && (
                        <SystemCard title="SIS (Seguro Integral de Salud)">
                            <CredentialItem
                                label="Usuario"
                                value={client.credenciales.sis_usuario}
                                fieldKey="sis_usuario"
                            />
                            <CredentialItem
                                label="Clave"
                                value={client.credenciales.sis_clave}
                                fieldKey="sis_clave"
                                isPassword
                            />
                        </SystemCard>
                    )}

                    {/* VIVA ESSALUD */}
                    {(client.credenciales?.viva_essalud_usuario || client.credenciales?.viva_essalud_clave) && (
                        <SystemCard title="VIVA ESSALUD">
                            <CredentialItem
                                label="Usuario"
                                value={client.credenciales.viva_essalud_usuario}
                                fieldKey="viva_essalud_usuario"
                            />
                            <CredentialItem
                                label="Clave"
                                value={client.credenciales.viva_essalud_clave}
                                fieldKey="viva_essalud_clave"
                                isPassword
                            />
                        </SystemCard>
                    )}

                    {/* INEI */}
                    {(client.credenciales?.inei_usuario || client.credenciales?.inei_clave) && (
                        <SystemCard title="INEI">
                            <CredentialItem
                                label="Usuario"
                                value={client.credenciales.inei_usuario}
                                fieldKey="inei_usuario"
                            />
                            <CredentialItem
                                label="Clave"
                                value={client.credenciales.inei_clave}
                                fieldKey="inei_clave"
                                isPassword
                            />
                        </SystemCard>
                    )}

                    {/* OTROS */}
                    {client.credenciales?.pe && (
                        <SystemCard title="OTROS / ACCESOS ESPECIALES">
                            <CredentialItem
                                label="Planilla Elect."
                                value={client.credenciales.pe}
                                fieldKey="pe"
                            />
                        </SystemCard>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
