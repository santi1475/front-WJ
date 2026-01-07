"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  }, [router])

  // Mock data for dashboard
  const stats = [
    { label: "Ingresos Mensuales", value: "$125,480", change: "+12.5%", icon: TrendingUp, color: "text-green-500" },
    { label: "Gastos", value: "$48,920", change: "+3.2%", icon: BarChart3, color: "text-orange-500" },
    { label: "Impuestos Pendientes", value: "$15,340", change: "−2.1%", icon: AlertCircle, color: "text-red-500" },
    { label: "Balance Neto", value: "$76,560", change: "+8.3%", icon: CheckCircle2, color: "text-blue-500" },
  ]

  const recentTransactions = [
    { id: 1, description: "Venta Producto A", amount: "$2,500", date: "2025-01-05", status: "Completado" },
    { id: 2, description: "Pago Proveedor", amount: "$−1,200", date: "2025-01-04", status: "Procesando" },
    { id: 3, description: "Servicio Profesional", amount: "$3,800", date: "2025-01-03", status: "Completado" },
    { id: 4, description: "Alquiler Oficina", amount: "$−2,000", date: "2025-01-02", status: "Completado" },
    { id: 5, description: "Comisión Ventas", amount: "$−850", date: "2025-01-01", status: "Completado" },
  ]

  return null
}
