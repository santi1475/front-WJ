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
import { Loader2, KeyRound, User, ChevronRight } from "lucide-react"

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
    console.log("Form submitted:", { username: formData.username })

    try {
      console.log("Calling authService.login...")
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      })
      console.log("Login successful, user:", response.user)
      console.log("Permissions received:", response.permissions)

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
      console.error("Login failed:", err)
      setError(axiosError.response?.data?.detail || "Fallo la autenticación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 shadow-2xl shadow-indigo-500/20">
            <KeyRound className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            WJ System
          </h1>
          <p className="text-slate-400">
            Bienvenido de vuelta, ingresa tus credenciales
          </p>
        </div>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800/60 shadow-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <p>Credenciales inválidas, verifica tu acceso.</p>
                </div>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="username" className="text-slate-300 font-medium">
                  Usuario
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Escribe tu usuario..."
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-11 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:bg-slate-900/50 h-12 text-base rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-slate-300 font-medium">
                  Contraseña
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="pl-11 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:bg-slate-900/50 h-12 text-base rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base rounded-xl shadow-lg shadow-indigo-900/20 group transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
