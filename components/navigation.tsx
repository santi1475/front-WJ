"use client"
import { Bell, Search } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"
import UserMenu from "@/components/user-menu"

export default function Navigation() {

    return (
        <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <div className="flex-1" />

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:inline-flex">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors relative hidden sm:inline-flex">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
                        </button>

                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </div>
            </div>
        </nav>
    )
}