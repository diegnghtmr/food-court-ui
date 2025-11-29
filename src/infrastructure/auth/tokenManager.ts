/**
 * Token Manager
 * Utilities for managing JWT tokens in localStorage
 */

import { jwtDecode } from 'jwt-decode'
import { UserRole } from '@shared/types'

const TOKEN_KEY = 'jwt_token'

/**
 * JWT Payload interface (matches backend token structure)
 */
interface JwtPayload {
  sub: string // Subject (email in this backend)
  id: number // User ID
  roles: string[] // User roles array
  exp: number // Expiration timestamp
  iat?: number // Issued at timestamp
  restaurantId?: number // Restaurant ID (for owners/employees)
}

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.error('Error accessing localStorage:', error)
    return null
  }
}

/**
 * Save token to localStorage
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error('Error saving token to localStorage:', error)
  }
}

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error('Error removing token from localStorage:', error)
  }
}

/**
 * Decode JWT token and extract payload
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Map backend role string to UserRole enum
 * Backend uses ROLE_ prefix (e.g., ROLE_CLIENT, ROLE_OWNER)
 */
const mapRoleToEnum = (role: string): UserRole | null => {
  // Remove ROLE_ prefix if present
  const normalizedRole = role.toUpperCase().replace('ROLE_', '')

  const roleMap: Record<string, UserRole> = {
    ADMIN: UserRole.ADMINISTRADOR,
    ADMINISTRADOR: UserRole.ADMINISTRADOR,
    OWNER: UserRole.PROPIETARIO,
    PROPIETARIO: UserRole.PROPIETARIO,
    EMPLOYEE: UserRole.EMPLEADO,
    EMPLEADO: UserRole.EMPLEADO,
    CLIENT: UserRole.CLIENTE,
    CLIENTE: UserRole.CLIENTE,
  }
  return roleMap[normalizedRole] || null
}

/**
 * Get user role from token
 */
export const getUserRole = (): UserRole | null => {
  const token = getToken()
  if (!token) return null

  const payload = decodeToken(token)
  if (!payload?.roles || payload.roles.length === 0) return null

  // Get the first role from the array and map it to UserRole enum
  return mapRoleToEnum(payload.roles[0])
}

/**
 * Get user ID from token
 */
export const getUserId = (): string | null => {
  const token = getToken()
  if (!token) return null

  const payload = decodeToken(token)
  return payload?.id?.toString() || null
}

/**
 * Get restaurant ID from token (for owners/employees)
 */
export const getRestaurantId = (): number | null => {
  const token = getToken()
  if (!token) return null

  const payload = decodeToken(token)
  return payload?.restaurantId ?? null
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeToken(token)
    if (!payload || !payload.exp) return true

    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

/**
 * Check if current token is valid (exists and not expired)
 */
export const isTokenValid = (): boolean => {
  const token = getToken()
  if (!token) return false

  return !isTokenExpired(token)
}

/**
 * Get role-based home path for redirection after login
 */
export const getRoleHomePath = (role: UserRole): string => {
  const paths: Record<UserRole, string> = {
    [UserRole.ADMINISTRADOR]: '/admin/dashboard',
    [UserRole.PROPIETARIO]: '/owner/dashboard',
    [UserRole.EMPLEADO]: '/employee/orders',
    [UserRole.CLIENTE]: '/client/restaurants',
  }

  return paths[role] || '/login'
}

/**
 * Get current user's home path
 */
export const getCurrentUserHomePath = (): string | null => {
  const role = getUserRole()
  return role ? getRoleHomePath(role) : null
}
