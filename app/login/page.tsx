"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Building2 } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            console.log("Login attempt with:", { email, password })
            router.push("/dashboard")
            setIsLoading(false)
        }, 1000)
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
                        <span className="font-bold text-lg">EmpresaHub</span>
                    </Link>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="space-y-8">
                        {/* Title Section */}
                        <div className="text-center space-y-3">
                            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                                ✨ Gestión Empresarial Integral
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-balance">Bienvenido</h1>
                            <p className="text-muted-foreground text-lg">Inicia sesión en tu plataforma empresarial</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Correo Electrónico Corporativo
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground pointer-events-none" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@empresa.com"
                                        className="pl-10 bg-card border-border focus:border-primary focus:ring-primary"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
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
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" className="rounded border-border cursor-pointer" />
                                <span>Recuérdame en este dispositivo</span>
                            </label>

                            {/* Submit Button */}
                            <Button type="submit" size="lg" className="w-full gap-2 mt-8" disabled={isLoading}>
                                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                                {!isLoading && <ArrowRight className="w-4 h-4" />}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-background text-muted-foreground">Más opciones</span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="gap-2 bg-card hover:bg-muted">
                                <span>🔵</span>
                                Google
                            </Button>
                            <Button variant="outline" className="gap-2 bg-card hover:bg-muted">
                                <span>🔐</span>
                                SSO Corporativo
                            </Button>
                        </div>

                        {/* Footer */}
                        <p className="text-center text-muted-foreground text-sm">
                            ¿Necesitas ayuda?{" "}
                            <Link href="#" className="text-primary font-semibold hover:underline">
                                Contacta soporte
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
