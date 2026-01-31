"use client"

import { useSidebarContext } from "@/app/dashboard/layout"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Bell, Inbox, LogOut, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
    const { isSidebarOpen } = useSidebarContext()
    const { user, logout } = useAuthStore()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    return (
        <header
            className={cn(
                "sticky top-0 z-30 w-full backdrop-blur-md transition-all duration-300 ease-in-out",
                "bg-card/90 border-b border-gray-500/20 shadow-md shadow-gray-500/20", // Light Mode
                "dark:bg-background/80 dark:border-border/50 dark:shadow-none", // Dark Mode
                "px-4 sm:px-6 h-16 flex items-center justify-between gap-4"
            )}
        >
            <div className="flex items-center gap-2">
                {/* Left side content */}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full w-9 h-9">
                    <Inbox className="h-5 w-5" />
                    <span className="sr-only">Buzón</span>
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-background" />
                </Button>

                {mounted ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9 border border-border/50">
                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {user?.username?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.username || "Usuario"}</p>
                                    <p className="text-xs leading-none text-muted-foreground capitalize">
                                        {user?.role?.toLowerCase() || "Rol"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/perfil" className="cursor-pointer">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/buzon" className="cursor-pointer">
                                    <Inbox className="mr-2 h-4 w-4" />
                                    <span>Buzón</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar Sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                )}
            </div>
        </header>
    )
}
