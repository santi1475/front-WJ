"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
        const isDarkMode = document.documentElement.classList.contains("dark")
        setIsDark(isDarkMode)
    }, [])

    const toggleTheme = () => {
        const html = document.documentElement
        html.classList.toggle("dark")
        setIsDark(!isDark)
        localStorage.setItem("theme", html.classList.contains("dark") ? "dark" : "light")
    }

    if (!mounted) {
        return <div className="w-10 h-10" />
    }

    return (
        <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Cambiar tema">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    )
}
