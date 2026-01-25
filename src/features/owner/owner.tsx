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
            : 'Error al cargar las estadísticas del dashboard.'
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
        Panel de Propietario
      </h1>

      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
        }}
      >
        Estadísticas
      </h2>

      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ErrorAlert message={error} />
        </div>
      )}

      {!error && isLoading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
          }}
        >
          <LoadingSpinner size="md" />
        </div>
      )}

      {!error && !isLoading && stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Platos Creados Card */}
          <BrutalistCard>
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <svg
                  className="w-10 h-10 text-[var(--color-info)]"
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
              <div className="text-5xl font-bold text-[var(--color-info)]">
                {stats.totalDishes}
              </div>
              <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-2 mb-4">
                Platos Creados
              </div>
              <BrutalistButton
                variant="neutral"
                size="sm"
                onClick={() => navigate('/owner/dishes')}
              >
                Gestionar
              </BrutalistButton>
            </div>
          </BrutalistCard>

          {/* Platos Activos Card */}
          <BrutalistCard>
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <svg
                  className="w-10 h-10 text-[var(--color-success)]"
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
              <div className="text-5xl font-bold text-[var(--color-success)]">
                {stats.activeDishes}
              </div>
              <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-2 mb-4">
                Platos Activos
              </div>
              <BrutalistButton
                variant="neutral"
                size="sm"
                onClick={() => navigate('/owner/dish/create')}
              >
                + Nuevo
              </BrutalistButton>
            </div>
          </BrutalistCard>

          {/* Empleados Card */}
          <BrutalistCard>
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <svg
                  className="w-10 h-10 text-[var(--color-warning)]"
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
              <div className="text-5xl font-bold text-[var(--color-warning)]">
                {stats.totalEmployees}
              </div>
              <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-2 mb-4">
                Empleados
              </div>
              <BrutalistButton
                variant="neutral"
                size="sm"
                onClick={() => navigate('/owner/create-employee')}
              >
                + Nuevo
              </BrutalistButton>
            </div>
          </BrutalistCard>

          {/* Pedidos Hoy Card */}
          <BrutalistCard>
            <div className="text-center py-4">
              <div className="flex justify-center mb-3">
                <svg
                  className="w-10 h-10 text-[var(--color-error)]"
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
              <div className="text-5xl font-bold text-[var(--color-error)]">
                {stats.ordersToday}
              </div>
              <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mt-2 mb-4">
                Pedidos Hoy
              </div>
              <BrutalistButton
                variant="neutral"
                size="sm"
                onClick={() => navigate('/owner/analytics')}
              >
                Analytics
              </BrutalistButton>
            </div>
          </BrutalistCard>
        </div>
      )}

      {!error && !isLoading && !stats && (
        <p style={{ color: '#666' }}>No hay estadísticas disponibles.</p>
      )}
    </div>
  )
}
