/**
 * AdminLayout
 * Layout for administrator dashboard with sidebar navigation
 */

import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthActions } from '@infrastructure/auth'
import { BrutalistButton, SkipLink, ThemeToggle } from '@shared/components'

export const AdminLayout = () => {
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
            Panel Admin
          </h1>

          <nav className="space-y-4">
            <Link
              to="/admin/dashboard"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/create-owner"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Crear Propietario
            </Link>

            <Link
              to="/admin/create-restaurant"
              className="block px-4 py-3 border-2 border-[var(--border-default)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
            >
              Crear Restaurante
            </Link>

            <div className="pt-8 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-bold text-[var(--text-primary)] uppercase">
                  Tema
                </span>
                <ThemeToggle />
              </div>
              <BrutalistButton
                variant="danger"
                onClick={handleLogout}
                fullWidth
              >
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
