"use client"

import type React from "react"

import { Suspense } from "react"

export default function NotFoundLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <Suspense fallback={<div className="min-h-screen" />}>{children}</Suspense>
}
