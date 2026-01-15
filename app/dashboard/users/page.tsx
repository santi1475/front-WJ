import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/features/users/components/users-table"
export const metadata = {
    title: "Gestion de Usuarios",
    description: "Manage application users",
}

export default function UsersPage() {
    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Gestion de Usuarios</h2>
                </div>
            </div>
            <div className="mx-auto max-w-6xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>⚠️ Solo para administradores</CardTitle>
                        <CardDescription>Crear, actualizar y gestionar usuarios en su sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UsersTable />
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
