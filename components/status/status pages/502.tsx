import StatusPage from '@/components/status/StatusPage'

export default function Status502() {
  return (
    <StatusPage
      code={502}
      title="Bad Gateway"
      description="Puerta de Enlace Inválida"
      backgroundColor="from-red-50 to-rose-50"
      accentColor="text-red-600"
    />
  )
}
