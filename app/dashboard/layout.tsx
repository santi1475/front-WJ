"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Navigation from "@/components/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSidebarOpen(true)
            } else {
                setIsSidebarOpen(false)
            }
        }
        
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    
    const handleToggle = () => {
        console.log('Toggle clicked, current state:', isSidebarOpen)
        setIsSidebarOpen(!isSidebarOpen)
        console.log('New state should be:', !isSidebarOpen)
    }
    
    const handleClose = () => {
        console.log('Close clicked')
        setIsSidebarOpen(false)
    }
    
    console.log('DashboardLayout render, isSidebarOpen:', isSidebarOpen)
    
    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={handleClose}
                onToggle={handleToggle}
            />
            <div className="flex-1 flex flex-col">
                <Navigation />
                <main className="flex-1 overflow-auto">{children}</main>
            </div>
        </div>
    )
}