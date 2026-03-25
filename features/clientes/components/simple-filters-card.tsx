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
import { Filter, Search, RotateCcw, Loader2, X, Users, Briefcase, Tag } from "lucide-react"
import { responsableService } from "@/features/responsables/services/responsable.service"
import { RegimenTributario } from "@/features/shared/types"
import type { IResponsable } from "@/features/responsables/types/responsable"
import { useAuth } from "@/hooks/use-auth"
import { UserPermission } from "@/features/auth/types/permissions"

interface SimpleFiltersCardProps {
    filters: Record<string, string>
    onApplyFilters: (filters: Record<string, string>) => void
    onClearFilters: () => void
    isLoading?: boolean
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

export function SimpleFiltersCard({
    filters,
    onApplyFilters,
    onClearFilters,
    isLoading = false,
}: SimpleFiltersCardProps) {
    const { user, can } = useAuth()
    const canUseSimpleFilters = can(UserPermission.CAN_USE_SIMPLE_FILTERS)
    const [categoria, setCategoria] = useState(filters.categoria || "")
    const [regimenTributario, setRegimenTributario] = useState<string[]>(
        filters.regimen_tributario ? filters.regimen_tributario.split(",") : []
    )
    const [selectedResponsables, setSelectedResponsables] = useState<string[]>(
        filters.responsable ? filters.responsable.split(",") : []
    )

    const [responsables, setResponsables] = useState<IResponsable[]>([])
    const [loadingOptions, setLoadingOptions] = useState(true)

    // Sincronizar estado local cuando cambian los filtros externos
    useEffect(() => {
        setCategoria(filters.categoria || "")
        setRegimenTributario(filters.regimen_tributario ? filters.regimen_tributario.split(",").filter(Boolean) : [])
        setSelectedResponsables(filters.responsable ? filters.responsable.split(",").filter(Boolean) : [])
    }, [filters])

    if (!canUseSimpleFilters) return null;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoadingOptions(true)
                const respData = await responsableService.getAll()
                setResponsables(respData)
            } catch (error) {
                console.error("SimpleFiltersCard - Error fetching filter options:", error)
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
        onApplyFilters(newFilters)
    }, [categoria, regimenTributario, selectedResponsables, onApplyFilters])

    const handleClear = useCallback(() => {
        setCategoria("")
        setRegimenTributario([])
        setSelectedResponsables([])
        onClearFilters()
    }, [onClearFilters])

    const activeFilterCount = [
        categoria,
        regimenTributario.length > 0 ? "yes" : "",
        selectedResponsables.length > 0 ? "yes" : "",
    ].filter(Boolean).length

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-2xl mb-6">
            {/* Header — un poco más alto, texto más legible */}
            <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Filter className="h-4 w-4" />
                        <CardTitle className="text-xs font-semibold uppercase tracking-wider">
                            Filtros Rápidos
                        </CardTitle>
                    </div>
                    {activeFilterCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="h-5 text-[10px] px-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                            {activeFilterCount} activos
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-5">
                {loadingOptions ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2">

                        {/* Categoria */}
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex flex-col justify-center ml-8 gap-2">
                                <Label className="text-sm font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                    <Tag className="h-3 w-3 text-blue-500" />
                                    Categoría
                                </Label>
                                <Select
                                    value={categoria || "none"}
                                    onValueChange={(val) => setCategoria(val === "none" ? "" : val)}
                                >
                                    <SelectTrigger className="h-9 text-m bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-400 transition-colors font-medium">
                                        <SelectValue placeholder="Todas las categorías" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Todas las categorías</SelectItem>
                                        {CATEGORIAS.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Regimen Tributario */}
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col justify-center ml-1 gap-2">
                                <Label className="text-sm font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                    <Briefcase className="h-3 w-3 text-indigo-500" />
                                    Régimen Tributario
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {REGIMENES_TRIBUTARIOS.map((reg) => {
                                        const isChecked = regimenTributario.includes(reg.value)
                                        return (
                                            <div
                                                key={reg.value}
                                                onClick={() =>
                                                    setRegimenTributario((prev) =>
                                                        prev.includes(reg.value)
                                                            ? prev.filter((v) => v !== reg.value)
                                                            : [...prev, reg.value]
                                                    )
                                                }
                                                className={`
                                                flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs cursor-pointer transition-colors
                                                ${isChecked
                                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300"
                                                        : "bg-white border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                                    }
                                            `}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    className="h-4 w-4 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 pointer-events-none shrink-0"
                                                />
                                                <span className="font-medium truncate leading-tight" title={reg.label}>
                                                    {reg.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                )}

                {/* Responsables */}
                <div className="flex mr-4">
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex flex-col justify-center ml-1 gap-2">
                            <Label className="text-sm font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wide">
                                <Users className="h-3 w-3 text-orange-500" />
                                Responsables
                            </Label>
                            <div className="flex flex-wrap gap-2 max-h-[90px] overflow-y-auto pr-1 custom-scrollbar">
                                {responsables.map((resp) => {
                                    const isSelected = selectedResponsables.includes(String(resp.id))
                                    return (
                                        <Badge
                                            key={resp.id}
                                            variant={isSelected ? "default" : "outline"}
                                            className={`
                                                cursor-pointer px-2.5 py-1 transition-all font-medium text-sm rounded-md
                                                ${isSelected
                                                    ? "bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900"
                                                    : "hover:border-slate-300 text-slate-600 dark:text-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
                                                }
                                            `}
                                            onClick={() => toggleResponsable(String(resp.id))}
                                        >
                                            <div
                                                className={`h-1.5 w-1.5 rounded-full mr-1.5 shrink-0 ${isSelected ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-700"}`}
                                            />
                                            {resp.nombre}
                                            {isSelected && <X className="h-3 w-3 ml-1.5" />}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>

            {/* Footer — botones más grandes y legibles */}
            <CardFooter className="bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/60 px-5 py-3 flex justify-between items-center">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={activeFilterCount === 0 || isLoading}
                    className="h-8 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold px-3"
                >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Limpiar
                </Button>
                <Button
                    size="sm"
                    onClick={handleApply}
                    disabled={isLoading || loadingOptions}
                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-5 shadow-sm shadow-blue-500/20 transition-all text-xs"
                >
                    {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                        <Search className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Aplicar filtros
                </Button>
            </CardFooter>
        </Card>
    )
}