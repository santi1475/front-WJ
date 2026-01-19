"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function ConfiguracionPage() {
    const { user, can } = useAuth()

    const hasAccess = user?.is_superuser || can("ver_configuracion")

    if (!hasAccess) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Acceso Denegado</h1>
                    <p className="text-muted-foreground mt-2">No tienes permisos para acceder a esta sección</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <p className="text-sm">No tienes permisos para acceder a configuración</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Configuración</h1>
                <p className="text-muted-foreground mt-2">Gestiona la configuración del sistema</p>
            </div>

            {/* Placeholder */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-12 text-center">
                        <div className="space-y-2">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                            <h3 className="text-lg font-semibold">Módulo en desarrollo</h3>
                            <p className="text-muted-foreground">La configuración del sistema estará disponible próximamente</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
