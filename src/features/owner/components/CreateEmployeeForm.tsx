/**
 * CreateEmployeeForm Component
 * Form to create a new employee (EMPLEADO) with validation
 *
 * Validates:
 * - Age >= 18 years
 * - All required fields
 * - Email format
 * - Password strength
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import {
  BrutalistCard,
  BrutalistInput,
  BrutalistButton,
  SuccessAlert,
  ErrorAlert,
  LoadingSpinner,
  InfoAlert,
} from '@shared/components'
import { employeeService } from '../services/employeeService'
import type { CreateEmployeeData } from '../models'
import { getRestaurantId } from '@infrastructure/auth/tokenManager'

/**
 * Validation schema with Zod
 */
const createEmployeeSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  surname: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  documentNumber: z
    .string()
    .min(6, 'El documento debe tener al menos 6 caracteres')
    .max(20, 'El documento no puede exceder 20 caracteres')
    .regex(/^[0-9]+$/, 'El documento solo debe contener números'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(13, 'El teléfono no puede exceder 13 dígitos')
    .regex(
      /^\+?[0-9]+$/,
      'El teléfono solo debe contener números y puede empezar con +'
    ),
  birthDate: z
    .string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const dayDiff = today.getDate() - birthDate.getDate()

      // Ajustar si aún no ha cumplido años este año
      const adjustedAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age

      return adjustedAge >= 18
    }, 'El empleado debe ser mayor de 18 años'),
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Debe ser un correo válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
})

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>

export const CreateEmployee = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
  })

  const onSubmit = async (data: CreateEmployeeFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const restaurantId = getRestaurantId()?.toString() || null
      if (!restaurantId) {
        throw new Error('No se pudo determinar el restaurante del propietario.')
      }

      const employeeData: CreateEmployeeData = {
        name: data.name,
        surname: data.surname,
        documentNumber: data.documentNumber,
        phone: data.phone,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
        restaurantId,
      }

      await employeeService.createEmployee(employeeData)

      setSuccessMessage('¡Empleado creado exitosamente!')
      reset()

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/owner/dashboard')
      }, 2000)
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response!
              .data!.message
          : error instanceof Error
            ? error.message
            : 'Error al crear empleado. Intenta nuevamente.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <BrutalistCard>
        <div className="p-8">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-2 uppercase">CREAR EMPLEADO</h1>
          <p className="text-gray-400 mb-4">
            Registra un nuevo empleado para tu restaurante
          </p>

          {/* Info Alert */}
          <div className="mb-6">
            <InfoAlert message="El empleado podrá gestionar pedidos en el tablero Kanban una vez creada su cuenta." />
          </div>

          {/* Alerts */}
          {successMessage && (
            <div className="mb-6">
              <SuccessAlert
                message={successMessage}
                onClose={() => setSuccessMessage('')}
              />
            </div>
          )}

          {errorMessage && (
            <div className="mb-6">
              <ErrorAlert
                message={errorMessage}
                onClose={() => setErrorMessage('')}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <BrutalistInput
              type="text"
              label="Nombre"
              {...register('name')}
              error={errors.name?.message}
              required
              placeholder="Juan"
              disabled={isLoading}
            />

            {/* Surname */}
            <BrutalistInput
              type="text"
              label="Apellido"
              {...register('surname')}
              error={errors.surname?.message}
              required
              placeholder="Pérez"
              disabled={isLoading}
            />

            {/* Document Number */}
            <BrutalistInput
              type="text"
              label="Número de Documento"
              {...register('documentNumber')}
              error={errors.documentNumber?.message}
              required
              placeholder="12345678"
              disabled={isLoading}
            />

            {/* Phone */}
            <BrutalistInput
              type="tel"
              label="Teléfono"
              {...register('phone')}
              error={errors.phone?.message}
              required
              placeholder="+573001234567"
              disabled={isLoading}
            />

            {/* Birth Date */}
            <BrutalistInput
              type="date"
              label="Fecha de Nacimiento"
              {...register('birthDate')}
              error={errors.birthDate?.message}
              required
              disabled={isLoading}
            />

            {/* Email */}
            <BrutalistInput
              type="email"
              label="Correo Electrónico"
              {...register('email')}
              error={errors.email?.message}
              required
              placeholder="empleado@example.com"
              disabled={isLoading}
            />

            {/* Password */}
            <BrutalistInput
              type="password"
              label="Contraseña"
              {...register('password')}
              error={errors.password?.message}
              required
              placeholder="********"
              disabled={isLoading}
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <BrutalistButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    <span>CREANDO...</span>
                  </div>
                ) : (
                  'CREAR EMPLEADO'
                )}
              </BrutalistButton>

              <BrutalistButton
                type="button"
                variant="neutral"
                size="lg"
                onClick={() => navigate('/owner/dashboard')}
                disabled={isLoading}
              >
                CANCELAR
              </BrutalistButton>
            </div>
          </form>
        </div>
      </BrutalistCard>
    </div>
  )
}
