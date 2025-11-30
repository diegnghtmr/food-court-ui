/**
 * Auth Container
 * Main authentication page with login/register tabs
 */

import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BrutalistCard, BrutalistButton, ErrorAlert } from '@shared/components'
import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'

type AuthMode = 'login' | 'register'

export const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const location = useLocation()
  const authMessage = (location.state as { authMessage?: string } | null)
    ?.authMessage

  const handleRegisterSuccess = () => {
    setMode('login')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-[var(--text-primary)]">
          PLAZOLETA DE COMIDAS
        </h1>

        <BrutalistCard>
          {authMessage && (
            <div className="mb-4">
              <ErrorAlert message={authMessage} />
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <BrutalistButton
              onClick={() => setMode('login')}
              variant={mode === 'login' ? 'primary' : 'neutral'}
              fullWidth
            >
              Iniciar Sesión
            </BrutalistButton>
            <BrutalistButton
              onClick={() => setMode('register')}
              variant={mode === 'register' ? 'primary' : 'neutral'}
              fullWidth
            >
              Registro
            </BrutalistButton>
          </div>

          {mode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </BrutalistCard>
      </div>
    </div>
  )
}
