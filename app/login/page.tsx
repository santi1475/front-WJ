"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth_services"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("") 
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null) // Tipado explícito
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null) // Limpiamos errores previos

        try {
            const data = await authService.login(email, password)
            
            // Guardamos tokens
            localStorage.setItem("accessToken", data.access)
            localStorage.setItem("refreshToken", data.refresh)
            
            console.log("Login exitoso")
            router.push("/dashboard")
            
        } catch (err: unknown) {
            // MEJORA: Manejo de errores tipado (Sin 'any')
            if (err instanceof Error) {
                // Si es un error estándar de JS/TS (como los que lanzamos en el servicio)
                setError(err.message)
            } else if (typeof err === "string") {
                // Si por alguna razón se lanzó un string directo
                setError(err)
            } else {
                // Fallback para errores desconocidos
                setError("Ocurrió un error inesperado. Por favor intenta nuevamente.")
                console.error("Error desconocido:", err)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex flex-col">
            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/login" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg">WJ Consultoria</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="space-y-8">
                        <div className="text-center space-y-3">
                            <h1 className="text-4xl md:text-5xl font-bold text-balance">Bienvenido</h1>
                            <p className="text-muted-foreground text-lg">Inicia sesión en tu plataforma empresarial</p>
                        </div>

                        {/* Mensaje de Error */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Usuario / Correo
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="admin"
                                        className="pl-10 bg-card border-border focus:border-primary focus:ring-primary"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading} // Deshabilitar durante carga
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium">
                                        Contraseña
                                    </label>
                                    <Link href="#" className="text-sm text-primary hover:underline">
                                        ¿La olvidaste?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 bg-card border-border focus:border-primary focus:ring-primary"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading} // Deshabilitar durante carga
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                                        tabIndex={-1} // Evitar foco con tabulación
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" size="lg" className="w-full gap-2 mt-8" disabled={isLoading}>
                                {isLoading ? "Autenticando..." : "Iniciar Sesión"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-muted-foreground">Más opciones</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="gap-2 bg-card hover:bg-muted" disabled={isLoading}>
                                Google
                            </Button>
                            <Button variant="outline" className="gap-2 bg-card hover:bg-muted" disabled={isLoading}>
                                SSO Corporativo
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}