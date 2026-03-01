"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { SIDEBAR_ROUTES, type RouteConfig } from "@/config/routes"
import { Loader2 } from "lucide-react"

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { user, hasPermission, isAuthenticated } = useAuth()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return;

        console.log(`[RouteGuard] Mounted on path: ${pathname}. Auth state: ${isAuthenticated}, User: ${user?.username}`)

        // If explicitly un-authenticated, bounce them to login
        if (!isAuthenticated) {
            console.log("[RouteGuard] Not authenticated, redirecting to /login")
            setIsAuthorized(false)
            router.replace("/login")
            return
        }

        // If authenticated but user data isn't hydrated yet, wait for it
        if (!user) {
            return
        }

        // Function to find the route config for the current pathname
        const findRouteConfig = (path: string, routes: RouteConfig[]): RouteConfig | null => {
            for (const route of routes) {
                if (route.path === path) {
                    return route
                }
                if (route.children) {
                    const foundInChild = findRouteConfig(path, route.children)
                    if (foundInChild) return foundInChild
                }
            }
            return null
        }

        const routeConfig = findRouteConfig(pathname, SIDEBAR_ROUTES)

        // If route is not found in config, or if it doesn't have permissions defined, 
        // allow access (default to open if not explicitly protected)
        if (!routeConfig || !routeConfig.permissions || routeConfig.permissions.length === 0) {
            setIsAuthorized(true)
            return
        }

        // Superusuarios always have access, checked inside `hasPermission` but we make it explicit here too
        if (user.is_superuser) {
            setIsAuthorized(true)
            return
        }

        // Normalize permissions function: strips "app." prefix if present
        // Copying the logic from sidebar to ensure consistency
        const normalize = (p: string) => p.includes('.') ? p.split('.')[1] : p

        const userPermissions = user.permissions || []
        const normalizedUserPermissions = new Set(userPermissions.map(normalize))
        const rawUserPermissions = new Set(userPermissions)

        // Check if user has at least one of the required permissions for this route
        const hasAccess = routeConfig.permissions.some((p) => {
            const permString = String(p)
            const normalizedRoutePerm = normalize(permString)
            return rawUserPermissions.has(permString) || normalizedUserPermissions.has(normalizedRoutePerm)
        })

        if (!hasAccess) {
            // Redirect to a safe page if not authorized
            setIsAuthorized(false)
            router.replace("/error/403")
        } else {
            setIsAuthorized(true)
        }
    }, [pathname, user, isAuthenticated, router, isMounted])

    // Show loading state while determining access or while waiting for redirection
    if (!isMounted || isAuthorized === null || isAuthorized === false) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return <>{children}</>
}
