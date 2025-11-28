"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import type { UserRole } from "@/lib/types"

interface RouteGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter()
  const { isAuthenticated, hasRole, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (!hasRole(allowedRoles)) {
        router.push("/unauthorized")
      }
    }
  }, [isAuthenticated, hasRole, allowedRoles, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono">
        <div className="text-violet-500 font-bold uppercase text-xl animate-pulse">CARGANDO...</div>
      </div>
    )
  }

  if (!isAuthenticated || !hasRole(allowedRoles)) {
    return null
  }

  return <>{children}</>
}
