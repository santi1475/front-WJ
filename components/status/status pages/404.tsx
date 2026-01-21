import StatusPage from '@/components/status/StatusPage'

export default function Status404() {
  return (
    <StatusPage
      code={404}
      title="Not Found"
      description="Recurso No Encontrado"
      backgroundColor="from-yellow-50 to-amber-50"
      accentColor="text-yellow-600"
    />
  )
}
