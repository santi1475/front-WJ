"use client"

import { useState, useEffect } from "react"
import type { AxiosError } from "axios"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { type ICliente, type IClienteFormData, RegimenTributario, TipoEmpresa } from "@/features/shared/types"
import type { IUserManaged } from "@/features/shared/types/user"
import { useAuth } from "@/hooks/use-auth"
import { clientesService } from "@/features/clientes/services/clientes"
import { userService } from "@/features/users/services/user.service"
import { handleApiError, handleApiSuccess } from "@/lib/api-utils"
import { X } from "lucide-react"

interface ClientFormProps {
    client?: ICliente | null
    onSuccess?: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ClientForm({ client, onSuccess, open: constrainedOpen, onOpenChange }: ClientFormProps) {
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>("")
    const [internalOpen, setInternalOpen] = useState(false)

    const [enableSol, setEnableSol] = useState(false)
    const [enableDetraccion, setEnableDetraccion] = useState(false)
    const [enableInei, setEnableInei] = useState(false)
    const [enableAfpNet, setEnableAfpNet] = useState(false)
    const [enableVivaEssalud, setEnableVivaEssalud] = useState(false)
    const [enablePe, setEnablePe] = useState(false)
    const [enableSis, setEnableSis] = useState(false)

    const [users, setUsers] = useState<IUserManaged[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)

    const isControlled = typeof constrainedOpen !== "undefined"
    const isOpen = isControlled ? constrainedOpen : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IClienteFormData>({
        defaultValues: {
            ruc: "",
            razon_social: "",
            propietario: "",
            fecha_ingreso: "",
            estado: true,
            codigo_control: 0,
            responsable: 0,
            regimen_tributario: RegimenTributario.RMT,
            tipo_empresa: TipoEmpresa.SAC,
            categoria: "N/T",
            ingresos_mensuales: "0",
            ingresos_anuales: "0",
            libros_societarios: 0,
            selectivo_consumo: false,
            credenciales: {},
        },
    })

    useEffect(() => {
        if (isOpen) {
            if (client) {
                reset(client)
                // Inicializar estados de credenciales basados en el cliente
                setEnableSol(!!client.credenciales?.sol_usuario)
                setEnableDetraccion(!!client.credenciales?.detraccion_cuenta)
                setEnableInei(!!client.credenciales?.inei_usuario)
                setEnableAfpNet(!!client.credenciales?.afp_net_usuario)
                setEnableVivaEssalud(!!client.credenciales?.viva_essalud_usuario)
                setEnablePe(!!client.credenciales?.pe)
                setEnableSis(!!client.credenciales?.sis_usuario)
            } else {
                // Si no es admin/superadmin, establecer al usuario actual como responsable
                const defaultResponsable = (!user?.is_superuser && user?.id !== 1) ? user?.id || 0 : 0
                
                reset({
                    ruc: "",
                    razon_social: "",
                    propietario: "",
                    fecha_ingreso: "",
                    estado: true,
                    codigo_control: 0,
                    responsable: defaultResponsable,
                    regimen_tributario: RegimenTributario.RMT,
                    tipo_empresa: TipoEmpresa.SAC,
                    categoria: "N/T",
                    ingresos_mensuales: "0",
                    ingresos_anuales: "0",
                    libros_societarios: 0,
                    selectivo_consumo: false,
                    credenciales: {},
                })
                setEnableSol(false)
                setEnableDetraccion(false)
                setEnableInei(false)
                setEnableAfpNet(false)
                setEnableVivaEssalud(false)
                setEnablePe(false)
                setEnableSis(false)
            }
        }
    }, [client, isOpen, reset, user])

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true)
            try {
                const usersData = await userService.getAll()
                setUsers(usersData)
            } catch (error: any) {
                if (error?.response?.status !== 403) {
                    console.error("Error loading users:", error)
                }
            } finally {
                setLoadingUsers(false)
            }
        }
        if (isOpen) {
            fetchUsers()
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen?.(false)
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, setIsOpen])

    const onSubmitHandler = async (data: IClienteFormData) => {
        setError("")
        setIsSubmitting(true)
        try {
            const payload = { ...data } as any;
            
            // Si el usuario no es admin/superadmin, establecer automáticamente como responsable
            if (!user?.is_superuser && user?.id !== 1) {
                payload.responsable = user?.id || null;
            } else if (payload.responsable === 0 || !payload.responsable) {
                payload.responsable = null;
            } else {
                payload.responsable = Number(payload.responsable);
            }

            if (client?.ruc) {
                await clientesService.update(client.ruc, payload)
            } else {
                await clientesService.create(payload)
            }
            handleApiSuccess("Cliente guardado correctamente")
            setIsOpen?.(false)
            onSuccess?.()
        } catch (err) {
            handleApiError(err, "Error al guardar el cliente")
            const axiosError = err as AxiosError<{ detail: string }>
            setError(axiosError.response?.data?.detail || "Error al guardar el cliente")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return !isControlled ? (
            <Button
                onClick={() => setIsOpen?.(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
                {client ? "Editar Cliente" : "+ Nuevo Cliente"}
            </Button>
        ) : null
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 z-50 animate-in fade-in duration-200"
                onClick={() => setIsOpen?.(false)}
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
                <div
                    className="relative w-full max-w-[1600px] my-4 animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 rounded-t-lg px-6 py-4 flex items-center justify-between">
                        <h2 className="text-white text-2xl font-semibold">
                            {client ? "Editar Cliente" : "Nuevo Cliente"}
                        </h2>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen?.(false)}
                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Form Content */}
                    <div className="bg-slate-900 rounded-b-lg p-4">
                        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-3">
                            {error && (
                                <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* GRID PRINCIPAL DE TARJETAS - 5 columnas x 5 filas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-1 gap-3 auto-rows-max">
                                {/* Card 1: INFORMACIÓN GENERAL - row-span-3 row-start-2 */}
                                <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm row-span-3 row-start-2 h-fit">
                                    <CardHeader className="border-b border-slate-700 pb-3">
                                        <CardTitle className="text-white text-lg">📋 Información General</CardTitle>
                                        <CardDescription className="text-slate-400">Datos básicos de la empresa</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* RUC */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">RUC</Label>
                                                <Controller
                                                    name="ruc"
                                                    control={control}
                                                    rules={{ required: "RUC es requerido" }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="20123456789"
                                                            disabled={!!client || isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                                {errors.ruc && <p className="text-red-400 text-xs mt-1 font-medium">{errors.ruc.message}</p>}
                                            </div>

                                            {/* Razón Social */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Razón Social</Label>
                                                <Controller
                                                    name="razon_social"
                                                    control={control}
                                                    rules={{ required: "Razón social es requerida" }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Nombre de la empresa"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                                {errors.razon_social && (
                                                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.razon_social.message}</p>
                                                )}
                                            </div>

                                            {/* Propietario */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Propietario</Label>
                                                <Controller
                                                    name="propietario"
                                                    control={control}
                                                    rules={{ required: "Propietario es requerido" }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Nombre"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                                {errors.propietario && (
                                                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.propietario.message}</p>
                                                )}
                                            </div>

                                            {/* Fecha de Ingreso */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Fecha de Ingreso</Label>
                                                <Controller
                                                    name="fecha_ingreso"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            type="date"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Régimen Tributario */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Régimen Tributario</Label>
                                                <Controller
                                                    name="regimen_tributario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-700 border-slate-600">
                                                                <SelectItem value={RegimenTributario.RMT}>RMT</SelectItem>
                                                                <SelectItem value={RegimenTributario.ESPECIAL}>Especial</SelectItem>
                                                                <SelectItem value={RegimenTributario.RUS}>RUS</SelectItem>
                                                                <SelectItem value={RegimenTributario.GENERAL}>General</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            {/* Tipo de Empresa */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Tipo de Empresa</Label>
                                                <Controller
                                                    name="tipo_empresa"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-700 border-slate-600">
                                                                <SelectItem value={TipoEmpresa.SAC}>SAC</SelectItem>
                                                                <SelectItem value={TipoEmpresa.EIRL}>EIRL</SelectItem>
                                                                <SelectItem value={TipoEmpresa.SRL}>SRL</SelectItem>
                                                                <SelectItem value={TipoEmpresa.SA}>SA</SelectItem>
                                                                <SelectItem value={TipoEmpresa.PN}>P.N.</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            {/* Ingresos Mensuales */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Ingresos Mensuales</Label>
                                                <Controller
                                                    name="ingresos_mensuales"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="0.00"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Ingresos Anuales */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Ingresos Anuales</Label>
                                                <Controller
                                                    name="ingresos_anuales"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="0.00"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Categoría */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Categoría</Label>
                                                <Controller
                                                    name="categoria"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select value={field.value} onValueChange={field.onChange}>
                                                            <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-700 border-slate-600">
                                                                <SelectItem value="A">A - Activo</SelectItem>
                                                                <SelectItem value="B">B - Pendiente</SelectItem>
                                                                <SelectItem value="C">C - Inactivo</SelectItem>
                                                                <SelectItem value="N/T">N/T - No definido</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>

                                            {/* Código de Control */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Código de Control</Label>
                                                <Controller
                                                    name="codigo_control"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="0"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Responsable */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Responsable</Label>
                                                <Controller
                                                    name="responsable"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value?.toString() || "0"}
                                                            onValueChange={(value) => field.onChange(value === "0" ? 0 : Number(value))}
                                                            disabled={isSubmitting || loadingUsers || (!user?.is_superuser && user?.id !== 1)}
                                                        >
                                                            <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm">
                                                                <SelectValue placeholder={loadingUsers ? "Cargando usuarios..." : "Seleccionar responsable"} />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-700 border-slate-600 max-h-[300px]">
                                                                <SelectItem value="0">Sin responsable</SelectItem>
                                                                {users.map((u) => (
                                                                    <SelectItem key={u.id} value={u.id.toString()}>
                                                                        {u.first_name && u.last_name
                                                                            ? `${u.first_name} ${u.last_name} (${u.username})`
                                                                            : u.username
                                                                        }
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 2: INFORMACIÓN LABORAL - row-start-2 */}
                                <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm row-start-2 h-fit">
                                    <CardHeader className="border-b border-slate-700 pb-3">
                                        <CardTitle className="text-white text-lg">👔 Información Laboral</CardTitle>
                                        <CardDescription className="text-slate-400">Régimen laboral de la empresa</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Régimen Laboral Tipo */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Tipo de Régimen Laboral</Label>
                                                <Controller
                                                    name="regimen_laboral_tipo"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Ej: General, MYPE, etc."
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Régimen Laboral Fecha */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Fecha de Régimen Laboral</Label>
                                                <Controller
                                                    name="regimen_laboral_fecha"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            value={field.value || ""}
                                                            type="date"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 3: DATOS ADICIONALES - row-start-2 */}
                                <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm row-start-2 h-fit">
                                    <CardHeader className="border-b border-slate-700 pb-3">
                                        <CardTitle className="text-white text-lg">📊 Datos Adicionales</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Libros Societarios */}
                                            <div>
                                                <Label className="text-slate-200 font-semibold text-xs mb-2 block">Libros Societarios</Label>
                                                <Controller
                                                    name="libros_societarios"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="0"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {/* Selectivo Consumo */}
                                            <div className="flex items-end">
                                                <div className="flex items-center space-x-2">
                                                    <Controller
                                                        name="selectivo_consumo"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                disabled={isSubmitting}
                                                                className="border-slate-500 bg-slate-700/60"
                                                            />
                                                        )}
                                                    />
                                                    <Label className="text-slate-200 font-semibold text-xs cursor-pointer">Selectivo Consumo</Label>
                                                </div>
                                            </div>

                                            {/* Estado */}
                                            <div className="flex items-end">
                                                <div className="flex items-center space-x-2">
                                                    <Controller
                                                        name="estado"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                disabled={isSubmitting}
                                                                className="border-slate-500 bg-slate-700/60"
                                                            />
                                                        )}
                                                    />
                                                    <Label className="text-slate-200 font-semibold text-xs cursor-pointer">Activo</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Card 4: CREDENCIALES - col-span-2 row-span-2 col-start-2 row-start-3 */}
                                <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm col-span-2 row-span-2 col-start-2 row-start-3 h-fit">
                                    <CardHeader className="border-b border-slate-700 pb-3">
                                        <CardTitle className="text-white text-lg">🔐 Credenciales</CardTitle>
                                        <CardDescription className="text-slate-400">Credenciales de acceso a sistemas</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-4">
                                        {/* SOL (SUNAT) */}
                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-sol"
                                                    checked={enableSol}
                                                    onCheckedChange={(checked) => {
                                                        setEnableSol(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    sol_usuario: undefined,
                                                                    sol_clave: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-sol" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    SOL (SUNAT)
                                                </Label>
                                            </div>
                                            {enableSol && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Usuario SOL</Label>
                                                        <Controller
                                                            name="credenciales.sol_usuario"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="Usuario"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Clave SOL</Label>
                                                        <Controller
                                                            name="credenciales.sol_clave"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    type="password"
                                                                    placeholder="Contraseña"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Detracción */}
                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-detraccion"
                                                    checked={enableDetraccion}
                                                    onCheckedChange={(checked) => {
                                                        setEnableDetraccion(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    detraccion_cuenta: undefined,
                                                                    detraccion_usuario: undefined,
                                                                    detraccion_clave: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-detraccion" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    Detracción
                                                </Label>
                                            </div>
                                            {enableDetraccion && (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-6">
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Cuenta</Label>
                                                        <Controller
                                                            name="credenciales.detraccion_cuenta"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="Cuenta"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">DNI</Label>
                                                        <Controller
                                                            name="credenciales.detraccion_usuario"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="DNI"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Clave</Label>
                                                        <Controller
                                                            name="credenciales.detraccion_clave"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    type="password"
                                                                    placeholder="Contraseña"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* INEI */}
                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-inei"
                                                    checked={enableInei}
                                                    onCheckedChange={(checked) => {
                                                        setEnableInei(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    inei_usuario: undefined,
                                                                    inei_clave: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-inei" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    INEI
                                                </Label>
                                            </div>
                                            {enableInei && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Usuario INEI</Label>
                                                        <Controller
                                                            name="credenciales.inei_usuario"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="Usuario"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Clave INEI</Label>
                                                        <Controller
                                                            name="credenciales.inei_clave"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    type="password"
                                                                    placeholder="Contraseña"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* AFP Net */}
                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-afp"
                                                    checked={enableAfpNet}
                                                    onCheckedChange={(checked) => {
                                                        setEnableAfpNet(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    afp_net_usuario: undefined,
                                                                    afp_net_clave: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-afp" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    AFP Net
                                                </Label>
                                            </div>
                                            {enableAfpNet && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Usuario AFP Net</Label>
                                                        <Controller
                                                            name="credenciales.afp_net_usuario"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="Usuario"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Clave AFP Net</Label>
                                                        <Controller
                                                            name="credenciales.afp_net_clave"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    type="password"
                                                                    placeholder="Contraseña"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Viva Essalud */}
                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-essalud"
                                                    checked={enableVivaEssalud}
                                                    onCheckedChange={(checked) => {
                                                        setEnableVivaEssalud(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    viva_essalud_usuario: undefined,
                                                                    viva_essalud_clave: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-essalud" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    Viva Essalud
                                                </Label>
                                            </div>
                                            {enableVivaEssalud && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Usuario Viva Essalud</Label>
                                                        <Controller
                                                            name="credenciales.viva_essalud_usuario"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="Usuario"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Clave Viva Essalud</Label>
                                                        <Controller
                                                            name="credenciales.viva_essalud_clave"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    type="password"
                                                                    placeholder="Contraseña"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* PE */}

                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-pe"
                                                    checked={enablePe}
                                                    onCheckedChange={(checked) => {
                                                        setEnablePe(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    pe: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-pe" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    PE (Planilla Electrónica)
                                                </Label>
                                            </div>
                                            {enablePe && (
                                                <div className="ml-6">
                                                    <Label className="text-slate-200 font-semibold text-xs mb-2 block">Código PE</Label>
                                                    <Controller
                                                        name="credenciales.pe"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={field.value || ""}
                                                                placeholder="Código"
                                                                disabled={isSubmitting}
                                                                className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* SIS (Sistema Integrado de Salud) */}
                                        <div className="border-b border-slate-700 pb-3">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <Checkbox
                                                    id="enable-sis"
                                                    checked={enableSis}
                                                    onCheckedChange={(checked) => {
                                                        setEnableSis(!!checked)
                                                        if (!checked) {
                                                            reset({
                                                                ...control._formValues,
                                                                credenciales: {
                                                                    ...control._formValues.credenciales,
                                                                    sis_usuario: undefined,
                                                                    sis_clave: undefined,
                                                                }
                                                            })
                                                        }
                                                    }}
                                                    className="border-slate-500 bg-slate-700/60"
                                                />
                                                <Label htmlFor="enable-sis" className="text-slate-200 font-semibold text-sm cursor-pointer">
                                                    SIS (Sistema Integrado de Salud)
                                                </Label>
                                            </div>
                                            {enableSis && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Usuario SIS</Label>
                                                        <Controller
                                                            name="credenciales.sis_usuario"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    placeholder="Usuario"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-slate-200 font-semibold text-xs mb-2 block">Clave SIS</Label>
                                                        <Controller
                                                            name="credenciales.sis_clave"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                    type="password"
                                                                    placeholder="Contraseña"
                                                                    disabled={isSubmitting}
                                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700 h-9 text-sm"
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-700">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsOpen?.(false)}
                                    disabled={isSubmitting}
                                    className="border-slate-600 text-slate-200 hover:bg-slate-800"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                >
                                    {isSubmitting ? "Guardando..." : "Guardar"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
