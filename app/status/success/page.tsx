"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Home } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                            S
                        </div>
                        <span>StyleHub</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md text-center space-y-8">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl" />
                            <CheckCircle className="w-24 h-24 text-accent relative animate-bounce" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-balance">¡Éxito!</h1>
                        <p className="text-lg text-muted-foreground">
                            Tu operación se ha completado correctamente. Tu compra ha sido procesada y recibirás una confirmación en
                            tu correo electrónico.
                        </p>
                    </div>

                    {/* Details Box */}
                    <div className="bg-card border border-border rounded-xl p-6 space-y-3 text-left">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Código de Pedido:</span>
                            <span className="font-semibold">#STY-2025-001</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Pagado:</span>
                            <span className="font-semibold">$189.99</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Envío Estimado:</span>
                            <span className="font-semibold">3-5 días hábiles</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full gap-2 bg-transparent">
                                <Home className="w-4 h-4" />
                                Ir al Inicio
                            </Button>
                        </Link>
                        <Button className="flex-1 gap-2">
                            Ver Mis Pedidos
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
