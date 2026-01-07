"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RotateCcw } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

export default function ErrorPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">
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
                    {/* Error Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl" />
                            <AlertCircle className="w-24 h-24 text-destructive relative animate-pulse" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-balance">
                            Error 500
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Oops, algo salió mal en nuestro servidor. Por favor, intenta
                            nuevamente o contacta a nuestro equipo de soporte.
                        </p>
                    </div>

                    {/* Error Details */}
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-left space-y-3">
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-destructive">Código de Error:</strong> 500
                            Internal Server Error
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <strong className="text-destructive">Hora:</strong>{" "}
                            {new Date().toLocaleString("es-ES")}
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="flex-1 gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reintentar
                        </Button>
                        <Link href="/" className="flex-1">
                            <Button className="w-full gap-2">
                                <Home className="w-4 h-4" />
                                Ir al Inicio
                            </Button>
                        </Link>
                    </div>

                    {/* Support */}
                    <div className="pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            ¿Necesitas ayuda?{" "}
                            <Link
                                href="#"
                                className="text-primary font-semibold hover:underline"
                            >
                                Contacta con Soporte
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
