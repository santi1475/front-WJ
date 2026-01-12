"use client"

import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ClientsTable from "@/components/manage-clients/clients-table"
import { useState, useEffect } from "react"
import { Client } from "@/lib/interfaces/client"


export default function Dashboard() {

    const stats = [
        { label: "Ingresos Mensuales", value: "$125,480", change: "+12.5%", icon: TrendingUp, color: "text-green-500" },
        { label: "Gastos", value: "$48,920", change: "+3.2%", icon: BarChart3, color: "text-orange-500" },
        { label: "Impuestos Pendientes", value: "$15,340", change: "−2.1%", icon: AlertCircle, color: "text-red-500" },
        { label: "Balance Neto", value: "$76,560", change: "+8.3%", icon: CheckCircle2, color: "text-blue-500" },
    ]
    interface DashboardStats {
        totalClients: number
        activeAccounts: number
        credentialsStored: number
        alertsCount: number
    }
    const [stats2, setStats] = useState<DashboardStats>({
        totalClients: 0,
        activeAccounts: 0,
        credentialsStored: 0,
        alertsCount: 0,
    })
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // This would be your actual API call
                // const response = await fetch('/api/dashboard')
                // const data = await response.json()

                // Mock data for now
                setStats({
                    totalClients: 24,
                    activeAccounts: 156,
                    credentialsStored: 892,
                    alertsCount: 3,
                })

                setClients([
                    {
                        id: "1",
                        name: "Acme Corporation",
                        email: "admin@acme.com",
                        status: "active",
                        accountsCount: 8,
                        lastUpdated: "2024-01-08",
                    },
                    {
                        id: "2",
                        name: "TechStart Inc",
                        email: "contact@techstart.com",
                        status: "active",
                        accountsCount: 5,
                        lastUpdated: "2024-01-07",
                    },
                    {
                        id: "3",
                        name: "Global Services",
                        email: "info@global.com",
                        status: "inactive",
                        accountsCount: 12,
                        lastUpdated: "2024-01-02",
                    },
                ])
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <div className="min-h-screen bg-background">

            <main className="flex-1">
                {/* Header */}
                <div className="bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-balance">Dashboard</h1>
                                <p className="text-muted-foreground mt-2">Bienvenido de vuelta, Administrador</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Client
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                            <h3 className="text-2xl md:text-3xl font-bold mt-2">{stat.value}</h3>
                                            <p
                                                className={`text-sm mt-2 font-semibold ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                                            >
                                                {stat.change} vs mes anterior
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Main Content Grid */}
                    <div className="bg-card rounded-lg border border-border p-6">
                        <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Clients</h2>
                        <ClientsTable clients={clients} loading={loading} />
                    </div>
                </div>
            </main>
        </div>
    )
}
