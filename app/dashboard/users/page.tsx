import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/features/users/components/users-table"
import { ResponsableTable } from "@/features/responsables/components/responsable-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                        <TabsTrigger value="users">Usuarios del Sistema</TabsTrigger>
                        <TabsTrigger value="responsables">Responsables</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>⚠️ Solo para administradores</CardTitle>
                                <CardDescription>Crear, actualizar y gestionar usuarios en su sistema</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UsersTable />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="responsables">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestión de Responsables</CardTitle>
                                <CardDescription>Administrar el personal asignado a las cuentas de clientes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsableTable />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
