'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function SessionExpiredPage() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('es-ES'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 to-rose-50 flex flex-col items-center justify-center p-4">

      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center space-y-8">
        <div className="space-y-4">
          <div className="text-7xl font-bold text-red-600">401</div>
          <h1 className="text-5xl font-bold text-gray-900">Sesión Expirada</h1>
          <p className="text-xl text-gray-600">Tu Sesión Ha Terminado</p>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 text-left">Detalles de la Sesión</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-gray-300">
              <span className="text-gray-600 font-medium">Tipo de Error:</span>
              <span className="font-mono text-gray-700">Session Timeout</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Hora Actual:</span>
              <span className="font-mono text-gray-700 font-bold">{time || '--:--:--'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-center"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
