/**
 * CreateOwnerForm Component
 * Form to create a new owner (PROPIETARIO) with validation
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
} from '@shared/components'
import { ownerService } from '../services/ownerService'
import type { CreateOwnerData } from '../models'

/**
 * Validation schema with Zod
 */
const createOwnerSchema = z.object({
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
    }, 'El propietario debe ser mayor de 18 años'),
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

type CreateOwnerFormData = z.infer<typeof createOwnerSchema>

export const CreateOwner = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOwnerFormData>({
    resolver: zodResolver(createOwnerSchema),
  })

  const onSubmit = async (data: CreateOwnerFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const ownerData: CreateOwnerData = {
        name: data.name,
        surname: data.surname,
        documentNumber: data.documentNumber,
        phone: data.phone,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
      }

      await ownerService.createOwner(ownerData)

      setSuccessMessage('¡Propietario creado exitosamente!')
      reset()

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard')
      }, 2000)
    } catch (error: unknown) {
      const rawMessage =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === 'string'
          ? (error as { response?: { data?: { message?: string } } }).response!
              .data!.message
          : error instanceof Error
            ? error.message
            : undefined
      const message =
        rawMessage ?? 'Error al crear propietario. Intenta nuevamente.'
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
          <h1 className="text-3xl font-bold mb-2 uppercase">
            CREAR PROPIETARIO
          </h1>
          <p className="text-gray-400 mb-8">
            Registra un nuevo propietario de restaurante
          </p>

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
              placeholder="propietario@example.com"
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
                  'CREAR PROPIETARIO'
                )}
              </BrutalistButton>

              <BrutalistButton
                type="button"
                variant="neutral"
                size="lg"
                onClick={() => navigate('/admin/dashboard')}
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
