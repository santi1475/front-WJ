"use client"

import { useState, useEffect } from "react"
import type { AxiosError } from "axios"
import { useForm, Controller, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { type ICliente, type IClienteFormData, RegimenTributario, TipoEmpresa, type ILibroSocietario } from "@/features/shared/types"
import { useAuth } from "@/hooks/use-auth"
import { clientesService } from "@/features/clientes/services/clientes"
import { responsableService } from "@/features/responsables/services/responsable.service"
import { IResponsable } from "@/features/responsables/types/responsable"
import { libroSocietarioService } from "@/features/shared/services/libro-societario.service"
import { tipoRegimenLaboralService } from "@/features/clientes/services/tipos-regimen-laboral"
import { ITipoRegimenLaboral } from "@/features/shared/types"
import { handleApiError, handleApiSuccess } from "@/lib/api-utils"
import { X, Eye, EyeOff, Building2, ShieldCheck, Key, FileText, Briefcase, Plus, Save, SlidersHorizontal, Info, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import type { FieldErrors } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

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
    const [enableOsce, setEnableOsce] = useState(false)
    const [enableSencico, setEnableSencico] = useState(false)

    const [responsables, setResponsables] = useState<IResponsable[]>([])
    const [loadingResponsables, setLoadingResponsables] = useState(false)
    const [regimenesLaborales, setRegimenesLaborales] = useState<ITipoRegimenLaboral[]>([])
    const [librosDisponibles, setLibrosDisponibles] = useState<ILibroSocietario[]>([])

    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
    const togglePasswordVisibility = (field: string) => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))

    const isControlled = typeof constrainedOpen !== "undefined"
    const isOpen = isControlled ? constrainedOpen : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const {
        control,
        handleSubmit,
        reset,
        setValue,
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
            libros_societarios: [],
            selectivo_consumo: false,
            planilla: false,
            credenciales: {},
        },
    })

    useEffect(() => {
        if (isOpen) {
            if (client) {
                reset(client)
                const creds = client.credenciales || {}
                setEnableSol(!!creds.sol_usuario || !!creds.sol_clave)
                setEnableDetraccion(!!creds.detraccion_cuenta || !!creds.detraccion_usuario || !!creds.detraccion_clave)
                setEnableInei(!!creds.inei_usuario || !!creds.inei_clave)
                setEnableAfpNet(!!creds.afp_net_usuario || !!creds.afp_net_clave)
                setEnableVivaEssalud(!!creds.viva_essalud_usuario || !!creds.viva_essalud_clave)
                setEnablePe(!!creds.pe)
                setEnableSis(!!creds.sis_clave)
                setEnableOsce(!!creds.clave_osce)
                setEnableSencico(!!creds.clave_sencico)
                
                // Set passwords to visible by default
                setShowPasswords({
                    sol: true,
                    detraccion: true,
                    afp_net: true,
                    viva_essalud: true,
                    sis: true,
                    inei: true,
                    osce: true,
                    sencico: true
                })
            } else {
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
                    libros_societarios: [],
                    selectivo_consumo: false,
                    planilla: false,
                    credenciales: {},
                })
                setEnableSol(false)
                setEnableDetraccion(false)
                setEnableInei(false)
                setEnableAfpNet(false)
                setEnableVivaEssalud(false)
                setEnablePe(false)
                setEnableSis(false)
                setEnableOsce(false)
                setEnableSencico(false)
                setShowPasswords({
                    sol: true,
                    detraccion: true,
                    afp_net: true,
                    viva_essalud: true,
                    sis: true,
                    inei: true,
                    osce: true,
                    sencico: true
                })
            }
        }
    }, [client, isOpen, reset, user])

    useEffect(() => {
        const fetchResponsables = async () => {
            setLoadingResponsables(true)
            try {
                const data = await responsableService.getAll()
                setResponsables(data)
            } catch (error: unknown) {
                console.error("Error loading responsables:", error)
            } finally {
                setLoadingResponsables(false)
            }
        }
        if (isOpen) {
            fetchResponsables()
            // Fetch regimenes laborales
            console.log("ClientForm: Attempting to fetch regimen types...");
            tipoRegimenLaboralService.getAll()
                .then(data => {
                    console.log("ClientForm: Set regimen types:", data);
                    setRegimenesLaborales(data);
                })
                .catch(err => console.error("ClientForm: Error loading regimen types:", err))

            libroSocietarioService.getAll()
                .then(data => setLibrosDisponibles(data))
                .catch(err => console.error("Error loading libros societarios", err))
        }
    }, [isOpen])

    const tipoEmpresaActual = useWatch({
        control,
        name: "tipo_empresa",
        defaultValue: TipoEmpresa.SAC
    });

    const selectedLibros = useWatch({
        control,
        name: "libros_societarios",
        defaultValue: []
    }) || [];

    const handleLibroChange = (id: number) => {
        const current = selectedLibros || [];
        if (current.includes(id)) {
            setValue("libros_societarios", current.filter(x => x !== id), { shouldDirty: true });
        } else {
            setValue("libros_societarios", [...current, id], { shouldDirty: true });
        }
    };

    useEffect(() => {
        console.log("DEBUG-LIBROS: effect init | isOpen:", isOpen, "| client:", !!client, "| librosDisp len:", librosDisponibles.length, "| tipoEmpresa:", tipoEmpresaActual);
        // Logica para auto-seleccionar libros societarios en un cliente NUEVO cuando cambie el tipo de empresa
        if (!client && isOpen && librosDisponibles.length > 0 && tipoEmpresaActual) {
            let recomendados: number[] = [];
            const mapLibros = librosDisponibles.reduce((acc, curr) => {
                // Normalizar nombre a minúsculas, sin acentos para busqueda exacta si es necesario
                const nombreMod = curr.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                acc[nombreMod] = curr.id;
                return acc;
            }, {} as Record<string, number>);

            console.log("DEBUG-LIBROS: mapLibros generados:", mapLibros);

            const findId = (partialName: string) => {
                const found = Object.keys(mapLibros).find(k => k.includes(partialName.toLowerCase()));
                console.log("DEBUG-LIBROS: buscando", partialName, "-> encontró llave", found, "-> id", found ? mapLibros[found] : null);
                return found ? mapLibros[found] : null;
            };

            const actas = findId("actas");
            const matricula = findId("matricula");
            const directorio = findId("directorio");

            console.log("DEBUG-LIBROS: IDs extraídos -> actas:", actas, "matricula:", matricula, "directorio:", directorio);

            if (tipoEmpresaActual === TipoEmpresa.EIRL) {
                console.log("DEBUG-LIBROS: evaluando EIRL -> actas");
                if (actas) recomendados.push(actas);
            } else if (tipoEmpresaActual === TipoEmpresa.SAC) {
                console.log("DEBUG-LIBROS: evaluando SAC -> actas, matricula");
                if (actas) recomendados.push(actas);
                if (matricula) recomendados.push(matricula);
            } else if (tipoEmpresaActual === TipoEmpresa.SA || tipoEmpresaActual === ("SAA" as any)) {
                console.log("DEBUG-LIBROS: evaluando SA/SAA -> actas, matricula, directorio");
                if (actas) recomendados.push(actas);
                if (matricula) recomendados.push(matricula);
                if (directorio) recomendados.push(directorio);
            }

            console.log("DEBUG-LIBROS: Asignando recomendaciones finales:", recomendados);
            setValue("libros_societarios", recomendados, { shouldDirty: true });
        }
    }, [tipoEmpresaActual, librosDisponibles, client, isOpen, setValue])

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
            // Crear copia del payload
            const payload = { ...data };

            // Si el usuario no es admin/superadmin, establecer automáticamente como responsable
            if (!user?.is_superuser && user?.id !== 1) {
                payload.responsable = user?.id ?? undefined;
            } else if (payload.responsable === 0 || !payload.responsable) {
                payload.responsable = undefined;
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

    const onErrorHandler = (errors: FieldErrors<IClienteFormData>) => {
        const errorMessages = Object.values(errors)
            .map(err => err?.message)
            .filter(Boolean)
            .join(", ")

        toast.error("Faltan datos indispensables", {
            description: errorMessages || "Por favor, completa correctamente los campos resaltados en rojo.",
            duration: 5000,
        })
    }

    if (!isOpen) {
        return !isControlled ? (
            <Button
                onClick={() => setIsOpen?.(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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
                    className="relative w-full max-w-1600px my-4 animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-white/10 rounded-t-2xl px-8 py-5 flex items-center justify-between shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                {client ? <SlidersHorizontal className="h-6 w-6 text-white" /> : <Plus className="h-6 w-6 text-white" />}
                            </div>
                            <div>
                                <h2 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">
                                    {client ? "Editar Perfil del Cliente" : "Registrar Nuevo Cliente"}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium">
                                    {client ? `Actualizando datos de ${client.razon_social}` : "Complete los campos para dar de alta un nuevo cliente"}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen?.(false)}
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-10 w-10 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Form Content */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-xl rounded-b-2xl p-6 border-x border-b border-white/10">
                        <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                    {error}
                                </div>
                            )}

                            {/* GRID PRINCIPAL DE TARJETAS */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                {/* Lateral Izquierdo: Información General (Col 1-4) */}
                                <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both">
                                    <Card className="border-white/10 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300">
                                        <CardHeader className="bg-gradient-to-r from-blue-600/10 to-transparent border-b border-white/20 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                                                    <Building2 className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <CardTitle className="text-slate-900 dark:text-white text-lg font-black tracking-tight">Información General</CardTitle>
                                            </div>
                                            <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">Datos básicos de identidad</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-5">
                                            {/* RUC */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                                                    RUC <span className="text-rose-500">*</span>
                                                </Label>
                                                <Controller
                                                    name="ruc"
                                                    control={control}
                                                    rules={{ required: "RUC es requerido" }}
                                                    render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                placeholder="Ej: 20123456789"
                                                                disabled={!!client || isSubmitting}
                                                                className="h-11 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20 shadow-inner font-mono font-bold text-base"
                                                            />
                                                    )}
                                                />
                                                {errors.ruc && <p className="text-rose-500 text-xs mt-1 font-bold animate-pulse">{errors.ruc.message}</p>}
                                            </div>

                                            {/* Razón Social */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                                                    Razón Social <span className="text-rose-500">*</span>
                                                </Label>
                                                <Controller
                                                    name="razon_social"
                                                    control={control}
                                                    rules={{ required: "Razón social es requerida" }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Ej: Inversiones S.A.C."
                                                            disabled={isSubmitting}
                                                            className="h-11 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white font-bold"
                                                        />
                                                    )}
                                                />
                                                {errors.razon_social && (
                                                    <p className="text-rose-500 text-xs mt-1 font-bold animate-pulse">{errors.razon_social.message}</p>
                                                )}
                                            </div>

                                            {/* Propietario */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                                                    Propietario / Representante <span className="text-rose-500">*</span>
                                                </Label>
                                                <Controller
                                                    name="propietario"
                                                    control={control}
                                                    rules={{ required: "Propietario es requerido" }}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Nombre completo"
                                                            disabled={isSubmitting}
                                                            className="h-11 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20 text-slate-900 dark:text-white font-semibold"
                                                        />
                                                    )}
                                                />
                                                {errors.propietario && (
                                                    <p className="text-rose-500 text-xs mt-1 font-bold animate-pulse">{errors.propietario.message}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Fecha de Ingreso */}
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Fecha ingreso</Label>
                                                    <Controller
                                                        name="fecha_ingreso"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={field.value || ""}
                                                                type="date"
                                                                disabled={isSubmitting}
                                                                className="h-10 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 font-medium"
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/* Categoría */}
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Categoría</Label>
                                                    <Controller
                                                        name="categoria"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="h-10 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 font-bold">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-white/10 dark:bg-slate-900/90 backdrop-blur-lg">
                                                                    <SelectItem value="A" className="font-bold text-emerald-600">Categoría A</SelectItem>
                                                                    <SelectItem value="B" className="font-bold text-blue-600">Categoría B</SelectItem>
                                                                    <SelectItem value="C" className="font-bold text-amber-600">Categoría C</SelectItem>
                                                                    <SelectItem value="N/T" className="font-bold text-slate-500">No Definido</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Régimen Tributario */}
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Régimen Trib.</Label>
                                                    <Controller
                                                        name="regimen_tributario"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="h-10 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 font-bold">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-white/10 dark:bg-slate-900/90 backdrop-blur-lg">
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
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Empresa</Label>
                                                    <Controller
                                                        name="tipo_empresa"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="h-10 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-blue-500 font-bold">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-white/10 dark:bg-slate-900/90 backdrop-blur-lg">
                                                                    <SelectItem value={TipoEmpresa.SAC}>S.A.C.</SelectItem>
                                                                    <SelectItem value={TipoEmpresa.EIRL}>E.I.R.L.</SelectItem>
                                                                    <SelectItem value={TipoEmpresa.SRL}>S.R.L.</SelectItem>
                                                                    <SelectItem value={TipoEmpresa.SA}>S.A.</SelectItem>
                                                                    <SelectItem value={TipoEmpresa.PN}>P. Natural</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Ingresos Mensuales */}
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Ingresos Mens.</Label>
                                                    <Controller
                                                        name="ingresos_mensuales"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                placeholder="0.00"
                                                                disabled={isSubmitting}
                                                                className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-white/20 focus:border-blue-500 font-mono"
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/* Código Control */}
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Cód. Control</Label>
                                                    <Controller
                                                        name="codigo_control"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                placeholder="000"
                                                                disabled={isSubmitting}
                                                                className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-white/20 focus:border-blue-500 font-mono font-bold"
                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            {/* Responsable */}
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2">
                                                    Responsable Asignado
                                                </Label>
                                                <Controller
                                                    name="responsable"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value?.toString() || "0"}
                                                            onValueChange={(value) => field.onChange(value === "0" ? 0 : Number(value))}
                                                            disabled={isSubmitting || loadingResponsables || (!user?.is_superuser && user?.id !== 1)}
                                                        >
                                                            <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-slate-950/50 border-white/20 focus:border-blue-500 font-bold italic text-blue-600 dark:text-blue-400">
                                                                <SelectValue placeholder={loadingResponsables ? "Cargando..." : "Seleccionar responsable"} />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-white/10 dark:bg-slate-900/90 backdrop-blur-lg max-h-[300px]">
                                                                <SelectItem value="0">Sin responsable</SelectItem>
                                                                {responsables.map((resp) => (
                                                                    <SelectItem key={resp.id} value={resp.id.toString()}>
                                                                        {resp.nombre}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Centro y Derecha: Información Laboral, Adicionales y Credenciales (Col 5-12) */}
                                <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-both">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Card 2: Información Laboral */}
                                        <Card className="border-white/10 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300">
                                            <CardHeader className="bg-gradient-to-r from-indigo-600/10 to-transparent border-b border-white/20 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                                                        <Briefcase className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                    <CardTitle className="text-slate-900 dark:text-white text-lg font-black tracking-tight">Inf. Laboral</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Régimen Laboral</Label>
                                                    <Controller
                                                        name="regimen_laboral_tipo"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select value={field.value || undefined} onValueChange={field.onChange}>
                                                                <SelectTrigger className="h-10 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-indigo-500 font-bold">
                                                                    <SelectValue placeholder="Seleccionar régimen" />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-white/10 dark:bg-slate-900/90 backdrop-blur-lg">
                                                                    {regimenesLaborales.map((regimen) => (
                                                                        <SelectItem key={regimen.id} value={regimen.descripcion}>
                                                                            {regimen.descripcion}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Acreditación</Label>
                                                    <Controller
                                                        name="regimen_laboral_fecha"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                value={field.value || ""}
                                                                type="date"
                                                                disabled={isSubmitting}
                                                                className="h-10 rounded-xl bg-white/70 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 focus:border-indigo-500 font-medium"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Card 3: Datos Adicionales */}
                                        <Card className="border-white/10 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
                                            <CardHeader className="bg-gradient-to-r from-cyan-600/10 to-transparent border-b border-white/20 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                                                        <FileText className="h-4 w-4 text-cyan-600" />
                                                    </div>
                                                    <CardTitle className="text-slate-900 dark:text-white text-lg font-black tracking-tight">Datos Adicionales</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                                        <Controller
                                                            name="planilla"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Checkbox
                                                                    id="planilla_chk"
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            )}
                                                        />
                                                        <Label htmlFor="planilla_chk" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Planilla</Label>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                                        <Controller
                                                            name="selectivo_consumo"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Checkbox
                                                                    id="selectivo_chk"
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            )}
                                                        />
                                                        <Label htmlFor="selectivo_chk" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Selectivo Cons.</Label>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Label className="text-slate-700 dark:text-slate-300 font-bold text-sm">Libros Societarios</Label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {librosDisponibles.map((libro: ILibroSocietario) => (
                                                            <div key={libro.id} className="flex items-center gap-2">
                                                                <Checkbox
                                                                    id={`libro-${libro.id}`}
                                                                    checked={selectedLibros.includes(libro.id)}
                                                                    onCheckedChange={() => handleLibroChange(libro.id)}
                                                                />
                                                                <Label htmlFor={`libro-${libro.id}`} className="text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer truncate">
                                                                    {libro.nombre}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Card 4: Credenciales (Tabs) */}
                                    <Card className="border-white/10 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden hover:border-blue-500/20 transition-all duration-300">
                                        <CardHeader className="bg-slate-900/5 dark:bg-white/5 border-b border-white/20 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-900/10 dark:bg-white/10 flex items-center justify-center">
                                                        <Key className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-slate-900 dark:text-white text-lg font-black tracking-tight">Credenciales de Acceso</CardTitle>
                                                        <CardDescription className="text-slate-500 text-xs font-medium">Gestión de accesos a plataformas oficiales</CardDescription>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Tabs defaultValue="sunat" className="w-full">
                                                <TabsList className="w-full flex h-12 bg-slate-900/5 dark:bg-white/5 border-b border-white/10 rounded-none p-0">
                                                    <TabsTrigger value="sunat" className="flex-1 h-full rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-none border-r border-white/10 font-bold text-xs uppercase tracking-wider">SUNAT</TabsTrigger>
                                                    <TabsTrigger value="laboral" className="flex-1 h-full rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-none border-r border-white/10 font-bold text-xs uppercase tracking-wider">Laboral / Seg.</TabsTrigger>
                                                    <TabsTrigger value="otros" className="flex-1 h-full rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-none font-bold text-xs uppercase tracking-wider">Otros Accesos</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="sunat" className="p-6 space-y-6 mt-0">
                                                    {/* SOL (SUNAT) */}
                                                    <div className={cn("space-y-4 transition-opacity", !enableSol && "opacity-50")}>
                                                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Acceso SOL</h4>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                <Checkbox checked={enableSol} onCheckedChange={(val) => setEnableSol(!!val)} />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-400">Usuario SOL</Label>
                                                                <Controller
                                                                    name="credenciales.sol_usuario"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input {...field} value={field.value || ""} disabled={!enableSol} placeholder="Usuario" className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 font-mono" />
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-400">Clave SOL</Label>
                                                                <div className="relative">
                                                                    <Controller
                                                                        name="credenciales.sol_clave"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Input {...field} value={field.value || ""} disabled={!enableSol} type={showPasswords["sol"] ? "text" : "password"} placeholder="Contraseña" className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 pr-10 font-mono" />
                                                                        )}
                                                                    />
                                                                    <button type="button" onClick={() => enableSol && togglePasswordVisibility("sol")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"><Eye className="h-4 w-4" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Detracción */}
                                                    <div className={cn("space-y-4 transition-opacity", !enableDetraccion && "opacity-50")}>
                                                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Cuenta Detracción</h4>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                <Checkbox checked={enableDetraccion} onCheckedChange={(val) => setEnableDetraccion(!!val)} />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-400">Nº Cuenta</Label>
                                                                <Controller
                                                                    name="credenciales.detraccion_cuenta"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input {...field} value={field.value || ""} disabled={!enableDetraccion} placeholder="00-000-000000" className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 font-mono" />
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-400">DNI / Usuario</Label>
                                                                <Controller
                                                                    name="credenciales.detraccion_usuario"
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Input {...field} value={field.value || ""} disabled={!enableDetraccion} placeholder="DNI" className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 font-mono" />
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-bold text-slate-700 dark:text-slate-400">Clave</Label>
                                                                <div className="relative">
                                                                    <Controller
                                                                        name="credenciales.detraccion_clave"
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <Input {...field} value={field.value || ""} disabled={!enableDetraccion} type={showPasswords["detraccion"] ? "text" : "password"} placeholder="****" className="h-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-white/10 pr-10 font-mono" />
                                                                        )}
                                                                    />
                                                                    <button type="button" onClick={() => enableDetraccion && togglePasswordVisibility("detraccion")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500"><Eye className="h-4 w-4" /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="laboral" className="p-6 space-y-6 mt-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* AFP Net */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 transition-opacity", !enableAfpNet && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">AFP Net</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enableAfpNet} onCheckedChange={(val) => setEnableAfpNet(!!val)} />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Controller name="credenciales.afp_net_usuario" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableAfpNet} placeholder="Usuario" className="h-9 text-sm rounded-lg" />} />
                                                                <Controller name="credenciales.afp_net_clave" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableAfpNet} type={showPasswords["afp_net"] ? "text" : "password"} placeholder="Clave" className="h-9 text-sm rounded-lg" />} />
                                                            </div>
                                                        </div>
                                                        {/* Viva Essalud */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 transition-opacity", !enableVivaEssalud && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">Viva Essalud</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enableVivaEssalud} onCheckedChange={(val) => setEnableVivaEssalud(!!val)} />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Controller name="credenciales.viva_essalud_usuario" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableVivaEssalud} placeholder="Usuario" className="h-9 text-sm rounded-lg" />} />
                                                                <Controller name="credenciales.viva_essalud_clave" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableVivaEssalud} type={showPasswords["viva_essalud"] ? "text" : "password"} placeholder="Clave" className="h-9 text-sm rounded-lg" />} />
                                                            </div>
                                                        </div>
                                                        {/* SIS */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 col-span-1 md:col-span-2 transition-opacity", !enableSis && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">SIS (Salud)</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enableSis} onCheckedChange={(val) => setEnableSis(!!val)} />
                                                                </div>
                                                            </div>
                                                            <div className="max-w-xs">
                                                                <Controller name="credenciales.sis_clave" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableSis} type={showPasswords["sis"] ? "text" : "password"} placeholder="Clave SIS" className="h-9 text-sm rounded-lg" />} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="otros" className="p-6 space-y-6 mt-0">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        {/* INEI */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 transition-opacity", !enableInei && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">INEI</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enableInei} onCheckedChange={(val) => setEnableInei(!!val)} />
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Controller name="credenciales.inei_usuario" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableInei} placeholder="U" className="h-9 text-sm font-mono" />} />
                                                                <Controller name="credenciales.inei_clave" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableInei} type={showPasswords["inei"] ? "text" : "password"} placeholder="C" className="h-9 text-sm font-mono" />} />
                                                            </div>
                                                        </div>

                                                        {/* PE */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 transition-opacity", !enablePe && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">Partida Electrónica</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enablePe} onCheckedChange={(val) => setEnablePe(!!val)} />
                                                                </div>
                                                            </div>
                                                            <Controller name="credenciales.pe" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enablePe} placeholder="Nº Partida" className="h-9 text-sm font-mono" />} />
                                                        </div>

                                                        {/* OSCE */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 transition-opacity", !enableOsce && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">Clave OSCE</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enableOsce} onCheckedChange={(val) => setEnableOsce(!!val)} />
                                                                </div>
                                                            </div>
                                                            <Controller name="credenciales.clave_osce" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableOsce} type={showPasswords["osce"] ? "text" : "password"} placeholder="Contraseña" className="h-9 text-sm font-mono" />} />
                                                        </div>

                                                        {/* SENCICO */}
                                                        <div className={cn("space-y-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 transition-opacity", !enableSencico && "opacity-50")}>
                                                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                                                                <Label className="text-sm font-black text-slate-800 dark:text-slate-200">Clave SENCICO</Label>
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-[10px] font-bold text-slate-500 uppercase">Activar</Label>
                                                                    <Checkbox checked={enableSencico} onCheckedChange={(val) => setEnableSencico(!!val)} />
                                                                </div>
                                                            </div>
                                                            <Controller name="credenciales.clave_sencico" control={control} render={({ field }) => <Input {...field} value={field.value || ""} disabled={!enableSencico} type={showPasswords["sencico"] ? "text" : "password"} placeholder="Contraseña" className="h-9 text-sm font-mono" />} />
                                                        </div>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsOpen?.(false)}
                                    disabled={isSubmitting}
                                    className="px-6 h-11 rounded-xl font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Guardando...</span>
                                        </div>
                                    ) : (
                                        "Guardar Cliente"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
