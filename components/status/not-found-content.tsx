"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"

export default function NotFoundContent() {
    return (
        <div className="w-full max-w-md text-center space-y-8">
            {/* 404 Illustration */}
            <div className="flex justify-center">
                <div className="relative">
                    <div className="text-9xl font-bold text-muted-foreground/20">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="w-16 h-16 text-primary/40 animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">Página No Encontrada</h1>
                <p className="text-lg text-muted-foreground">
                    Lo sentimos, la página que buscas no existe. Verifica la URL o regresa al inicio para explorar nuestro
                    catálogo.
                </p>
            </div>

            {/* Search Suggestion */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">Sugerencias:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Verifica la ortografía de la URL</li>
                    <li>✓ El enlace puede haber expirado</li>
                    <li>✓ La página puede haber sido movida</li>
                </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" onClick={() => window.history.back()} className="flex-1 gap-2">
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Volver Atrás
                </Button>
                <Link href="/" className="flex-1">
                    <Button className="w-full gap-2">
                        <Home className="w-4 h-4" />
                        Ir al Inicio
                    </Button>
                </Link>
            </div>
        </div>
    )
}
