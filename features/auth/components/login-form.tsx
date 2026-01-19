"use client"

import type React from "react"
import { type AxiosError } from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/lib/store"
import { authService } from "@/features/auth/services/auth"

export function LoginForm() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    console.log("📝 Form submitted:", { username: formData.username })

    try {
      console.log("🔄 Calling authService.login...")
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      })
      console.log("✅ Login successful, user:", response.user)
      console.log("✅ Permissions received:", response.permissions)

      // Agregar permisos al objeto user antes de guardarlo en el store
      const userWithPermissions = {
        ...response.user,
        permissions: response.permissions || []
      }

      setUser(userWithPermissions, {
        access: response.access,
        refresh: response.refresh,
      })

      router.push("/dashboard")
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>
      console.error("❌ Login failed:", err)
      setError(axiosError.response?.data?.detail || "Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-950 to-slate-900">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">WJ System</CardTitle>
          <CardDescription className="text-slate-400">Inicia sesión para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">
                Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="tu_usuario"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
