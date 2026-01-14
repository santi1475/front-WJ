"use client"

import { useState, useEffect } from "react"
import { mockPermissions } from "@/lib/mock-data"

export function usePermissions() {
  const [permissions, setPermissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setPermissions(mockPermissions)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return { permissions, isLoading }
}
