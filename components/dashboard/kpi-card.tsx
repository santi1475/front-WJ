import { Card, CardContent } from "@/components/ui/card"

interface KPICardProps {
    title: string
    value: string | number
    description: string
    color: "blue" | "green" | "amber"
}

const colorStyles = {
    blue: "bg-card border border-border border-l-4 border-l-blue-500 shadow-md shadow-black/[0.03] dark:bg-blue-900/10 dark:border-blue-800/50 dark:shadow-sm",
    green: "bg-card border border-border border-l-4 border-l-green-500 shadow-md shadow-black/[0.03] dark:bg-green-900/10 dark:border-green-800/50 dark:shadow-sm",
    amber: "bg-card border border-border border-l-4 border-l-amber-500 shadow-md shadow-black/[0.03] dark:bg-amber-900/10 dark:border-amber-800/50 dark:shadow-sm",
}

export function KPICard({ title, value, description, color }: KPICardProps) {
    return (
        <Card className={`border ${colorStyles[color]}`}>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
