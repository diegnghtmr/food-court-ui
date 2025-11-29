import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail

      router.navigate('/login', {
        replace: true,
        state: {
          authMessage:
            detail?.message ||
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        },
      })
    }

    window.addEventListener(
      'auth:unauthorized',
      handleUnauthorized as EventListener
    )

    return () => {
      window.removeEventListener(
        'auth:unauthorized',
        handleUnauthorized as EventListener
      )
    }
  }, [])

  return <RouterProvider router={router} />
}

export default App
