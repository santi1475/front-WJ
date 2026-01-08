"use client"

import type React from "react"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Navigation from "@/components/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    
    return (
        <div className="min-h-screen bg-background flex">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <div className="flex-1 flex flex-col">
                <Navigation />

                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    )
}
