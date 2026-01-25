import { useEffect, useState } from 'react'
import {
  BrutalistCard,
  BrutalistButton,
  LoadingSpinner,
  ErrorAlert,
} from '@shared/components'
import { useNavigate } from 'react-router-dom'
import { getRestaurantId } from '@infrastructure/auth/tokenManager'
import { ownerStatsService } from './services/ownerStatsService'
import type { OwnerStats } from './models'

export const Owner = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      setError(null)
      const restaurantId = getRestaurantId()?.toString() || ''

      if (!restaurantId) {
        setError('No se pudo determinar el restaurante del propietario.')
        setIsLoading(false)
        return
      }

      try {
        const data = await ownerStatsService.getOwnerStats(restaurantId)
        setStats(data)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar las estadisticas del dashboard.'
        setError(message)
        setStats(null)
      } finally {
        setIsLoading(false)
      }
    }

    void loadStats()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Owner Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Statistics
          </h2>

          {error && (
            <div style={{ marginBottom: '1rem' }}>
              <ErrorAlert message={error} />
            </div>
          )}

          {!error && isLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
              }}
            >
              <LoadingSpinner size="md" />
            </div>
          )}

          {!error && !isLoading && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Dishes Card */}
              <div className="border-2 border-[var(--border-default)] p-4 bg-[var(--bg-secondary)] shadow-[var(--shadow-hard)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-4xl font-bold text-[var(--color-info)]">
                      {stats.totalDishes}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                      Platos Creados
                    </div>
                  </div>
                  <svg
                    className="w-8 h-8 text-[var(--color-info)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>

              {/* Active Dishes Card */}
              <div className="border-2 border-[var(--border-default)] p-4 bg-[var(--bg-secondary)] shadow-[var(--shadow-hard)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-4xl font-bold text-[var(--color-success)]">
                      {stats.activeDishes}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                      Platos Activos
                    </div>
                  </div>
                  <svg
                    className="w-8 h-8 text-[var(--color-success)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Employees Card */}
              <div className="border-2 border-[var(--border-default)] p-4 bg-[var(--bg-secondary)] shadow-[var(--shadow-hard)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-4xl font-bold text-[var(--color-warning)]">
                      {stats.totalEmployees}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                      Empleados
                    </div>
                  </div>
                  <svg
                    className="w-8 h-8 text-[var(--color-warning)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Orders Today Card */}
              <div className="border-2 border-[var(--border-default)] p-4 bg-[var(--bg-secondary)] shadow-[var(--shadow-hard)]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-4xl font-bold text-[var(--color-error)]">
                      {stats.ordersToday}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                      Pedidos Hoy
                    </div>
                  </div>
                  <svg
                    className="w-8 h-8 text-[var(--color-error)] flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {!error && !isLoading && !stats && (
            <p style={{ color: '#666' }}>No hay estadisticas disponibles.</p>
          )}
        </BrutalistCard>

        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Dish Management
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <BrutalistButton
              onClick={() => navigate('/owner/dishes')}
              variant="primary"
            >
              Manage Dishes
            </BrutalistButton>
            <BrutalistButton
              onClick={() => navigate('/owner/dish/create')}
              variant="neutral"
            >
              Create New Dish
            </BrutalistButton>
          </div>
        </BrutalistCard>

        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Employee Management
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <BrutalistButton
              onClick={() => navigate('/owner/create-employee')}
              variant="primary"
            >
              Create New Employee
            </BrutalistButton>
            <BrutalistButton
              onClick={() => navigate('/owner/analytics')}
              variant="neutral"
            >
              View Analytics
            </BrutalistButton>
          </div>
        </BrutalistCard>
      </div>
    </div>
  )
}
