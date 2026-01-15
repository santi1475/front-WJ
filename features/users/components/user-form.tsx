"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRoles } from "@/hooks/use-roles"
import type { IUserManaged } from "@/features/shared/types/user"

const userFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    is_active: z.boolean(),
    groups: z.array(z.number()),
})

// Inferir el tipo directamente del schema de Zod
type UserFormData = z.infer<typeof userFormSchema>

interface UserFormProps {
    user?: IUserManaged
    onSubmit: (data: UserFormData) => Promise<void>
    isLoading?: boolean
}

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
    const { roles, isLoading: isLoadingRoles } = useRoles()

    // Schema dinámico: password requerido al crear, opcional al editar
    const formSchema = user 
        ? userFormSchema
        : userFormSchema.extend({
            password: z.string().min(6, "Password must be at least 6 characters")
        })

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: user
            ? {
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                is_active: user.is_active,
                groups: user.groups || [],
            }
            : {
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                is_active: true,
                groups: [],
            },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    placeholder="Enter username"
                    disabled={isLoading || !!user}
                    aria-invalid={!!errors.username}
                    {...register("username")}
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        placeholder="First name"
                        disabled={isLoading}
                        aria-invalid={!!errors.first_name}
                        {...register("first_name")}
                    />
                    {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        placeholder="Last name"
                        disabled={isLoading}
                        aria-invalid={!!errors.last_name}
                        {...register("last_name")}
                    />
                    {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
                </div>
            </div>

            {!user && (
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                        {...register("password")}
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Controller
                    name="groups"
                    control={control}
                    render={({ field }) => (
                        <Select
                            disabled={isLoading || isLoadingRoles}
                            value={field.value[0]?.toString() || ""}
                            onValueChange={(value) => field.onChange(value ? [parseInt(value)] : [])}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.id.toString()}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.groups && <p className="text-sm text-destructive">{errors.groups.message}</p>}
            </div>

            <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="is_active"
                            checked={field.value}
                            disabled={isLoading}
                            onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="is_active" className="cursor-pointer">
                            Active
                        </Label>
                    </div>
                )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : user ? "Update User" : "Create User"}
            </Button>
        </form>
    )
}