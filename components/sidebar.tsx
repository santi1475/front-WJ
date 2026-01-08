"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Building2, Menu, X } from "lucide-react"
import * as Icons from "lucide-react"
import React from "react"

interface NavSection {
    title: string
    items: {
        id: string
        label: string
        href: string
        icon: string
        color?: string
    }[]
}

const sidebarSections: NavSection[] = [
    {
        title: "Principal",
        items: [{ id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "BarChart3", color: "text-blue-500" }],
    },
    {
        title: "Gestión",
        items: [
            {
                id: "tributario",
                label: "Gestión Tributaria",
                href: "/dashboard/tributario",
                icon: "FileText",
                color: "text-purple-500",
            },
            {
                id: "reportes",
                label: "Reportes Financieros",
                href: "/dashboard/reportes",
                icon: "PieChart",
                color: "text-green-500",
            },
        ],
    },
    {
        title: "Administración",
        items: [
            {
                id: "usuarios",
                label: "Gestión de Usuarios",
                href: "/dashboard/usuarios",
                icon: "Users",
                color: "text-orange-500",
            },
        ],
    },
]

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    onToggle: () => void
}

export default function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
    const pathname = usePathname()
    const [expandedSection, setExpandedSection] = React.useState<string | null>("Principal")

    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        BarChart3: Icons.BarChart3,
        FileText: Icons.FileText,
        PieChart: Icons.PieChart,
        Users: Icons.Users,
        Settings: Icons.Settings,
        ChevronDown: Icons.ChevronDown,
    }

    const handleMenuClick = () => {
        onToggle()
    }

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out z-40 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:relative md:top-auto flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="hidden md:inline">WJ Consultoria</span>
                    </Link>
                    
                    {/* Botón de menú - Muestra X cuando está abierto en mobile, Menu siempre en desktop */}
                    <button 
                        onClick={handleMenuClick} 
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
                        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    >
                        {isOpen ? (
                            <X className="w-5 h-5 md:hidden" />
                        ) : null}
                        <Menu className="w-5 h-5 hidden md:block" />
                    </button>
                </div>

                {/* Navigation Sections */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {sidebarSections.map((section) => (
                        <div key={section.title}>
                            <button
                                onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                                className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                            >
                                {section.title}
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedSection === section.title ? "rotate-180" : ""}`}
                                />
                            </button>

                            {expandedSection === section.title && (
                                <div className="space-y-1 mt-2">
                                    {section.items.map((item) => {
                                        const Icon = iconMap[item.icon] || Icons.FileText
                                        const isActive = pathname === item.href

                                        return (
                                            <Link key={item.id} href={item.href} onClick={onClose}>
                                                <div
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                                        isActive ? "bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-muted"
                                                    }`}
                                                >
                                                    <Icon className={`w-5 h-5 ${!isActive && item.color}`} />
                                                    <span className="font-medium text-sm">{item.label}</span>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer Info */}
                <div className="p-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">AlphaTech v1.0</p>
                </div>
            </aside>
        </>
    )
}