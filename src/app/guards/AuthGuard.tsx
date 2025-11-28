/**
 * AuthGuard
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated or token is expired
 */

import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, useAuthActions } from '@infrastructure/auth'
import { LoadingSpinner } from '@shared/components'

interface AuthGuardProps {
  children: ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const { checkAuth } = useAuthActions()
  const location = useLocation()

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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // User is authenticated, render protected content
  return <>{children}</>
}
