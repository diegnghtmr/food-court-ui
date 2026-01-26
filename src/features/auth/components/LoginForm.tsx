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
import { getUserRole, getRoleHomePath } from '@infrastructure/auth/tokenManager'
import { loginSchema, type LoginFormData } from '../models'
import { useLogin } from '../queries/authQueries'

interface LoginFormProps {
  onSwitchToRegister?: () => void
}

/**
 * Translate common backend error messages to Spanish
 */
const translateErrorMessage = (message: string): string => {
  const translations: Record<string, string> = {
    'authentication failed':
      'Credenciales incorrectas. Verifica tu correo y contraseña.',
    'invalid credentials':
      'Credenciales incorrectas. Verifica tu correo y contraseña.',
    'user not found': 'Usuario no encontrado.',
    'invalid password': 'Contraseña incorrecta.',
    'account disabled': 'Tu cuenta ha sido deshabilitada.',
    'account locked': 'Tu cuenta ha sido bloqueada.',
    unauthorized: 'No autorizado. Verifica tus credenciales.',
    'bad credentials':
      'Credenciales incorrectas. Verifica tu correo y contraseña.',
  }

  const lowerMessage = message.toLowerCase()

  // Search for exact or partial match
  for (const [key, value] of Object.entries(translations)) {
    if (lowerMessage.includes(key)) {
      return value
    }
  }

  return message // Return original if no translation found
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const navigate = useNavigate()
  const { login } = useAuthActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null)

    try {
      const response = await loginMutation.mutateAsync(data)

      // Save token and update auth state
      login(response.token)

      // Get role from decoded token and redirect to appropriate home
      const role = getUserRole()
      if (role) {
        const homePath = getRoleHomePath(role)
        navigate(homePath)
      } else {
        setErrorMessage('Error al obtener el rol del usuario.')
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      const backendMessage = axiosError.response?.data?.message
      const message = backendMessage
        ? translateErrorMessage(backendMessage)
        : 'Error al iniciar sesión. Verifica tus credenciales.'
      setErrorMessage(message)
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
            disabled={loginMutation.isPending}
            {...register('correo')}
          />
        </div>

        <div>
          <BrutalistInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.clave?.message}
            disabled={loginMutation.isPending}
            {...register('clave')}
          />
        </div>

        <BrutalistButton
          type="submit"
          variant="primary"
          fullWidth
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
