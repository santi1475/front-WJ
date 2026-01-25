"use client"

import { ClientsTable } from "@/features/clientes/components/clients-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Archive } from "lucide-react"

export default function ClientesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
                    <p className="text-muted-foreground mt-2">Administra todos tus clientes y su información</p>
                </div>
                <Link href="/dashboard/clientes/bajas">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        <Archive className="h-4 w-4 mr-2" />
                        Papelera
                    </Button>
                </Link>
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
