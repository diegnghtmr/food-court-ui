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
            <ul
              style={{
                paddingLeft: '1.5rem',
                fontSize: '0.9rem',
                color: '#444',
                display: 'grid',
                gap: '0.5rem',
              }}
            >
              <li>
                <strong>{stats.totalDishes}</strong> platos creados
              </li>
              <li>
                <strong>{stats.activeDishes}</strong> platos activos
              </li>
              <li>
                <strong>{stats.totalEmployees}</strong> empleados registrados
              </li>
              <li>
                <strong>{stats.ordersToday}</strong> pedidos hoy
              </li>
            </ul>
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
