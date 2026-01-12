"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IClienteFormData>({
        defaultValues: client || {
            ruc: "",
            razon_social: "",
            propietario: "",
            dni_propietario: "",
            estado: true,
            regimen_tributario: RegimenTributario.RMT,
            tipo_empresa: TipoEmpresa.SAC,
            ingresos_mensuales: "0",
            ingresos_anuales: "0",
            libros_societarios: 0,
            selectivo_consumo: false,
            credenciales: {},
        },
    })

    const credenciales = watch("credenciales")

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
        } catch (err: any) {
            setError(err.response?.data?.detail || "Error al guardar el cliente")
            console.error("Form error:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isSensitiveFieldsVisible = user?.role !== "ASISTENTE"

    return (
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            {error && <div className="p-3 bg-red-900/20 border border-red-700/50 rounded text-red-400 text-sm">{error}</div>}

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
                    <TabsTrigger value="general" className="text-slate-300">
                        General
                    </TabsTrigger>
                    <TabsTrigger value="credenciales" className="text-slate-300">
                        Credenciales
                    </TabsTrigger>
                    <TabsTrigger value="laboral" className="text-slate-300">
                        Laboral
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: GENERAL */}
                <TabsContent value="general" className="space-y-4">
                    <Card className="border-slate-700 bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Información General</CardTitle>
                            <CardDescription className="text-slate-400">Datos básicos de la empresa</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label className="text-slate-300">RUC</Label>
                                    <Controller
                                        name="ruc"
                                        control={control}
                                        rules={{ required: "RUC es requerido" }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="20123456789"
                                                disabled={!!client || isSubmitting}
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        )}
                                    />
                                    {errors.ruc && <p className="text-red-400 text-sm mt-1">{errors.ruc.message}</p>}
                                </div>

                                <div className="col-span-2">
                                    <Label className="text-slate-300">Razón Social</Label>
                                    <Controller
                                        name="razon_social"
                                        control={control}
                                        rules={{ required: "Razón social es requerida" }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Nombre de la empresa"
                                                disabled={isSubmitting}
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        )}
                                    />
                                    {errors.razon_social && <p className="text-red-400 text-sm mt-1">{errors.razon_social.message}</p>}
                                </div>

                                <div>
                                    <Label className="text-slate-300">Propietario</Label>
                                    <Controller
                                        name="propietario"
                                        control={control}
                                        rules={{ required: "Propietario es requerido" }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Nombre"
                                                disabled={isSubmitting}
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <Label className="text-slate-300">DNI Propietario</Label>
                                    <Controller
                                        name="dni_propietario"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="12345678"
                                                disabled={isSubmitting}
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <Label className="text-slate-300">Régimen Tributario</Label>
                                    <Controller
                                        name="regimen_tributario"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
                                    <Label className="text-slate-300">Tipo de Empresa</Label>
                                    <Controller
                                        name="tipo_empresa"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
                                    <Label className="text-slate-300">Ingresos Mensuales</Label>
                                    <Controller
                                        name="ingresos_mensuales"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <Label className="text-slate-300">Ingresos Anuales</Label>
                                    <Controller
                                        name="ingresos_anuales"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                                className="bg-slate-700 border-slate-600 text-white"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: CREDENCIALES */}
                <TabsContent value="credenciales" className="space-y-4">
                    <Card className="border-slate-700 bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Credenciales</CardTitle>
                            <CardDescription className="text-slate-400">
                                {isSensitiveFieldsVisible ? "Gestiona las claves de acceso" : "Las claves están ocultas para tu rol"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* SUNAT */}
                            <div>
                                <h3 className="font-semibold text-white mb-3">SUNAT (SOL)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Usuario SOL</Label>
                                        <Controller
                                            name="credenciales.sol_usuario"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "usuario" : "*****"}
                                                    type={isSensitiveFieldsVisible ? "text" : "password"}
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Contraseña SOL</Label>
                                        <Controller
                                            name="credenciales.sol_clave"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "contraseña" : "*****"}
                                                    type="password"
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Banco Nación */}
                            <div>
                                <h3 className="font-semibold text-white mb-3">Banco Nación (Detracción)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Cuenta</Label>
                                        <Controller
                                            name="credenciales.detraccion_cuenta"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "0000-0000-0000-0000" : "*****"}
                                                    type={isSensitiveFieldsVisible ? "text" : "password"}
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Usuario</Label>
                                        <Controller
                                            name="credenciales.detraccion_usuario"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "usuario" : "*****"}
                                                    type={isSensitiveFieldsVisible ? "text" : "password"}
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-slate-300">Contraseña</Label>
                                        <Controller
                                            name="credenciales.detraccion_clave"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "contraseña" : "*****"}
                                                    type="password"
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* INEI */}
                            <div>
                                <h3 className="font-semibold text-white mb-3">INEI</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-slate-300">Usuario</Label>
                                        <Controller
                                            name="credenciales.inei_usuario"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "usuario" : "*****"}
                                                    type={isSensitiveFieldsVisible ? "text" : "password"}
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-300">Contraseña</Label>
                                        <Controller
                                            name="credenciales.inei_clave"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    placeholder={isSensitiveFieldsVisible ? "contraseña" : "*****"}
                                                    type="password"
                                                    disabled={!isSensitiveFieldsVisible || isSubmitting}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 3: LABORAL */}
                <TabsContent value="laboral" className="space-y-4">
                    <Card className="border-slate-700 bg-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Información Laboral</CardTitle>
                            <CardDescription className="text-slate-400">Régimen laboral y datos asociados</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-slate-300">Régimen Laboral</Label>
                                <Controller
                                    name="regimen_laboral_tipo"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Ej: Común, Especial"
                                            disabled={isSubmitting}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Label className="text-slate-300">Fecha del Régimen Laboral</Label>
                                <Controller
                                    name="regimen_laboral_fecha"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            disabled={isSubmitting}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Label className="text-slate-300">Libros Societarios</Label>
                                <Controller
                                    name="libros_societarios"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="0"
                                            disabled={isSubmitting}
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSubmitting ? "Guardando..." : "Guardar Cliente"}
                </Button>
            </div>
        </form>
    )
}
