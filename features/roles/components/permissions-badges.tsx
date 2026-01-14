"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface PermissionsBadgesProps {
    permissions: any[]
}

export function PermissionsBadges({ permissions }: PermissionsBadgesProps) {
    const displayLimit = 3
    const visiblePermissions = permissions.slice(0, displayLimit)
    const hiddenCount = Math.max(0, permissions.length - displayLimit)

    if (permissions.length === 0) {
        return (
            <Badge variant="outline" className="text-muted-foreground">
                Sin permisos
            </Badge>
        )
    }

    return (
        <TooltipProvider>
            <div className="flex flex-wrap gap-2">
                {visiblePermissions.map((perm) => (
                    <Badge key={perm.id} variant="secondary" className="text-xs">
                        {perm.name}
                    </Badge>
                ))}
                {hiddenCount > 0 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs cursor-help">
                                +{hiddenCount} más
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="space-y-1">
                                {permissions.slice(displayLimit).map((perm) => (
                                    <div key={perm.id} className="text-xs">
                                        {perm.name}
                                    </div>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    )
}
