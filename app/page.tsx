"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"

function HomeRedirect() {
    const router = useRouter()

    useEffect(() => {
        // If they get past the AuthGuard, they are definitely unauthenticated
        router.replace("/login")
    }, [router])

    return null
}

export default function HomePage() {
    // If the user lands here and IS authenticated, AuthGuard will intercept
    // and show the "Sesión Activa" prompt. If they are not, it renders `{children}`
    // which immediately redirects them to the login page.
    return (
        <AuthGuard>
            <HomeRedirect />
        </AuthGuard>
    )
}
