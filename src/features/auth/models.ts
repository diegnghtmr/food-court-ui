/**
 * Auth Models and Validation Schemas
 * Interfaces and Zod schemas for authentication
 */

import { z } from 'zod'
import { UserRole } from '@shared/types'

/**
 * Login Credentials Interface
 */
export interface LoginCredentials {
  correo: string
  clave: string
}

/**
 * Register Data Interface
 */
export interface RegisterData {
  nombre: string
  apellido: string
  documento: string
  celular: string
  correo: string
  clave: string
}

/**
 * Auth Response from API
 */
export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    role: UserRole
  }
}

/**
 * Login Validation Schema (Zod)
 */
export const loginSchema = z.object({
  correo: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Debe ser un correo válido'),
  clave: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

/**
 * Register Validation Schema (Zod)
 */
export const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  apellido: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),
  documento: z
    .string()
    .min(6, 'El documento debe tener al menos 6 caracteres')
    .max(20, 'El documento no puede exceder 20 caracteres')
    .regex(/^\d+$/, 'El documento solo puede contener números'),
  celular: z
    .string()
    .min(1, 'El celular es requerido')
    .regex(
      /^\+?57?\d{10}$/,
      'El celular debe tener el formato +573001234567 o 3001234567'
    ),
  correo: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Debe ser un correo válido'),
  clave: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
})

/**
 * Type inference from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
