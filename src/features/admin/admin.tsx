import { useEffect, useState } from 'react'
import {
  BrutalistCard,
  BrutalistButton,
  LoadingSpinner,
  ErrorAlert,
} from '@shared/components'
import { useNavigate } from 'react-router-dom'
import { adminStatsService } from './services/adminStatsService'
import { adminActivityService } from './services/adminActivityService'
import {
  ADMIN_ACTIVITY_TYPES,
  type AdminActivity,
  type AdminStats,
} from './models'

export const Admin = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activity, setActivity] = useState<AdminActivity[]>([])
  const [activityLoading, setActivityLoading] = useState(true)
  const [activityError, setActivityError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await adminStatsService.getAdminStats()
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

  useEffect(() => {
    const loadActivity = async () => {
      setActivityLoading(true)
      setActivityError(null)

      try {
        const data = await adminActivityService.getRecentActivity()
        setActivity(data)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Error al cargar la actividad reciente.'
        setActivityError(message)
        setActivity([])
      } finally {
        setActivityLoading(false)
      }
    }

    void loadActivity()
  }, [])

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Sin fecha'
    const parsed = new Date(dateString)
    if (Number.isNaN(parsed.getTime())) return 'Sin fecha'
    return parsed.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getActivityLabel = (type: AdminActivity['type']): string => {
    switch (type) {
      case ADMIN_ACTIVITY_TYPES.OWNER:
        return 'Propietario'
      case ADMIN_ACTIVITY_TYPES.RESTAURANT:
        return 'Restaurante'
      default:
        return 'Actividad'
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Admin Dashboard
      </h1>

      {/* Statistics Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            color: 'var(--text-secondary)',
          }}
        >
          Estadísticas
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
              minHeight: '150px',
            }}
          >
            <LoadingSpinner size="lg" />
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
            {/* Total Owners Card */}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-5xl font-bold text-[var(--color-info)] mb-2">
                  {stats.totalOwners}
                </div>
                <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-medium mb-3">
                  Propietarios Registrados
                </div>
                <BrutalistButton
                  onClick={() => navigate('/admin/create-owner')}
                  variant="neutral"
                  size="sm"
                >
                  + Nuevo
                </BrutalistButton>
              </div>
            </BrutalistCard>

            {/* Total Restaurants Card */}
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="text-5xl font-bold text-[var(--color-success)] mb-2">
                  {stats.totalRestaurants}
                </div>
                <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-medium mb-3">
                  Restaurantes Creados
                </div>
                <BrutalistButton
                  onClick={() => navigate('/admin/create-restaurant')}
                  variant="neutral"
                  size="sm"
                >
                  + Nuevo
                </BrutalistButton>
              </div>
            </BrutalistCard>

            {/* Active Restaurants Card */}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-5xl font-bold text-[var(--color-warning)] mb-2">
                  {stats.activeRestaurants}
                </div>
                <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-medium">
                  Restaurantes Activos
                </div>
              </div>
            </BrutalistCard>
          </div>
        )}

        {!error && !isLoading && !stats && (
          <p style={{ color: 'var(--text-secondary)' }}>No hay estadísticas disponibles.</p>
        )}
      </div>

      {/* Recent Activity Section */}
      <div>
        <BrutalistCard>
          <h2
            style={{
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
          >
            Actividad Reciente
          </h2>

          {activityError && (
            <div style={{ marginBottom: '1rem' }}>
              <ErrorAlert message={activityError} />
            </div>
          )}

          {!activityError && activityLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '150px',
              }}
            >
              <LoadingSpinner size="md" />
            </div>
          )}

          {!activityError && !activityLoading && activity.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              No hay actividad reciente.
            </p>
          )}

          {!activityError && !activityLoading && activity.length > 0 && (
            <ul
              style={{
                display: 'grid',
                gap: '0.75rem',
              }}
            >
              {activity.map((item) => (
                <li
                  key={item.id}
                  style={{
                    border: '2px solid var(--border-default)',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '2px solid var(--border-default)',
                        padding: '0.15rem 0.45rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        backgroundColor:
                          item.type === ADMIN_ACTIVITY_TYPES.OWNER
                            ? 'var(--color-warning)'
                            : 'var(--color-success)',
                        color: '#000',
                      }}
                    >
                      {getActivityLabel(item.type)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {item.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </BrutalistCard>
      </div>
    </div>
  )
}
