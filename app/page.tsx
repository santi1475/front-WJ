"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function HomePage() {
    const router = useRouter()
    const { isAuthenticated } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return

        if (isAuthenticated) {
            router.replace("/dashboard")
        } else {
            router.replace("/login")
        }
    }, [isMounted, isAuthenticated, router])

    // Keep it minimal while deciding
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
    )
}
