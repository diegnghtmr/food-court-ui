/**
 * CreateRestaurantForm Component
 * Form to create a new restaurant with validation
 *
 * Validates:
 * - All required fields
 * - Phone format
 * - NIT format
 * - URL format
 * - Owner ID must be numeric
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
import { restaurantService } from '../services/restaurantService'
import type { CreateRestaurantData } from '../models'

/**
 * Validation schema with Zod
 */
const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  nit: z
    .string()
    .min(9, 'El NIT debe tener al menos 9 caracteres')
    .max(15, 'El NIT no puede exceder 15 caracteres')
    .regex(/^[0-9-]+$/, 'El NIT solo debe contener números y guiones'),
  address: z
    .string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(13, 'El teléfono no puede exceder 13 dígitos')
    .regex(
      /^\+?[0-9]+$/,
      'El teléfono solo debe contener números y puede empezar con +'
    ),
  urlLogo: z
    .string()
    .min(1, 'La URL del logo es requerida')
    .url('Debe ser una URL válida'),
  ownerId: z
    .string()
    .min(1, 'El ID del propietario es requerido')
    .regex(/^[0-9]+$/, 'El ID debe ser un número válido'),
})

type CreateRestaurantFormData = z.infer<typeof createRestaurantSchema>

export const CreateRestaurant = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRestaurantFormData>({
    resolver: zodResolver(createRestaurantSchema),
  })

  const onSubmit = async (data: CreateRestaurantFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const restaurantData: CreateRestaurantData = {
        name: data.name,
        nit: data.nit,
        address: data.address,
        phone: data.phone,
        urlLogo: data.urlLogo,
        ownerId: data.ownerId,
      }

      await restaurantService.createRestaurant(restaurantData)

      setSuccessMessage('¡Restaurante creado exitosamente!')
      reset()

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/admin/dashboard')
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
            : 'Error al crear restaurante. Intenta nuevamente.'
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
            CREAR RESTAURANTE
          </h1>
          <p className="text-gray-400 mb-8">
            Registra un nuevo restaurante en la plazoleta
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
            {/* Restaurant Name */}
            <BrutalistInput
              type="text"
              label="Nombre del Restaurante"
              {...register('name')}
              error={errors.name?.message}
              required
              placeholder="La Fogata Grill"
              disabled={isLoading}
            />

            {/* NIT */}
            <BrutalistInput
              type="text"
              label="NIT"
              {...register('nit')}
              error={errors.nit?.message}
              required
              placeholder="900123456-7"
              disabled={isLoading}
            />

            {/* Address */}
            <BrutalistInput
              type="text"
              label="Dirección"
              {...register('address')}
              error={errors.address?.message}
              required
              placeholder="Calle 123 #45-67, Barrio Centro"
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

            {/* Logo URL */}
            <BrutalistInput
              type="url"
              label="URL del Logo"
              {...register('urlLogo')}
              error={errors.urlLogo?.message}
              required
              placeholder="https://example.com/logo.png"
              disabled={isLoading}
            />

            {/* Owner ID */}
            <div>
              <BrutalistInput
                type="text"
                label="ID del Propietario"
                {...register('ownerId')}
                error={errors.ownerId?.message}
                required
                placeholder="123"
                disabled={isLoading}
              />
              <div className="mt-2">
                <InfoAlert message="Ingresa el ID numérico del propietario. Puedes obtenerlo desde la lista de propietarios registrados." />
              </div>
            </div>

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
                  'CREAR RESTAURANTE'
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
