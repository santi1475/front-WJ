import { Button } from "@/components/ui/button"
import { Plus, Bell } from "lucide-react"

interface DashboardHeaderProps {
    title: string
    description?: string
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
    return (
        <div className="bg-card border-b border-border">
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-card-foreground">{title}</h1>
                    <p className="text-muted-foreground text-sm mt-1">Welcome back! Heres your overview.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client
                    </Button>
                </div>
            </div>
        </div>
    )
}
