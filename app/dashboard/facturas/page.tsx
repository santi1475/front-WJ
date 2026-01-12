"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function FacturasPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Gestión de Facturas</h1>
                <p className="text-muted-foreground mt-2">Administra las facturas de tus clientes</p>
            </div>

            {/* Placeholder */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-12 text-center">
                        <div className="space-y-2">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                            <h3 className="text-lg font-semibold">Módulo en desarrollo</h3>
                            <p className="text-muted-foreground">La gestión de facturas estará disponible próximamente</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
