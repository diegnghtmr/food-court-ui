/**
 * RegisterForm Component
 * Registration form with full user data using react-hook-form + Zod validation
 */

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import {
  BrutalistInput,
  BrutalistPhoneInput,
  BrutalistButton,
  ErrorAlert,
  SuccessAlert,
} from '@shared/components'
import { registerSchema, type RegisterFormData } from '../models'
import { useRegister } from '../queries/authQueries'

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
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await registerMutation.mutateAsync(data)

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
              disabled={registerMutation.isPending}
              {...register('nombre')}
            />
          </div>

          <div>
            <BrutalistInput
              label="Apellido"
              type="text"
              placeholder="Pérez"
              error={errors.apellido?.message}
              disabled={registerMutation.isPending}
              {...register('apellido')}
            />
          </div>
        </div>

        <div>
          <BrutalistInput
            label="Documento"
            type="text"
            placeholder="1234567890"
            error={errors.documento?.message}
            disabled={registerMutation.isPending}
            {...register('documento')}
          />
        </div>

        <div>
          <Controller
            name="celular"
            control={control}
            render={({ field }) => (
              <BrutalistPhoneInput
                label="Celular"
                value={field.value}
                onChange={field.onChange}
                error={errors.celular?.message}
                disabled={registerMutation.isPending}
              />
            )}
          />
        </div>

        <div>
          <BrutalistInput
            label="Fecha de Nacimiento"
            type="date"
            error={errors.fechaNacimiento?.message}
            disabled={registerMutation.isPending}
            {...register('fechaNacimiento')}
          />
        </div>

        <div>
          <BrutalistInput
            label="Correo Electrónico"
            type="email"
            placeholder="tu@correo.com"
            error={errors.correo?.message}
            disabled={registerMutation.isPending}
            {...register('correo')}
          />
        </div>

        <div>
          <BrutalistInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.clave?.message}
            disabled={registerMutation.isPending}
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
          disabled={registerMutation.isPending || !!successMessage}
        >
          {registerMutation.isPending ? 'Registrando...' : 'Crear Cuenta'}
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
