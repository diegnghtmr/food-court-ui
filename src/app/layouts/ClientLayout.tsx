/**
 * ClientLayout
 * Layout for client (customer) dashboard with navigation
 */

import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthActions } from '@infrastructure/auth'
import { BrutalistButton } from '@shared/components'

export const ClientLayout = () => {
  const { logout } = useAuthActions()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b-2 border-[var(--border-default)] bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] uppercase">
            Plazoleta de Comidas
          </h1>

          <nav className="flex items-center gap-6">
            <Link
              to="/client/restaurants"
              className="px-4 py-2 border-b-2 border-[var(--border-default)] hover:border-[var(--color-info)] no-underline text-[var(--text-primary)]"
            >
              Restaurantes
            </Link>

            <Link
              to="/client/orders"
              className="px-4 py-2 border-b-2 border-[var(--border-default)] hover:border-[var(--color-info)] no-underline text-[var(--text-primary)]"
            >
              Mis Pedidos
            </Link>

            <BrutalistButton variant="danger" size="sm" onClick={handleLogout}>
              Salir
            </BrutalistButton>
          </nav>
        </div>
      </header>

      {/* Content Area */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}
