/**
 * Authentication Store (Zustand)
 * Global state management for authentication
 */

import { create } from 'zustand'
import { UserRole } from '@shared/types'
import {
  getToken,
  setToken as saveToken,
  removeToken,
  getUserRole,
  getUserId,
  isTokenValid,
} from './tokenManager'

/**
 * Authentication State Interface
 */
interface AuthState {
  // State
  isAuthenticated: boolean
  role: UserRole | null
  userId: string | null
  isLoading: boolean

  // Actions
  login: (token: string) => void
  logout: () => void
  checkAuth: () => void
  setLoading: (loading: boolean) => void
}

/**
 * Create auth store
 */
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isAuthenticated: false,
  role: null,
  userId: null,
  isLoading: true,

  /**
   * Login action
   * Saves token and updates authentication state
   */
  login: (token: string) => {
    saveToken(token)
    const role = getUserRole()
    const userId = getUserId()

    set({
      isAuthenticated: true,
      role,
      userId,
      isLoading: false,
    })
  },

  /**
   * Logout action
   * Removes token and clears authentication state
   */
  logout: () => {
    removeToken()

    set({
      isAuthenticated: false,
      role: null,
      userId: null,
      isLoading: false,
    })
  },

  /**
   * Check authentication status
   * Called on app initialization to restore auth state from localStorage
   */
  checkAuth: () => {
    set({ isLoading: true })

    const token = getToken()

    if (token && isTokenValid()) {
      const role = getUserRole()
      const userId = getUserId()

      set({
        isAuthenticated: true,
        role,
        userId,
        isLoading: false,
      })
    } else {
      // Token doesn't exist or is expired
      if (token) {
        // Remove expired token
        removeToken()
      }

      set({
        isAuthenticated: false,
        role: null,
        userId: null,
        isLoading: false,
      })
    }
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
}))

/**
 * Hook to get authentication status
 */
export const useAuth = () => {
  const { isAuthenticated, role, userId, isLoading } = useAuthStore()
  return { isAuthenticated, role, userId, isLoading }
}

/**
 * Hook to get auth actions
 */
export const useAuthActions = () => {
  const { login, logout, checkAuth } = useAuthStore()
  return { login, logout, checkAuth }
}
