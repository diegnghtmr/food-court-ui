/**
 * RoleGuard
 * Protects routes based on user role
 * Shows AccessDenied page if user doesn't have required role
 */

import { ReactNode } from 'react'
import { useAuth } from '@infrastructure/auth'
import { UserRole } from '@shared/types'
import { AccessDenied } from '@shared/components'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { role } = useAuth()

  // If no role (shouldn't happen after AuthGuard), show access denied
  if (!role) {
    return <AccessDenied />
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(role)) {
    return <AccessDenied />
  }

  // User has required role, render protected content
  return <>{children}</>
}
