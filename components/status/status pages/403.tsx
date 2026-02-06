import StatusPage from '@/components/status/StatusPage'

export default function Status403() {
    return (
        <StatusPage
            code={403}
            title="Acceso Restringido"
            description="No tienes permisos para acceder a este recurso."
            backgroundColor="from-red-50 to-orange-50"
            accentColor="text-red-600"
        />
    )
}
