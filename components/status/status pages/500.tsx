import StatusPage from '@/components/status/StatusPage'

export default function Status500() {
  return (
    <StatusPage
      code={500}
      title="Internal Server Error"
      description="Error Interno del Servidor"
      backgroundColor="from-red-50 to-rose-50"
      accentColor="text-red-600"
    />
  )
}
