"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-0 lg:ml-64 bg-background overflow-auto w-full">
                <div className="p-4 sm:p-6">{children}</div>
            </main>
        </div>
    )
}
