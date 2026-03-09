import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface ExcelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onExportAll?: () => void
    onExportSearch?: () => void
    onClickManual?: () => void
    className?: string
    isSelectionMode?: boolean
    isExportingAll?: boolean
    searchTerm?: string
}

export function ExcelButton({
    onExportAll,
    onExportSearch,
    onClickManual,
    className,
    isSelectionMode,
    isExportingAll,
    searchTerm,
    ...props
}: ExcelButtonProps) {
    if (isSelectionMode) return null;

    const handleExportSearch = () => {
        if (!searchTerm) {
            toast.info("Debes ingresar un término de búsqueda para exportar resultados específicos.", { position: "bottom-right" })
            return;
        }
        if (onExportSearch) onExportSearch();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "hover:bg-slate-800 px-3",
                        className
                    )}
                    disabled={isExportingAll}
                    {...props}
                >
                    {isExportingAll ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="hidden sm:inline">Generando...</span>
                        </>
                    ) : (
                        <>
                            <Image
                                src="/excel2-svgrepo-com.svg"
                                alt="Excel"
                                width={24}
                                height={24}
                                className="w-5 h-5 sm:mr-2"
                            />
                            <span className="hidden sm:inline">Exportar</span>
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportAll} className="cursor-pointer">
                    Descargar toda la base de clientes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportSearch} className="cursor-pointer font-medium text-blue-400 hover:text-white focus:text-white data-[highlighted]:text-white">
                    Descargar solo los resultados de búsqueda {searchTerm ? `("${searchTerm}")` : ""}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onClickManual} className="cursor-pointer">
                    Seleccionar Manualmente en esta página
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
