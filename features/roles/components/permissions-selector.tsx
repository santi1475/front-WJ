"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { IPermission } from "@/features/shared/types"

interface PermissionsSelectorProps {
    permissions: IPermission[]
    selectedPermissions: number[]
    onChange: (permissions: number[]) => void
}

export function PermissionsSelector({ permissions, selectedPermissions, onChange }: PermissionsSelectorProps) {
    
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const parts = permission.codename.split('_');
        const moduleName = parts.length > 1 ? parts.slice(1).join(' ') : 'General';
        const formattedModule = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        if (!acc[formattedModule]) {
            acc[formattedModule] = [];
        }
        acc[formattedModule].push(permission);
        return acc;
    }, {} as Record<string, IPermission[]>);

    const handleToggle = (permissionId: number) => {
        if (selectedPermissions.includes(permissionId)) {
            onChange(selectedPermissions.filter((id) => id !== permissionId))
        } else {
            onChange([...selectedPermissions, permissionId])
        }
    }

    const handleGroupToggle = (groupPermissions: IPermission[]) => {
        const groupIds = groupPermissions.map((p) => p.id)
        const allSelected = groupIds.every((id) => selectedPermissions.includes(id))

        if (allSelected) {
            onChange(selectedPermissions.filter((id) => !groupIds.includes(id)))
        } else {
            const newSelected = [...new Set([...selectedPermissions, ...groupIds])]
            onChange(newSelected)
        }
    }

    return (
        <div className="border rounded-md">
            <Accordion type="multiple" className="w-full">
                {Object.entries(groupedPermissions).map(([moduleName, modulePermissions]) => {
                    const allSelected = modulePermissions.every((p) => selectedPermissions.includes(p.id))
                    const someSelected = modulePermissions.some((p) => selectedPermissions.includes(p.id))

                    return (
                        <AccordionItem value={moduleName} key={moduleName} className="border-b last:border-0">
                            <div className="flex items-center px-4 py-2 hover:bg-muted/50">
                                <Checkbox
                                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                                    onCheckedChange={() => handleGroupToggle(modulePermissions)}
                                    className="mr-2"
                                />
                                <AccordionTrigger className="hover:no-underline py-0 flex-1">
                                    <span className="text-sm font-medium">{moduleName}</span>
                                    <span className="ml-2 text-xs text-muted-foreground font-normal">
                                        ({modulePermissions.length} permisos)
                                    </span>
                                </AccordionTrigger>
                            </div>
                            <AccordionContent className="px-4 pb-4 pt-1">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                                    {modulePermissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`perm-${permission.id}`}
                                                checked={selectedPermissions.includes(permission.id)}
                                                onCheckedChange={() => handleToggle(permission.id)}
                                            />
                                            <Label 
                                                htmlFor={`perm-${permission.id}`} 
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {permission.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}