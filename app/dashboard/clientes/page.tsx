"use client"

import { ClientsTable } from "@/features/clientes/components/clients-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClientesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
                <p className="text-muted-foreground mt-2">Administra todos tus clientes y su información</p>
            </div>

            {/* Table Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Clientes Registrados</CardTitle>
                    <CardDescription>Busca, edita y crea nuevos clientes en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <ClientsTable />
                </CardContent>
            </Card>
        </div>
    )
}
