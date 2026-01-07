"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">StyleHub</h3>
                        <p className="text-muted-foreground text-sm">
                            Tu destino para moda elegante y moderna con la mejor calidad.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Tienda</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Nuevos Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Hombres
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Mujeres
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Accesorios
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Ayuda</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Envíos
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Devoluciones
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Síguenos</h4>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {currentYear} StyleHub. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-primary transition-colors">
                            Privacidad
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Términos
                        </Link>
                        <Link href="#" className="hover:text-primary transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
