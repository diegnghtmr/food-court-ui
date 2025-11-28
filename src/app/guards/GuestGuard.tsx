/**
 * GuestGuard
 * Protects routes that should only be accessible to non-authenticated users
 * Redirects to role-based dashboard if user is already authenticated
 */

import { ReactNode, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import {
  useAuth,
  useAuthActions,
  getCurrentUserHomePath,
} from '@infrastructure/auth'
import { LoadingSpinner } from '@shared/components'

interface GuestGuardProps {
  children: ReactNode
}

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const { checkAuth } = useAuthActions()

  useEffect(() => {
    // Check authentication status on mount
    checkAuth()
  }, [checkAuth])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If authenticated, redirect to role-based home
  if (isAuthenticated) {
    const homePath = getCurrentUserHomePath()
    return <Navigate to={homePath || '/login'} replace />
  }

  // User is not authenticated, render guest-only content (login/register)
  return <>{children}</>
}
