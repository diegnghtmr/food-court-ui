/**
 * LoginForm Component
 * Login form with email and password using react-hook-form + Zod validation
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { BrutalistInput, BrutalistButton, ErrorAlert } from '@shared/components'
import { useAuthActions } from '@infrastructure/auth'
import { getRoleHomePath } from '@infrastructure/auth/tokenManager'
import { authService } from '../services/authService'
import { loginSchema, type LoginFormData } from '../models'

interface LoginFormProps {
  onSwitchToRegister?: () => void
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const navigate = useNavigate()
  const { login } = useAuthActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await authService.login(data)

      login(response.token)

      const homePath = getRoleHomePath(response.user.role)
      navigate(homePath)
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      const message =
        axiosError.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>

      {errorMessage && (
        <div className="mb-4">
          <ErrorAlert message={errorMessage} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        </div>

        <BrutalistButton
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </BrutalistButton>
      </form>

      {onSwitchToRegister && (
        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="text-[var(--accent-primary)] hover:underline font-semibold"
            onClick={onSwitchToRegister}
          >
            Regístrate aquí
          </button>
        </p>
      )}
    </div>
  )
}
