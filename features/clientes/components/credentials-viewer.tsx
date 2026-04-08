"use client"

import React, { useState } from "react"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, Key } from "lucide-react"
import { toast } from "sonner"
import type { ICliente } from "@/features/shared/types"
import { TramitesLauncher } from "./lauchers/tramites-launcher"
import { SunafilLauncher } from "./lauchers/sunafil-launcher"
import { AfpLauncher } from "./lauchers/afp-launcher"
import { SisLauncher } from "./lauchers/sis-launcher"
import { PagosLauncher } from "./lauchers/pagos-launche"
import { MitraLauncher } from "./lauchers/mintra-launcher"
import { DeclaracionLauncher } from "./lauchers/declaracion-launcher"

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

interface CredentialItemProps {
    label: string
    value?: string
    fieldKey?: string
    isPassword?: boolean
    actionLinks?: ActionLink[]
    isRevealed?: boolean
    onTogglePassword?: (key: string) => void
    onCopy?: (text: string, label: string) => void
}

const CredentialItem = ({ label, value, fieldKey, isPassword = false, actionLinks = [], isRevealed = false, onTogglePassword, onCopy }: CredentialItemProps) => {
    if (!value) return null

    return (
        <div className="grid grid-cols-[120px_1fr_auto] gap-3 items-center py-2 border-b border-border/50 last:border-0" role="region" aria-label={label}>
            <span className="text-muted-foreground text-sm font-medium">{label}</span>
            <span
                className={`text-foreground font-mono text-sm truncate ${isPassword && !isRevealed ? 'blur-sm select-none' : ''}`}
                role={isPassword ? "status" : undefined}
                aria-label={isPassword ? `${label} - oculto` : undefined}
            >
                {value}
            </span>
            <div className="flex gap-1 items-center" role="group" aria-label={`Acciones para ${label}`}>
                {isPassword && fieldKey && onTogglePassword && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onTogglePassword(fieldKey)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        aria-label={isRevealed ? "Ocultar contraseña" : "Mostrar contraseña"}
                        title={isRevealed ? "Ocultar" : "Mostrar"}
                    >
                        {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                )}
                {onCopy && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onCopy(value, label)}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        aria-label={`Copiar ${label}`}
                        title="Copiar"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </Button>
                )}
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

