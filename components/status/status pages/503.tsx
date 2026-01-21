import StatusPage from '@/components/status/StatusPage'

export default function Status503() {
  return (
    <StatusPage
      code={503}
      title="Service Unavailable"
      description="Servicio No Disponible"
      backgroundColor="from-red-50 to-rose-50"
      accentColor="text-red-600"
    />
  )
}
