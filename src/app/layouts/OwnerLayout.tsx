/**
 * OwnerLayout
 * Layout for restaurant owner dashboard with sidebar navigation
 */

import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthActions } from '@infrastructure/auth'
import { BrutalistButton, SkipLink } from '@shared/components'

export const OwnerLayout = () => {
  const { logout } = useAuthActions()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <SkipLink />

      <div className="flex min-h-screen bg-[var(--bg-primary)]">
        {/* Sidebar */}
        <aside className="w-64 border-r-2 border-[var(--border-default)] bg-[var(--bg-secondary)] p-6">
          <h1 className="text-2xl font-bold mb-8 text-[var(--text-primary)] uppercase">
            Mi Restaurante
          </h1>

          <nav className="space-y-4">
            <Link
              to="/owner/dashboard"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Dashboard
            </Link>

            <Link
              to="/owner/dishes"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Mis Platos
            </Link>

            <Link
              to="/owner/create-employee"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Crear Empleado
            </Link>

            <Link
              to="/owner/analytics"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Reportes
            </Link>

            <div className="pt-8">
              <BrutalistButton variant="danger" onClick={handleLogout} fullWidth>
                Cerrar Sesion
              </BrutalistButton>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </>
  )
}
