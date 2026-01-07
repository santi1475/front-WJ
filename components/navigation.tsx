"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Building2, LogOut, Bell, Search } from "lucide-react"

interface NavigationProps {
    isMobileMenuOpen: boolean
    setIsMobileMenuOpen: (open: boolean) => void
}

export default function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen }: NavigationProps) {
    const [] = useState(true)

    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="hidden sm:inline">WJ Consultoria</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/tributario" className="text-sm font-medium hover:text-primary transition-colors">
                            Tributario
                        </Link>
                        <Link href="/dashboard/reportes" className="text-sm font-medium hover:text-primary transition-colors">
                            Reportes
                        </Link>
                        <Link href="/dashboard/usuarios" className="text-sm font-medium hover:text-primary transition-colors">
                            Usuarios
                        </Link>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:inline-flex">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors relative hidden sm:inline-flex">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-border py-4 space-y-3">
                        <Link href="/" className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/tributario" className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                            Gestión Tributaria
                        </Link>
                        <Link href="/dashboard/reportes" className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                            Reportes Financieros
                        </Link>
                        <Link href="/dashboard/usuarios" className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors">
                            Gestión de Usuarios
                        </Link>
                        <div className="border-t border-border pt-3 px-4">
                            <button className="flex items-center gap-2 text-destructive hover:bg-muted p-2 rounded-lg w-full transition-colors">
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
