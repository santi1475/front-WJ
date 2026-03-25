"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { SlidersHorizontal, Search, RotateCcw, Loader2, X } from "lucide-react"
import { responsableService } from "@/features/responsables/services/responsable.service"
import { tipoRegimenLaboralService } from "@/features/clientes/services/tipos-regimen-laboral"
import { libroSocietarioService } from "@/features/shared/services/libro-societario.service"
import { RegimenTributario } from "@/features/shared/types"
import type { IResponsable } from "@/features/responsables/types/responsable"
import type { ITipoRegimenLaboral, ILibroSocietario } from "@/features/shared/types"

interface AdvancedFiltersCardProps {
    filters: Record<string, string>
    onApplyFilters: (filters: Record<string, string>) => void
    onClearFilters: () => void
    isLoading?: boolean
    mode?: "simple" | "full"
}

const CATEGORIAS = [
    { value: "A", label: "Categoría A" },
    { value: "B", label: "Categoría B" },
    { value: "C", label: "Categoría C" },
    { value: "N/T", label: "N/T - No definido" },
]

const REGIMENES_TRIBUTARIOS = [
    { value: RegimenTributario.RMT, label: "RMT - MYPE Tributario" },
    { value: RegimenTributario.ESPECIAL, label: "Especial" },
    { value: RegimenTributario.RUS, label: "Nuevo RUS" },
    { value: RegimenTributario.GENERAL, label: "General" },
]

const DIGITOS_RUC = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

function ClearButton({ onClick, visible }: { onClick: () => void; visible: boolean }) {
    if (!visible) return null
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
            title="Quitar selección"
        >
            <X className="h-3.5 w-3.5" />
        </button>
    )
}

