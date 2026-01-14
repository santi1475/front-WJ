"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import { Sidebar } from "@/components/sidebar"

const SidebarContext = createContext({
    isSidebarOpen: true,
    setIsSidebarOpen: (_value: boolean) => {},
})

export const useSidebarContext = () => useContext(SidebarContext)

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
            <div className="min-h-screen">
                <Sidebar />
                <main 
                    className={`bg-background min-h-screen transition-all duration-300 ease-in-out ${
                        isSidebarOpen ? 'ml-64' : 'ml-20'
                    }`}
                >
                    <div className="p-4 sm:p-6">{children}</div>
                </main>
            </div>
        </SidebarContext.Provider>
    )
}
