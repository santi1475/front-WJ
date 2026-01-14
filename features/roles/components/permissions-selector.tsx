"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Permission {
    id: number
    name: string
    description?: string
    module?: string
    content_type?: string
}

interface PermissionsSelectorProps {
    permissions: Permission[]
    selectedPermissions: number[]
    onChange: (permissions: number[]) => void
}

export function PermissionsSelector({ permissions, selectedPermissions, onChange }: PermissionsSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const groupedPermissions = useMemo(() => {
        // Filter permissions based on search
        const filtered = permissions.filter(
            (perm) =>
                perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (perm.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
        )

        // Group by module or content_type
        const groups: Record<string, Permission[]> = {}
        filtered.forEach((perm) => {
            const key = perm.module || perm.content_type || "Otros"
            if (!groups[key]) {
                groups[key] = []
            }
            groups[key].push(perm)
        })

        return Object.entries(groups).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    }, [permissions, searchQuery])

    const togglePermission = (permissionId: number) => {
        const updated = selectedPermissions.includes(permissionId)
            ? selectedPermissions.filter((id) => id !== permissionId)
            : [...selectedPermissions, permissionId]
        onChange(updated)
    }

    const toggleGroupPermissions = (groupKey: string, permissionsInGroup: Permission[]) => {
        const groupIds = permissionsInGroup.map((p) => p.id)
        const allSelected = groupIds.every((id) => selectedPermissions.includes(id))

        const updated = allSelected
            ? selectedPermissions.filter((id) => !groupIds.includes(id))
            : [...selectedPermissions, ...groupIds.filter((id) => !selectedPermissions.includes(id))]
        onChange(updated)
    }

    const isGroupFullySelected = (permissionsInGroup: Permission[]) => {
        const groupIds = permissionsInGroup.map((p) => p.id)
        return groupIds.every((id) => selectedPermissions.includes(id))
    }

    const isGroupPartiallySelected = (permissionsInGroup: Permission[]) => {
        const groupIds = permissionsInGroup.map((p) => p.id)
        const selectedCount = groupIds.filter((id) => selectedPermissions.includes(id)).length
        return selectedCount > 0 && selectedCount < groupIds.length
    }

    return (
        <div className="space-y-4 border rounded-lg p-4">
            {/* Search Input */}
            <div>
                <Input
                    placeholder="Buscar permiso..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                />
            </div>

            {/* Permissions Groups */}
            <div className="space-y-2">
                {groupedPermissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No hay permisos que coincidan con tu búsqueda</div>
                ) : (
                    <Accordion type="single" collapsible defaultValue={groupedPermissions[0]?.[0]}>
                        {groupedPermissions.map(([groupKey, groupPerms]) => (
                            <AccordionItem key={groupKey} value={groupKey} className="border-b last:border-0">
                                <div className="flex items-center gap-3 py-3">
                                    {/* Group Checkbox */}
                                    <Checkbox
                                        id={`group-${groupKey}`}
                                        checked={isGroupFullySelected(groupPerms)}
                                        indeterminate={isGroupPartiallySelected(groupPerms)}
                                        onCheckedChange={() => toggleGroupPermissions(groupKey, groupPerms)}
                                        className="h-5 w-5"
                                    />

                                    {/* Group Header */}
                                    <AccordionTrigger className="flex-1 hover:no-underline">
                                        <Label
                                            htmlFor={`group-${groupKey}`}
                                            className="text-sm font-semibold cursor-pointer flex-1 text-left"
                                        >
                                            {groupKey}
                                        </Label>
                                    </AccordionTrigger>

                                    {/* Count */}
                                    <span className="text-xs text-muted-foreground">
                                        {groupPerms.filter((p) => selectedPermissions.includes(p.id)).length}/{groupPerms.length}
                                    </span>
                                </div>

                                {/* Permissions in Group */}
                                <AccordionContent className="pb-3">
                                    <div className="ml-8 space-y-3">
                                        {groupPerms.map((permission) => (
                                            <div key={permission.id} className="flex items-start gap-3">
                                                <Checkbox
                                                    id={`perm-${permission.id}`}
                                                    checked={selectedPermissions.includes(permission.id)}
                                                    onCheckedChange={() => togglePermission(permission.id)}
                                                    className="mt-1"
                                                />
                                                <Label htmlFor={`perm-${permission.id}`} className="flex-1 cursor-pointer text-sm">
                                                    <div className="font-medium">{permission.name}</div>
                                                    {permission.description && (
                                                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>

            {/* Summary */}
            {selectedPermissions.length > 0 && (
                <div className="pt-2 border-t text-sm text-muted-foreground">
                    {selectedPermissions.length} permiso{selectedPermissions.length !== 1 ? "s" : ""} seleccionado
                    {selectedPermissions.length !== 1 ? "s" : ""}
                </div>
            )}
        </div>
    )
}