export function AdvancedFiltersCard({
    filters,
    onApplyFilters,
    onClearFilters,
    isLoading = false,
    mode = "full",
}: AdvancedFiltersCardProps) {
    const [categoria, setCategoria] = useState(filters.categoria || "")
    const [regimenTributario, setRegimenTributario] = useState<string[]>(
        filters.regimen_tributario ? filters.regimen_tributario.split(",") : []
    )
    const [selectedResponsables, setSelectedResponsables] = useState<string[]>(
        filters.responsable ? filters.responsable.split(",") : []
    )
    const [regimenLaboral, setRegimenLaboral] = useState(filters.regimen_laboral_tipo || "")
    const [ultimoDigitoRuc, setUltimoDigitoRuc] = useState(filters.ultimo_digito_ruc || "")
    const [libroSocietario, setLibroSocietario] = useState<string[]>(
        filters.libros_societarios ? filters.libros_societarios.split(",") : []
    )
    const [selectivoConsumo, setSelectivoConsumo] = useState(filters.selectivo_consumo === "true")

    const [responsables, setResponsables] = useState<IResponsable[]>([])
    const [tiposRegimen, setTiposRegimen] = useState<ITipoRegimenLaboral[]>([])
    const [librosSocietarios, setLibrosSocietarios] = useState<ILibroSocietario[]>([])
    const [loadingOptions, setLoadingOptions] = useState(true)

    useEffect(() => {
        setCategoria(filters.categoria || "")
        setRegimenTributario(filters.regimen_tributario ? filters.regimen_tributario.split(",") : [])
        setSelectedResponsables(filters.responsable ? filters.responsable.split(",") : [])
        setRegimenLaboral(filters.regimen_laboral_tipo || "")
        setUltimoDigitoRuc(filters.ultimo_digito_ruc || "")
        setLibroSocietario(filters.libros_societarios ? filters.libros_societarios.split(",") : [])
        setSelectivoConsumo(filters.selectivo_consumo === "true")
    }, [filters])

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoadingOptions(true)
                const [respData, regimenData, librosData] = await Promise.all([
                    responsableService.getAll(),
                    tipoRegimenLaboralService.getAll(),
                    libroSocietarioService.getAll(),
                ])
                setResponsables(respData)
                setTiposRegimen(regimenData)
                setLibrosSocietarios(librosData)
            } catch (error) {
                console.error("Error fetching filter options:", error)
            } finally {
                setLoadingOptions(false)
            }
        }
        fetchOptions()
    }, [])

    const toggleResponsable = (id: string) => {
        setSelectedResponsables((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        )
    }

    const handleApply = useCallback(() => {
        const newFilters: Record<string, string> = {}
        if (categoria) newFilters.categoria = categoria
        if (regimenTributario.length > 0) newFilters.regimen_tributario = regimenTributario.join(",")
        if (selectedResponsables.length > 0) newFilters.responsable = selectedResponsables.join(",")
        if (regimenLaboral) newFilters.regimen_laboral_tipo = regimenLaboral
        if (ultimoDigitoRuc) newFilters.ultimo_digito_ruc = ultimoDigitoRuc
        if (libroSocietario.length > 0) newFilters.libros_societarios = libroSocietario.join(",")
        if (selectivoConsumo) newFilters.selectivo_consumo = "true"
        onApplyFilters(newFilters)
    }, [categoria, regimenTributario, selectedResponsables, regimenLaboral, ultimoDigitoRuc, libroSocietario, selectivoConsumo, onApplyFilters])

    const handleClear = useCallback(() => {
        setCategoria("")
        setRegimenTributario([])
        setSelectedResponsables([])
        setRegimenLaboral("")
        setUltimoDigitoRuc("")
        setLibroSocietario([])
        setSelectivoConsumo(false)
        onClearFilters()
    }, [onClearFilters])

    const activeFilterCount = [
        categoria,
        regimenTributario.length > 0 ? "yes" : "",
        selectedResponsables.length > 0 ? "yes" : "",
        regimenLaboral,
        ultimoDigitoRuc,
        libroSocietario.length > 0 ? "yes" : "",
        selectivoConsumo ? "true" : "",
    ].filter(Boolean).length

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden relative">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

            <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                            <SlidersHorizontal className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Búsqueda Avanzada
                        </CardTitle>
                    </div>
                    {activeFilterCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 animate-in fade-in zoom-in duration-300"
                        >
                            {activeFilterCount} filtro{activeFilterCount > 1 ? "s" : ""} aplicado{activeFilterCount > 1 ? "s" : ""}
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {loadingOptions ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                            Sincronizando catálogos...
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">

                        {/* Categoría */}
                        <div className="flex flex-col gap-2 group">
                            <Label htmlFor="filter-categoria" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-blue-500" />
                                Categoría
                            </Label>
                            <div className="relative">
                                <Select value={categoria} onValueChange={setCategoria}>
                                    <SelectTrigger
                                        id="filter-categoria"
                                        className="h-11 w-full bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 pr-12 font-medium focus:ring-blue-500/20"
                                    >
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIAS.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value} className="font-medium">
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <ClearButton visible={!!categoria} onClick={() => setCategoria("")} />
                            </div>
                        </div>

                        {/* Régimen Tributario */}
                        <div className="flex flex-col gap-3 group">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    Régimen Tributario
                                </span>
                                {regimenTributario.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setRegimenTributario([])}
                                        className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center"
                                    >
                                        <X className="h-3 w-3 mr-1" />
                                        Limpiar
                                    </button>
                                )}
                            </Label>
                            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                {REGIMENES_TRIBUTARIOS.map((reg) => (
                                    <div key={reg.value} className={`flex items-start space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${regimenTributario.includes(reg.value) ? "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800" : "bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`} onClick={() => {
                                        setRegimenTributario(prev => prev.includes(reg.value) ? prev.filter(v => v !== reg.value) : [...prev, reg.value])
                                    }}>
                                        <Checkbox
                                            id={`reg-${reg.value}`}
                                            checked={regimenTributario.includes(reg.value)}
                                            onCheckedChange={(checked) => {
                                                if (checked) setRegimenTributario(prev => [...prev, reg.value])
                                                else setRegimenTributario(prev => prev.filter(v => v !== reg.value))
                                            }}
                                            className="mt-0.5 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-md"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label htmlFor={`reg-${reg.value}`} className="text-sm font-medium leading-tight cursor-pointer flex-1" onClick={(e) => e.preventDefault()}>
                                            {reg.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Régimen Laboral */}
                        {mode === "full" && (
                            <div className="flex flex-col gap-2 group">
                                <Label htmlFor="filter-regimen" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="h-1 w-1 rounded-full bg-cyan-500" />
                                    Rég. Laboral
                                </Label>
                                <div className="relative">
                                    <Select value={regimenLaboral} onValueChange={setRegimenLaboral}>
                                        <SelectTrigger
                                            id="filter-regimen"
                                            className="h-11 w-full bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 pr-12 font-medium"
                                        >
                                            <SelectValue placeholder="Todos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposRegimen.map((tipo) => (
                                                <SelectItem key={tipo.id} value={tipo.descripcion} className="font-medium">
                                                    {tipo.descripcion}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ClearButton visible={!!regimenLaboral} onClick={() => setRegimenLaboral("")} />
                                </div>
                            </div>
                        )}

                        {/* Último Dígito RUC */}
                        {mode === "full" && (
                            <div className="flex flex-col gap-2 group">
                                <Label htmlFor="filter-digito" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="h-1 w-1 rounded-full bg-slate-400" />
                                    Últ. Dígito
                                </Label>
                                <div className="relative gap-2">
                                    <Select value={ultimoDigitoRuc} onValueChange={setUltimoDigitoRuc}>
                                        <SelectTrigger
                                            id="filter-digito"
                                            className="h-11 w-full bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 pr-12 font-mono font-bold"
                                        >
                                            <SelectValue placeholder="Ok" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DIGITOS_RUC.map((d) => (
                                                <SelectItem key={d} value={d} className="font-mono font-bold">
                                                    {d}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ClearButton visible={!!ultimoDigitoRuc} onClick={() => setUltimoDigitoRuc("")} />
                                </div>
                            </div>
                        )}

                        {/* Libros Societarios */}
                        {mode === "full" && (
                            <div className="flex flex-col gap-3 group">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                        Libros Societarios
                                    </span>
                                    {libroSocietario.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setLibroSocietario([])}
                                            className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center"
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Limpiar
                                        </button>
                                    )}
                                </Label>
                                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                    {librosSocietarios.map((libro) => (
                                        <div key={libro.id} className={`flex items-start space-x-3 p-2.5 rounded-xl border transition-all cursor-pointer ${libroSocietario.includes(String(libro.id)) ? "bg-purple-50/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" : "bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}`} onClick={() => {
                                            const idStr = String(libro.id)
                                            setLibroSocietario(prev => prev.includes(idStr) ? prev.filter(v => v !== idStr) : [...prev, idStr])
                                        }}>
                                            <Checkbox
                                                id={`lib-${libro.id}`}
                                                checked={libroSocietario.includes(String(libro.id))}
                                                onCheckedChange={(checked) => {
                                                    const idStr = String(libro.id)
                                                    if (checked) setLibroSocietario(prev => [...prev, idStr])
                                                    else setLibroSocietario(prev => prev.filter(v => v !== idStr))
                                                }}
                                                className="mt-0.5 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600 rounded-md"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <Label htmlFor={`lib-${libro.id}`} className="text-sm font-medium leading-tight cursor-pointer flex-1" onClick={(e) => e.preventDefault()}>
                                                {libro.nombre}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ISC Checkbox */}
                        {mode === "full" && (
                            <div className="flex flex-col gap-2">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <div className="h-1 w-1 rounded-full bg-rose-500" />
                                    Tributación
                                </Label>
                                <div className="flex items-center h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 gap-3 hover:border-blue-500/50 transition-colors duration-200">
                                    <Checkbox
                                        id="filter-selectivo"
                                        checked={selectivoConsumo}
                                        onCheckedChange={(checked) => setSelectivoConsumo(checked === true)}
                                        className="h-5 w-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                                    />
                                    <Label
                                        htmlFor="filter-selectivo"
                                        className="text-sm font-semibold cursor-pointer text-slate-600 dark:text-slate-400 whitespace-nowrap"
                                    >
                                        Sel. Consumo
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Responsables */}
                {!loadingOptions && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center justify-between mb-4 gap-4">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                Responsables de cuenta
                                {selectedResponsables.length > 0 && (
                                    <Badge variant="secondary" className="ml-3 h-5 text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-none px-2 rounded-md">
                                        {selectedResponsables.length} ACTIVOS
                                    </Badge>
                                )}
                            </Label>
                            {selectedResponsables.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedResponsables([])}
                                    className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest flex items-center"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Resetear responsable
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {responsables.map((resp) => {
                                const isSelected = selectedResponsables.includes(String(resp.id))
                                return (
                                    <button
                                        key={resp.id}
                                        type="button"
                                        onClick={() => toggleResponsable(String(resp.id))}
                                        className={`
                                            inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                                            border transition-all duration-300 cursor-pointer group/pill
                                            ${isSelected
                                                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10 dark:bg-blue-600 dark:border-blue-600"
                                                : "bg-white text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800 hover:border-slate-300"
                                            }
                                        `}
                                    >
                                        <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-800"}`} />
                                        {resp.nombre}
                                        {isSelected && (
                                            <div className="ml-1 p-0.5 rounded-full bg-white/10 group-hover/pill:bg-white/20 transition-colors">
                                                <X className="h-3 w-3" />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center gap-3 pt-6 pb-6 bg-slate-50/50 dark:bg-slate-950/20 ">
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    disabled={isLoading || activeFilterCount === 0}
                    className="text-slate-500 hover:text-slate-200 dark:hover:text-white font-bold text-xs uppercase tracking-widest h-11"
                >
                    <RotateCcw className="h-4 w-4 opacity-70 " />
                    Limpiar Filtros
                </Button>

                <Button
                    onClick={handleApply}
                    disabled={isLoading || loadingOptions}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-11 rounded-xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all duration-200 min-w-[180px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4  animate-spin" />
                            Filtrando...
                        </>
                    ) : (
                        <>
                            <Search className="h-4 w-4 mr-2" />
                            Aplicar Consultas
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}