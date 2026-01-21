'use client'

import Link from 'next/link'

interface StatusPageProps {
  code: number
  title: string
  description: string
  backgroundColor: string
  accentColor: string
}

export default function StatusPage({
  code,
  title,
  description,
  backgroundColor,
  accentColor,
}: StatusPageProps) {
  const getStatusColor = (statusCode: number) => {
    if (statusCode < 300) return 'bg-green-600'
    if (statusCode < 400) return 'bg-blue-600'
    if (statusCode < 500) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${backgroundColor} flex flex-col items-center justify-center p-4`}>
      <Link href="/" className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors">
        ← Inicio
      </Link>

      <div className="w-full max-w-md flex flex-col items-center justify-center gap-8">
        {/* Status Code Circle */}
        <div className={`${getStatusColor(code)} rounded-full w-48 h-48 flex items-center justify-center shadow-2xl`}>
          <div className="text-center">
            <div className="text-7xl font-bold text-white">{code}</div>
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 w-full text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Action Button */}
        <Link
          href="/"
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white text-center transition-all hover:shadow-lg ${getStatusColor(code)}`}
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  )
}
