/**
 * EmployeeLayout
 * Layout for employee (kitchen) dashboard
 */

import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthActions } from '@infrastructure/auth'
import { BrutalistButton, SkipLink, ThemeToggle } from '@shared/components'

export const EmployeeLayout = () => {
  const { logout } = useAuthActions()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <SkipLink />

      <div className="min-h-screen bg-[var(--bg-primary)]">
        {/* Header */}
        <header className="border-b-2 border-[var(--border-default)] bg-[var(--bg-secondary)] p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] uppercase">
              Panel de Cocina
            </h1>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <BrutalistButton variant="danger" onClick={handleLogout}>
                Cerrar Sesion
              </BrutalistButton>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main id="main-content" tabIndex={-1} className="p-8">
          <Outlet />
        </main>
      </div>
    </>
  )
}
