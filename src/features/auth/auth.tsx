import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'

interface AuthProps {
  mode: 'login' | 'register'
}

export const Auth = ({ mode }: AuthProps) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ width: '100%', maxWidth: '450px' }}>
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}