const SystemAccordionItem = ({
    value,
    title,
    icon: Icon,
    children,
    actionLinks = [],
    customActions
}: {
    value: string
    title: string
    icon?: React.ReactNode
    children: React.ReactNode
    actionLinks?: ActionLink[]
    customActions?: React.ReactNode
}) => {
    return (
        <AccordionItem value={value} className="bg-card border-border/60 shadow-sm rounded-lg overflow-hidden border">
            <AccordionTrigger className="hover:no-underline pb-2 pt-4 px-4 bg-muted/20 data-[state=open]:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between gap-3 w-full pr-4">
                    <div className="text-sm font-semibold text-primary/90 flex items-center gap-2">
                        {Icon && <span className="text-muted-foreground">{Icon}</span>}
                        {title}
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 space-y-0 text-sm border-t border-border/40 bg-card">
                {children}
                {(customActions || actionLinks.length > 0) && (
                    <div className="mt-4 pt-3 border-t border-border/50 flex flex-col gap-2">
                        {customActions}
                        {actionLinks.length > 0 && (
                            <div className="flex gap-2 flex-wrap" role="group" aria-label={`Enlaces rápidos de ${title}`}>
                                {actionLinks.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        size="sm"
                                        onClick={link.onClick}
                                        className="h-8 text-xs font-medium"
                                        aria-label={link.ariaLabel}
                                    >
                                        {link.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    )
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



    const hasAnyCredential = client && client.credenciales && (
        client.credenciales.sol_usuario || client.credenciales.sol_clave ||
        client.credenciales.afp_net_usuario || client.credenciales.afp_net_clave ||
        client.credenciales.detraccion_usuario || client.credenciales.detraccion_clave || client.credenciales.detraccion_cuenta ||
        client.credenciales.sis_clave ||
        client.credenciales.viva_essalud_usuario || client.credenciales.viva_essalud_clave ||
        client.credenciales.inei_usuario || client.credenciales.inei_clave ||
        client.credenciales.pe
    )

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-hidden z-[100] p-6 sm:p-8 flex flex-col h-full gap-0">
                <SheetHeader className="pb-6 shrink-0 border-b border-border/50">
                    <SheetTitle className="text-xl font-bold flex flex-col gap-1">
                        <span>Credenciales de Acceso</span>
                        {client.ruc && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-normal text-muted-foreground font-mono">
                                    {client.razon_social} • {client.ruc}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopy(client.ruc, "RUC")}
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    title="Copiar RUC"
                                >
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </SheetTitle>
                    <SheetDescription className="mt-2 text-sm text-muted-foreground">
                        Gestión de accesos y contraseñas para los portales institucionales.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto pt-6 pb-8 custom-scrollbar">
                    {!hasAnyCredential ? (
                        <div className="flex flex-col items-center justify-center p-8 mt-4 text-center bg-muted/30 border border-dashed rounded-lg">
                            <Key className="h-10 w-10 text-muted-foreground mb-4 opacity-30" />
                            <p className="text-sm font-semibold text-foreground">Sin credenciales registradas</p>
                            <p className="text-xs text-muted-foreground mt-2 max-w-[250px]">
                                Este registro no tiene credenciales de acceso configuradas o están vacías.
                            </p>
                        </div>
                    ) : (
                        <Accordion
                            type="multiple"
                            defaultValue={["sunat", "afpnet", "detracciones", "sis", "viva", "inei", "otros"]}
                            className="w-full flex flex-col gap-4"
                        >
                            {/* SUNAT SOL */}
                            {(client.credenciales?.sol_usuario || client.credenciales?.sol_clave) && (
                                <SystemAccordionItem
                                    value="sunat"
                                    title="CLAVE SOL (SUNAT)"
                                    customActions={
                                        <div className="flex flex-col gap-3 mt-2 w-full">
                                            <TramitesLauncher
                                                ruc={client.ruc}
                                                usuario={client.credenciales.sol_usuario}
                                                clave={client.credenciales.sol_clave}
                                            />

                                            <PagosLauncher
                                                ruc={client.ruc}
                                                usuario={client.credenciales.sol_usuario}
                                                clave={client.credenciales.sol_clave}
                                            />
                                            <DeclaracionLauncher
                                                ruc={client.ruc}
                                                usuario={client.credenciales.sol_usuario}
                                                clave={client.credenciales.sol_clave}
                                            />
                                            <SunafilLauncher
                                                ruc={client.ruc}
                                                usuario={client.credenciales.sol_usuario}
                                                clave={client.credenciales.sol_clave}
                                            />
                                            <MitraLauncher
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
                                        onCopy={handleCopy}
                                    />
                                    <CredentialItem
                                        label="Clave"
                                        value={client.credenciales.sol_clave}
                                        fieldKey="sol_clave"
                                        isPassword
                                        isRevealed={!revealedPasswords.has("sol_clave")}
                                        onTogglePassword={togglePasswordVisibility}
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}

                            {/* AFPNET */}
                            {(client.credenciales?.afp_net_usuario || client.credenciales?.afp_net_clave) && (
                                <SystemAccordionItem
                                    value="afpnet"
                                    title="AFP NET"
                                    customActions={
                                        <div className="w-full mt-2">
                                            <AfpLauncher
                                                ruc={client.ruc}
                                                usuario={client.credenciales?.afp_net_usuario}
                                                clave={client.credenciales?.afp_net_clave}
                                            />
                                        </div>
                                    }
                                >
                                    <CredentialItem
                                        label="Usuario"
                                        value={client.credenciales.afp_net_usuario}
                                        fieldKey="afp_net_usuario"
                                        onCopy={handleCopy}
                                    />
                                    <CredentialItem
                                        label="Clave"
                                        value={client.credenciales.afp_net_clave}
                                        fieldKey="afp_net_clave"
                                        isPassword
                                        isRevealed={!revealedPasswords.has("afp_net_clave")}
                                        onTogglePassword={togglePasswordVisibility}
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}

                            {/* DETRACCIONES */}
                            {(client.credenciales?.detraccion_usuario || client.credenciales?.detraccion_clave || client.credenciales?.detraccion_cuenta) && (
                                <SystemAccordionItem value="detracciones" title="CUENTA DE DETRACCIONES">
                                    <CredentialItem
                                        label="N° Cuenta"
                                        value={client.credenciales.detraccion_cuenta}
                                        fieldKey="detraccion_cuenta"
                                        onCopy={handleCopy}
                                    />
                                    <CredentialItem
                                        label="Usuario"
                                        value={client.credenciales.detraccion_usuario}
                                        fieldKey="detraccion_usuario"
                                        onCopy={handleCopy}
                                    />
                                    <CredentialItem
                                        label="Clave"
                                        value={client.credenciales.detraccion_clave}
                                        fieldKey="detraccion_clave"
                                        isPassword
                                        isRevealed={!revealedPasswords.has("detraccion_clave")}
                                        onTogglePassword={togglePasswordVisibility}
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}

                            {/* SIS */}
                            {client.credenciales?.sis_clave && (
                                <SystemAccordionItem
                                    value="sis"
                                    title="SIS (Seguro Integral de Salud)"
                                    customActions={
                                        <div className="w-full mt-2">
                                            <SisLauncher
                                                ruc={client.ruc}
                                            />
                                        </div>
                                    }
                                >
                                    <CredentialItem
                                        label="Clave"
                                        value={client.credenciales.sis_clave}
                                        fieldKey="sis_clave"
                                        isPassword
                                        isRevealed={!revealedPasswords.has("sis_clave")}
                                        onTogglePassword={togglePasswordVisibility}
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}

                            {/* VIVA ESSALUD */}
                            {(client.credenciales?.viva_essalud_usuario || client.credenciales?.viva_essalud_clave) && (
                                <SystemAccordionItem value="viva" title="VIVA ESSALUD">
                                    <CredentialItem
                                        label="Usuario"
                                        value={client.credenciales.viva_essalud_usuario}
                                        fieldKey="viva_essalud_usuario"
                                        onCopy={handleCopy}
                                    />
                                    <CredentialItem
                                        label="Clave"
                                        value={client.credenciales.viva_essalud_clave}
                                        fieldKey="viva_essalud_clave"
                                        isPassword
                                        isRevealed={!revealedPasswords.has("viva_essalud_clave")}
                                        onTogglePassword={togglePasswordVisibility}
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}

                            {/* INEI */}
                            {(client.credenciales?.inei_usuario || client.credenciales?.inei_clave) && (
                                <SystemAccordionItem value="inei" title="INEI">
                                    <CredentialItem
                                        label="Usuario"
                                        value={client.credenciales.inei_usuario}
                                        fieldKey="inei_usuario"
                                        onCopy={handleCopy}
                                    />
                                    <CredentialItem
                                        label="Clave"
                                        value={client.credenciales.inei_clave}
                                        fieldKey="inei_clave"
                                        isPassword
                                        isRevealed={!revealedPasswords.has("inei_clave")}
                                        onTogglePassword={togglePasswordVisibility}
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}

                            {/* OTROS */}
                            {client.credenciales?.pe && (
                                <SystemAccordionItem value="otros" title="OTROS / ACCESOS ESPECIALES">
                                    <CredentialItem
                                        label="Partida Elect."
                                        value={client.credenciales.pe}
                                        fieldKey="pe"
                                        onCopy={handleCopy}
                                    />
                                </SystemAccordionItem>
                            )}
                        </Accordion>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
