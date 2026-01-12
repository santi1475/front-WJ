"use client"
// import Link from "next/link"
// import { TrendingUp, FileText, PieChart, Users, Settings } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const router = useRouter()  

  useEffect(() => {
    router.push("/login")
  }, [router])

}
