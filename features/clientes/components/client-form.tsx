"use client"

import { useState } from "react"
import type { AxiosError } from "axios"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { type ICliente, type IClienteFormData, RegimenTributario, TipoEmpresa } from "@/features/shared/types"
import { useAuth } from "@/hooks/use-auth"
import { clientesService } from "../services/clientes"

interface ClientFormProps {
    client?: ICliente
    onSuccess: () => void
    onCancel: () => void
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>("")

    const [enableSol, setEnableSol] = useState(!!client?.credenciales?.sol_usuario)
    const [enableDetraccion, setEnableDetraccion] = useState(!!client?.credenciales?.detraccion_cuenta)
    const [enableInei, setEnableInei] = useState(!!client?.credenciales?.inei_usuario)
    const [enableAfpNet, setEnableAfpNet] = useState(!!client?.credenciales?.afp_net_usuario)
    const [enableVivaEssalud, setEnableVivaEssalud] = useState(!!client?.credenciales?.viva_essalud_usuario)
    const [enablePe, setEnablePe] = useState(!!client?.credenciales?.pe)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IClienteFormData>({
        defaultValues: client || {
            ruc: "",
            razon_social: "",
            propietario: "",
            dni_propietario: "",
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

    const onSubmitHandler = async (data: IClienteFormData) => {
        setError("")
        setIsSubmitting(true)
        try {
            if (client?.ruc) {
                await clientesService.update(client.ruc, data)
            } else {
                await clientesService.create(data)
            }
            onSuccess()
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>
            setError(axiosError.response?.data?.detail || "Error al guardar el cliente")
            console.error("Form error:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isSensitiveFieldsVisible = user?.role !== "ASISTENTE"

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-medium">{error}</div>
                )}

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-linear-to-r from-slate-700 to-slate-800 border border-slate-600 p-1 rounded-lg">
                        <TabsTrigger
                            value="general"
                            className="text-slate-200 font-medium transition-colors data-[state=active]:text-white data-[state=active]:bg-slate-600 rounded"
                        >
                            📋 General
                        </TabsTrigger>
                        <TabsTrigger
                            value="credenciales"
                            className="text-slate-200 font-medium transition-colors data-[state=active]:text-white data-[state=active]:bg-slate-600 rounded"
                        >
                            🔐 Credenciales
                        </TabsTrigger>
                        <TabsTrigger
                            value="laboral"
                            className="text-slate-200 font-medium transition-colors data-[state=active]:text-white data-[state=active]:bg-slate-600 rounded"
                        >
                            💼 Laboral
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: GENERAL */}
                    <TabsContent value="general" className="space-y-4">
                        <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm shadow-lg">
                            <CardHeader className="border-b border-slate-700 pb-4">
                                <CardTitle className="text-white text-xl">Información General</CardTitle>
                                <CardDescription className="text-slate-400">Datos básicos de la empresa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="lg:col-span-2">
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">RUC</Label>
                                        <Controller
                                            name="ruc"
                                            control={control}
                                            rules={{ required: "RUC es requerido" }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="20123456789"
                                                    disabled={!!client || isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                />
                                            )}
                                        />
                                        {errors.ruc && <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.ruc.message}</p>}
                                    </div>

                                    <div className="lg:col-span-2">
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Razón Social</Label>
                                        <Controller
                                            name="razon_social"
                                            control={control}
                                            rules={{ required: "Razón social es requerida" }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Nombre de la empresa"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                />
                                            )}
                                        />
                                        {errors.razon_social && (
                                            <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.razon_social.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Propietario</Label>
                                        <Controller
                                            name="propietario"
                                            control={control}
                                            rules={{ required: "Propietario es requerido" }}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="Nombre"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                />
                                            )}
                                        />
                                        {errors.propietario && (
                                            <p className="text-red-400 text-xs mt-1.5 font-medium">{errors.propietario.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">DNI Propietario</Label>
                                        <Controller
                                            name="dni_propietario"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder="12345678"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Régimen Tributario</Label>
                                        <Controller
                                            name="regimen_tributario"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700">
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

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Tipo de Empresa</Label>
                                        <Controller
                                            name="tipo_empresa"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700">
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

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Ingresos Mensuales</Label>
                                        <Controller
                                            name="ingresos_mensuales"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0.00"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Ingresos Anuales</Label>
                                        <Controller
                                            name="ingresos_anuales"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0.00"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Categoría</Label>
                                        <Controller
                                            name="categoria"
                                            control={control}
                                            render={({ field }) => (
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700">
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

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Código de Control</Label>
                                        <Controller
                                            name="codigo_control"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Responsable ID</Label>
                                        <Controller
                                            name="responsable"
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value?.toString() || ""}
                                                    onValueChange={(val) => field.onChange(val ? Number(val) : undefined)}
                                                >
                                                    <SelectTrigger className="bg-slate-700/60 border-slate-500 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700">
                                                        <SelectValue placeholder="Seleccionar responsable" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-700 border-slate-600">
                                                        <SelectItem value="0">Sin asignar</SelectItem>
                                                        <SelectItem value="1">Responsable 1</SelectItem>
                                                        <SelectItem value="2">Responsable 2</SelectItem>
                                                        <SelectItem value="3">Responsable 3</SelectItem>
                                                        <SelectItem value="4">Responsable 4</SelectItem>
                                                        <SelectItem value="5">Responsable 5</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center space-x-3 px-1 py-2">
                                        <Controller
                                            name="selectivo_consumo"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isSubmitting}
                                                    className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                                />
                                            )}
                                        />
                                        <Label className="text-slate-300 font-medium cursor-pointer">Selectivo al Consumo</Label>
                                    </div>

                                    <div className="flex items-center space-x-3 px-1 py-2">
                                        <Controller
                                            name="estado"
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    disabled={isSubmitting}
                                                    className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                                />
                                            )}
                                        />
                                        <Label className="text-slate-300 font-medium cursor-pointer">Cliente Activo</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: CREDENCIALES */}
                    <TabsContent value="credenciales" className="space-y-4">
                        <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm shadow-lg">
                            <CardHeader className="border-b border-slate-700 pb-4">
                                <CardTitle className="text-white text-xl">Credenciales</CardTitle>
                                <CardDescription className="text-slate-400">
                                    {isSensitiveFieldsVisible ? "Gestiona las claves de acceso" : "Las claves están ocultas para tu rol"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="border border-slate-700 rounded-lg p-5 bg-slate-800/30">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Checkbox
                                            checked={enableSol}
                                            onCheckedChange={(checked) => setEnableSol(!!checked)}
                                            className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                        />
                                        <Label className="text-slate-200 font-semibold">Portal de Aduanas - SOL</Label>
                                    </div>
                                    {enableSol && isSensitiveFieldsVisible && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Usuario SOL</Label>
                                                <Controller
                                                    name="credenciales.sol_usuario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="usuario"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Contraseña SOL</Label>
                                                <Controller
                                                    name="credenciales.sol_clave"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="••••••••"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Detracción Section */}
                                <div className="border border-slate-700 rounded-lg p-5 bg-slate-800/30">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Checkbox
                                            checked={enableDetraccion}
                                            onCheckedChange={(checked) => setEnableDetraccion(!!checked)}
                                            className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                        />
                                        <Label className="text-slate-200 font-semibold">Detracción</Label>
                                    </div>
                                    {enableDetraccion && isSensitiveFieldsVisible && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                                            <div className="md:col-span-2">
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Cuenta Bancaria</Label>
                                                <Controller
                                                    name="credenciales.detraccion_cuenta"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="123456789"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* INEI Section */}
                                <div className="border border-slate-700 rounded-lg p-5 bg-slate-800/30">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Checkbox
                                            checked={enableInei}
                                            onCheckedChange={(checked) => setEnableInei(!!checked)}
                                            className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                        />
                                        <Label className="text-slate-200 font-semibold">INEI</Label>
                                    </div>
                                    {enableInei && isSensitiveFieldsVisible && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Usuario INEI</Label>
                                                <Controller
                                                    name="credenciales.inei_usuario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="usuario"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Contraseña INEI</Label>
                                                <Controller
                                                    name="credenciales.inei_clave"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="••••••••"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* AFP Net Section */}
                                <div className="border border-slate-700 rounded-lg p-5 bg-slate-800/30">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Checkbox
                                            checked={enableAfpNet}
                                            onCheckedChange={(checked) => setEnableAfpNet(!!checked)}
                                            className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                        />
                                        <Label className="text-slate-200 font-semibold">AFP Net</Label>
                                    </div>
                                    {enableAfpNet && isSensitiveFieldsVisible && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Usuario AFP</Label>
                                                <Controller
                                                    name="credenciales.afp_net_usuario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="usuario"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Contraseña AFP</Label>
                                                <Controller
                                                    name="credenciales.afp_net_clave"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="••••••••"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Viva EsSalud Section */}
                                <div className="border border-slate-700 rounded-lg p-5 bg-slate-800/30">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Checkbox
                                            checked={enableVivaEssalud}
                                            onCheckedChange={(checked) => setEnableVivaEssalud(!!checked)}
                                            className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                        />
                                        <Label className="text-slate-200 font-semibold">Viva EsSalud</Label>
                                    </div>
                                    {enableVivaEssalud && isSensitiveFieldsVisible && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Usuario EsSalud</Label>
                                                <Controller
                                                    name="credenciales.viva_essalud_usuario"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="usuario"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">Contraseña EsSalud</Label>
                                                <Controller
                                                    name="credenciales.viva_essalud_clave"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            type="password"
                                                            placeholder="••••••••"
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Portal Especial Section */}
                                <div className="border border-slate-700 rounded-lg p-5 bg-slate-800/30">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Checkbox
                                            checked={enablePe}
                                            onCheckedChange={(checked) => setEnablePe(!!checked)}
                                            className="border-slate-400 w-5 h-5 rounded accent-blue-500"
                                        />
                                        <Label className="text-slate-200 font-semibold">Portal Especial</Label>
                                    </div>
                                    {enablePe && isSensitiveFieldsVisible && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-8">
                                            <div className="md:col-span-2">
                                                <Label className="text-slate-300 font-semibold text-sm mb-2 block">URL / Información</Label>
                                                <Controller
                                                    name="credenciales.pe"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="https://..."
                                                            disabled={isSubmitting}
                                                            className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 3: LABORAL */}
                    <TabsContent value="laboral" className="space-y-4">
                        <Card className="border-slate-600 bg-slate-800/50 backdrop-blur-sm shadow-lg">
                            <CardHeader className="border-b border-slate-700 pb-4">
                                <CardTitle className="text-white text-xl">Información Laboral</CardTitle>
                                <CardDescription className="text-slate-400">Datos relacionados con asuntos laborales</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Label className="text-slate-200 font-semibold text-sm mb-2 block">Libros Societarios</Label>
                                        <Controller
                                            name="libros_societarios"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0"
                                                    disabled={isSubmitting}
                                                    className="bg-slate-700/60 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all hover:bg-slate-700"
                                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Guardando..." : client ? "Actualizar" : "Crear"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
