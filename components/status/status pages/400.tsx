import StatusPage from '@/components/status/StatusPage'

export default function Status400() {
  return (
    <StatusPage
      code={400}
      title="Bad Request"
      description="Solicitud Inválida"
      backgroundColor="from-yellow-50 to-amber-50"
      accentColor="text-yellow-600"
    />
  )
}
