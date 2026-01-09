"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Building2, Menu, X } from "lucide-react"
import * as Icons from "lucide-react"
import React from "react"
import { sidebarSections } from "@/lib/interfaces/siderbar-menu"
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

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative left-0 top-0 h-screen bg-card border-r border-border transform transition-all duration-300 ease-in-out z-40 flex flex-col ${isOpen ? "w-64 translate-x-0" : "w-0 md:w-20 -translate-x-full md:translate-x-0"
                    }`}
            >
                {/* Header - Always Visible */}
                <div
                    className={`flex items-center border-b border-border transition-all duration-300 ${isOpen ? "px-6 py-6 justify-between" : "px-0 md:px-3 md:py-6 md:justify-center gap-1"
                        }`}
                >
                    <Link href="/" className={`flex items-center gap-2 font-bold text-lg shrink-0 ${!isOpen && "md:hidden"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen
                                ? "bg-linear-to-br from-primary to-accent"
                                : "bg-transparent"
                            }`}>
                            <Building2 className={`w-5 h-5 transition-all ${isOpen
                                    ? "text-primary-foreground"
                                    : "text-transparent bg-linear-to-br from-primary to-accent bg-clip-text"
                                }`} />
                        </div>
                        <span className={`transition-opacity ${isOpen ? "opacity-100" : "opacity-0"} hidden md:inline`}>
                            WJ
                        </span>
                    </Link>

                    {!isOpen && (
                        <div className="hidden md:flex items-center justify-center w-8 h-8 bg-linear-to-br from-primary to-accent rounded-lg text-primary-foreground">
                            <Building2 className="w-5 h-5" />
                        </div>
                    )}

                    <button
                        onClick={() => {
                            console.log("Menu button clicked")
                            onToggle()
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground shrink-0"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation Sections - Full Width When Open */}
                <nav
                    className={`flex-1 overflow-y-auto transition-all duration-300 ${isOpen ? "px-4 py-6 space-y-2" : "px-2 py-6 space-y-1 md:flex md:flex-col md:items-center"
                        }`}
                >
                    {sidebarSections.map((section) => {
                        const SectionIcon = section.sectionIcon ? iconMap[section.sectionIcon] : null

                        return (
                            <div key={section.title} className="w-full">
                                {isOpen ? (
                                    <button
                                        onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                                    >
                                        {section.title}
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${expandedSection === section.title ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                ) : (
                                    <div className="flex justify-center p-3 md:p-2">
                                        <div
                                            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                                            title={section.title}
                                        >
                                            {SectionIcon && (
                                                <SectionIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isOpen && expandedSection === section.title && (
                                    <div className="space-y-1 mt-2">
                                        {section.items.map((item) => {
                                            const Icon = iconMap[item.icon] || Icons.FileText
                                            const isActive = pathname === item.href

                                            return (
                                                <Link key={item.id} href={item.href} onClick={onClose}>
                                                    <div
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                                            ? "bg-primary text-primary-foreground shadow-md"
                                                            : "text-foreground hover:bg-muted"
                                                            }`}
                                                    >
                                                        <Icon className={`w-5 h-5 shrink-0 ${!isActive && item.color}`} />
                                                        <span className="font-medium text-sm">{item.label}</span>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                {/* Footer Info - Hidden When Collapsed */}
                {isOpen && (
                    <div className="p-6 border-t border-border">
                        <p className="text-xs text-muted-foreground text-center">AlphaTech v1.0</p>
                    </div>
                )}
            </aside>
        </>
    )
}
