import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ExcelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void
    className?: string
    isSelectionMode?: boolean
}

export function ExcelButton({ onClick, className, isSelectionMode, ...props }: ExcelButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            className={cn(
                "hover:bg-slate-800",
                isSelectionMode && "bg-slate-800 ring-2 ring-green-500",
                className
            )}
            title="Exportar a Excel"
            {...props}
        >
            <Image
                src="/excel2-svgrepo-com.svg"
                alt="Excel"
                width={24}
                height={24}
                className="w-6 h-6"
            />
        </Button>
    )
}
