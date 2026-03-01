"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, AlertCircle, LogOut, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, user, logout } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleLogout = () => {
        logout()
        router.replace("/login")
    }

    const handleReturnToDashboard = () => {
        router.replace("/dashboard")
    }

    if (!isMounted) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        )
    }

    // If the user reaches the login page but is ALREADY authenticated
    // Instead of auto-redirecting (which causes "Forward" button vulnerabilities)
    // we explicitly ask them if they want to log out or return to the system.
    if (isAuthenticated && user) {
        return (
            <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md p-6">
                    <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto bg-indigo-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-indigo-500/20">
                                <AlertCircle className="w-8 h-8 text-indigo-400" />
                            </div>
                            <CardTitle className="text-2xl text-white">Sesión Activa</CardTitle>
                            <CardDescription className="text-slate-400 mt-2">
                                Has detectado una sesión activa para <strong>{user.username || 'tu cuenta'}</strong>.
                                <br />¿Qué deseas hacer?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <Button
                                onClick={handleReturnToDashboard}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base rounded-xl transition-all"
                            >
                                Regresar al Sistema
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-800" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-2 text-slate-500">O también puedes</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full border-red-900/50 bg-red-950/20 text-red-500 hover:bg-red-900/40 hover:text-red-400 h-12 text-base rounded-xl transition-all"
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Confirmar Cierre de Sesión
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Typical guest user: show the login form
    return <>{children}</>
}
