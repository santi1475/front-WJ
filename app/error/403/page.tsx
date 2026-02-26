"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Status403 from "@/components/status/status pages/403"

export default function ForbiddenPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirigir al dashboard después de 3 segundos
        const timer = setTimeout(() => {
            router.replace("/dashboard")
        }, 3000)

        // Limpieza del temporizador si el componente se desmonta antes de tiempo
        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="relative h-screen w-full">
            <Status403 />
            <div className="absolute bottom-10 left-0 right-0 text-center animate-pulse">
                <p className="text-slate-500 font-medium">Redirigiendo al inicio en breve...</p>
            </div>
        </div>
    )
}
