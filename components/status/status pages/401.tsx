import StatusPage from '@/components/status/StatusPage'

export default function Status401() {
  return (
    <StatusPage
      code={401}
      title="Unauthorized"
      description="No Autenticado"
      backgroundColor="from-yellow-50 to-amber-50"
      accentColor="text-yellow-600"
    />
  )
}
