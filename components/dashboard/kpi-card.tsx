import { Card, CardContent } from "@/components/ui/card"

interface KPICardProps {
    title: string
    value: string | number
    description: string
    color: "blue" | "green" | "amber"
}

const colorStyles = {
    blue: "border-blue-800/50 bg-blue-900/10 text-blue-400",
    green: "border-green-800/50 bg-green-900/10 text-green-400",
    amber: "border-amber-800/50 bg-amber-900/10 text-amber-400",
}

export function KPICard({ title, value, description, color }: KPICardProps) {
    return (
        <Card className={`border ${colorStyles[color]}`}>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
