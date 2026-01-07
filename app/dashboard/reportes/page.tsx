"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { PieChart, BarChart3, TrendingUp, Calendar } from "lucide-react"

export default function ReportesPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const reportTypes = [
        {
            title: "Flujo de Caja",
            description: "Análisis del flujo mensual de efectivo",
            icon: TrendingUp,
            color: "text-green-500",
        },
        {
            title: "Estado de Resultados",
            description: "Ingresos, gastos y utilidades",
            icon: BarChart3,
            color: "text-blue-500",
        },
        {
            title: "Balance General",
            description: "Activos, pasivos y patrimonio",
            icon: PieChart,
            color: "text-purple-500",
        },
        {
            title: "Proyecciones",
            description: "Estimaciones para próximos períodos",
            icon: Calendar,
            color: "text-orange-500",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <main className="flex-1">
                <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl md:text-4xl font-bold">Reportes Financieros</h1>
                        <p className="text-muted-foreground mt-2">Análisis detallado de tu situación financiera</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reportTypes.map((report, idx) => {
                            const Icon = report.icon
                            return (
                                <Card key={idx} className="p-6 hover:shadow-md transition-all cursor-pointer group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-muted ${report.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <Button size="sm" variant="outline" className="bg-transparent">
                                            Generar
                                        </Button>
                                    </div>
                                    <h3 className="text-xl font-bold">{report.title}</h3>
                                    <p className="text-muted-foreground mt-2">{report.description}</p>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}
