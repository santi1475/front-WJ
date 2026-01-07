"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { FileText, TrendingUp, AlertCircle, CheckCircle2, Download, Plus, ArrowRight } from "lucide-react"

export default function TributarioPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const taxObligations = [
        {
            id: 1,
            name: "IVA Mensual",
            dueDate: "2025-02-05",
            amount: "$5,240",
            status: "Por pagar",
            color: "text-orange-500",
        },
        {
            id: 2,
            name: "Impuesto a la Renta",
            dueDate: "2025-03-15",
            amount: "$8,900",
            status: "Por pagar",
            color: "text-red-500",
        },
        {
            id: 3,
            name: "Contribuciones Patronales",
            dueDate: "2025-01-20",
            amount: "$3,450",
            status: "Pagado",
            color: "text-green-500",
        },
        {
            id: 4,
            name: "Declaración Patrimonial",
            dueDate: "2025-04-30",
            amount: "—",
            status: "En proceso",
            color: "text-blue-500",
        },
        {
            id: 5,
            name: "IVA Período Anterior",
            dueDate: "2024-12-31",
            amount: "$2,100",
            status: "Pagado",
            color: "text-green-500",
        },
    ]

    const deductions = [
        { category: "Gastos Operacionales", amount: "$12,500", percentage: 35 },
        { category: "Depreciación de Activos", amount: "$3,200", percentage: 25 },
        { category: "Gastos de Personal", amount: "$8,900", percentage: 28 },
        { category: "Otros Gastos", amount: "$2,400", percentage: 12 },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="flex-1">
                {/* Header */}
                <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">Gestión Tributaria</h1>
                                <p className="text-muted-foreground mt-2">Administra tus obligaciones fiscales y declaraciones</p>
                            </div>
                            <Button className="gap-2 hidden sm:flex">
                                <Plus className="w-4 h-4" />
                                Nueva Obligación
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Summary Cards */}
                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Por Pagar</p>
                                    <h3 className="text-3xl font-bold mt-2">$14,140</h3>
                                    <p className="text-sm text-red-500 mt-2">3 obligaciones pendientes</p>
                                </div>
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Impuestos Pagados</p>
                                    <h3 className="text-3xl font-bold mt-2">$5,550</h3>
                                    <p className="text-sm text-green-500 mt-2">Última actualización hoy</p>
                                </div>
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Próximo Vencimiento</p>
                                    <h3 className="text-2xl font-bold mt-2">5 de Febrero</h3>
                                    <p className="text-sm text-muted-foreground mt-2">IVA Mensual - $5,240</p>
                                </div>
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                        </Card>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tax Obligations */}
                        <div className="lg:col-span-2">
                            <Card className="p-6">
                                <h2 className="text-xl font-bold mb-6">Obligaciones Tributarias</h2>
                                <div className="space-y-3">
                                    {taxObligations.map((obligation) => (
                                        <div
                                            key={obligation.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold">{obligation.name}</p>
                                                <p className="text-sm text-muted-foreground">Vencimiento: {obligation.dueDate}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{obligation.amount}</p>
                                                <span className={`text-xs font-semibold ${obligation.color}`}>{obligation.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Deductions */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-6">Deducciones Fiscales</h2>
                            <div className="space-y-4">
                                {deductions.map((deduction, idx) => (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium">{deduction.category}</p>
                                            <p className="text-sm font-bold">{deduction.amount}</p>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="bg-accent h-2 rounded-full transition-all"
                                                style={{ width: `${deduction.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <FileText className="w-8 h-8 text-primary" />
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold">Nueva Declaración</h3>
                            <p className="text-sm text-muted-foreground mt-2">Inicia una nueva declaración tributaria</p>
                        </Card>

                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <Download className="w-8 h-8 text-accent" />
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold">Descargar Reportes</h3>
                            <p className="text-sm text-muted-foreground mt-2">Obtén reportes en PDF o Excel</p>
                        </Card>

                        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <TrendingUp className="w-8 h-8 text-green-500" />
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <h3 className="font-bold">Historial Fiscal</h3>
                            <p className="text-sm text-muted-foreground mt-2">Revisa tu historial de pagos</p>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
