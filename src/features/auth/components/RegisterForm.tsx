/**
 * RegisterForm Component
 * Registration form with full user data using react-hook-form + Zod validation
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import {
  BrutalistInput,
  BrutalistButton,
  ErrorAlert,
  SuccessAlert,
} from '@shared/components'
import { authService } from '../services/authService'
import { registerSchema, type RegisterFormData } from '../models'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

export const RegisterForm = ({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await authService.register(data)

      setSuccessMessage('Registro exitoso. Redirigiendo al inicio de sesión...')
      reset()

      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      const message =
        axiosError.response?.data?.message ||
        'Error al registrar usuario. Intenta nuevamente.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Crear Cuenta</h2>

      {errorMessage && (
        <div className="mb-4">
          <ErrorAlert message={errorMessage} />
        </div>
      )}

      {successMessage && (
        <div className="mb-4">
          <SuccessAlert message={successMessage} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <BrutalistInput
              label="Nombre"
              type="text"
              placeholder="Juan"
              error={errors.nombre?.message}
              disabled={isSubmitting}
              {...register('nombre')}
            />
          </div>

          <div>
            <BrutalistInput
              label="Apellido"
              type="text"
              placeholder="Pérez"
              error={errors.apellido?.message}
              disabled={isSubmitting}
              {...register('apellido')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <BrutalistInput
              label="Documento"
              type="text"
              placeholder="1234567890"
              error={errors.documento?.message}
              disabled={isSubmitting}
              {...register('documento')}
            />
          </div>

          <div>
            <BrutalistInput
              label="Celular"
              type="text"
              placeholder="+573001234567"
              error={errors.celular?.message}
              disabled={isSubmitting}
              {...register('celular')}
            />
          </div>
        </div>

        <div>
          <BrutalistInput
            label="Fecha de Nacimiento"
            type="date"
            error={errors.fechaNacimiento?.message}
            disabled={isSubmitting}
            {...register('fechaNacimiento')}
          />
        </div>

        <div>
          <BrutalistInput
            label="Correo Electrónico"
            type="email"
            placeholder="tu@correo.com"
            error={errors.correo?.message}
            disabled={isSubmitting}
            {...register('correo')}
          />
        </div>

        <div>
          <BrutalistInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.clave?.message}
            disabled={isSubmitting}
            {...register('clave')}
          />
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Mínimo 8 caracteres, una mayúscula, una minúscula y un número
          </p>
        </div>

        <BrutalistButton
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting || !!successMessage}
        >
          {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
        </BrutalistButton>
      </form>

      {onSwitchToLogin && (
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            className="text-[var(--accent-primary)] hover:underline font-semibold"
            onClick={onSwitchToLogin}
          >
            Inicia sesión aquí
          </button>
        </p>
      )}
    </div>
  )
}
