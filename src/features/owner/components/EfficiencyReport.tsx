import { useState, useEffect, useMemo } from 'react'
import {
  BrutalistCard,
  BrutalistInput,
  BrutalistButton,
  LoadingSpinner,
  ErrorAlert,
  SuccessAlert,
} from '@shared/components'
import { analyticsService } from '../services/analyticsService'
import type { EfficiencyReport as EfficiencyReportType } from '../models'

type SortColumn = keyof EfficiencyReportType | null
type SortDirection = 'asc' | 'desc'

interface SortState {
  column: SortColumn
  direction: SortDirection
}

/**
 * Formats minutes to human-readable time string
 * @param minutes - Time in minutes
 * @returns Formatted string: "X min" or "X h Y min"
 */
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)

  if (remainingMinutes === 0) {
    return `${hours} h`
  }

  return `${hours} h ${remainingMinutes} min`
}

/**
 * Formats efficiency percentage
 * @param efficiency - Efficiency value (0-100)
 * @returns Formatted string: "XX.X%"
 */
const formatEfficiency = (efficiency: number): string => {
  return `${efficiency.toFixed(1)}%`
}

/**
 * Downloads a blob as a file
 * @param blob - File blob
 * @param filename - Desired filename
 */
const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const EfficiencyReport = () => {
  // TODO: Get restaurantId from authentication context
  const restaurantId = '1'

  // State
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [reportData, setReportData] = useState<EfficiencyReportType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [exporting, setExporting] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [sort, setSort] = useState<SortState>({
    column: null,
    direction: 'asc',
  })

  /**
   * Load initial report data without filters
   */
  useEffect(() => {
    loadReportData()
  }, [])

  /**
   * Fetches efficiency report from API
   */
  const loadReportData = async (
    start?: string,
    end?: string
  ): Promise<void> => {
    try {
      setLoading(true)
      setError('')

      const data = await analyticsService.getEfficiencyReport(
        restaurantId,
        start,
        end
      )

      setReportData(data)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al cargar el reporte de eficiencia'
      setError(errorMessage)
      setReportData([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Validates date range
   */
  const validateDateRange = (): boolean => {
    if (!startDate || !endDate) {
      setError('Por favor, selecciona ambas fechas')
      return false
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('La fecha de fin debe ser mayor o igual a la fecha de inicio')
      return false
    }

    return true
  }

  /**
   * Handles apply filters button click
   */
  const handleApplyFilters = async (): Promise<void> => {
    if (!validateDateRange()) return

    setError('')
    await loadReportData(startDate, endDate)
  }

  /**
   * Handles clear filters button click
   */
  const handleClearFilters = async (): Promise<void> => {
    setStartDate('')
    setEndDate('')
    setError('')
    setSort({ column: null, direction: 'asc' })
    await loadReportData()
  }

  /**
   * Handles column header click for sorting
   */
  const handleSort = (column: keyof EfficiencyReportType): void => {
    setSort((prevSort) => ({
      column,
      direction:
        prevSort.column === column && prevSort.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  /**
   * Sorted data based on current sort state
   */
  const sortedData = useMemo(() => {
    if (!sort.column) return reportData

    return [...reportData].sort((a, b) => {
      const aValue = a[sort.column as keyof EfficiencyReportType]
      const bValue = b[sort.column as keyof EfficiencyReportType]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [reportData, sort])

  /**
   * Handles export to Excel
   */
  const handleExportToExcel = async (): Promise<void> => {
    try {
      setExporting(true)
      setError('')
      setSuccess('')

      const blob = await analyticsService.exportEfficiencyReport(
        restaurantId,
        startDate || undefined,
        endDate || undefined
      )

      const filename = startDate && endDate
        ? `eficiencia_${startDate}_${endDate}.xlsx`
        : `eficiencia_${new Date().toISOString().split('T')[0]}.xlsx`

      downloadBlob(blob, filename)
      setSuccess('Reporte exportado exitosamente')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al exportar el reporte'
      setError(errorMessage)
    } finally {
      setExporting(false)
    }
  }

  /**
   * Renders sort indicator for table headers
   */
  const renderSortIndicator = (column: keyof EfficiencyReportType) => {
    if (sort.column !== column) return null

    return (
      <span style={{ marginLeft: '0.5rem' }}>
        {sort.direction === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          fontFamily: 'monospace',
        }}
      >
        REPORTE DE EFICIENCIA
      </h1>

      {/* Alerts */}
      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ErrorAlert message={error} onClose={() => setError('')} />
        </div>
      )}

      {success && (
        <div style={{ marginBottom: '1.5rem' }}>
          <SuccessAlert message={success} onClose={() => setSuccess('')} />
        </div>
      )}

      {/* Filters */}
      <div className="mb-8">
        <BrutalistCard>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              fontFamily: 'monospace',
            }}
          >
            FILTROS
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <BrutalistInput
              id="startDate"
              label="FECHA INICIO"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />

            <BrutalistInput
              id="endDate"
              label="FECHA FIN"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <BrutalistButton
              onClick={handleApplyFilters}
              disabled={loading || !startDate || !endDate}
            >
              {loading ? 'CARGANDO...' : 'APLICAR FILTROS'}
            </BrutalistButton>

            <BrutalistButton
              variant="neutral"
              onClick={handleClearFilters}
              disabled={loading}
            >
              LIMPIAR
            </BrutalistButton>

            <BrutalistButton
              variant="neutral"
              onClick={handleExportToExcel}
              disabled={exporting || reportData.length === 0 || loading}
            >
              {exporting ? 'EXPORTANDO...' : 'EXPORTAR A EXCEL'}
          </BrutalistButton>
        </div>
      </BrutalistCard>
      </div>

      {/* Report Table */}
      <BrutalistCard>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
          }}
        >
          MÉTRICAS DE EFICIENCIA
        </h2>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '3rem',
            }}
          >
            <LoadingSpinner />
          </div>
        ) : sortedData.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#666',
              fontFamily: 'monospace',
            }}
          >
            NO HAY DATOS DISPONIBLES
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'monospace',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#000', color: '#fff' }}>
                  <th
                    onClick={() => handleSort('employeeName')}
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      border: '3px solid #000',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#333')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#000')
                    }
                  >
                    NOMBRE DEL EMPLEADO
                    {renderSortIndicator('employeeName')}
                  </th>
                  <th
                    onClick={() => handleSort('completedOrders')}
                    style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      border: '3px solid #000',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#333')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#000')
                    }
                  >
                    PEDIDOS COMPLETADOS
                    {renderSortIndicator('completedOrders')}
                  </th>
                  <th
                    onClick={() => handleSort('averageCompletionTime')}
                    style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      border: '3px solid #000',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#333')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#000')
                    }
                  >
                    TIEMPO PROMEDIO
                    {renderSortIndicator('averageCompletionTime')}
                  </th>
                  <th
                    onClick={() => handleSort('efficiency')}
                    style={{
                      padding: '1rem',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      border: '3px solid #000',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#333')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#000')
                    }
                  >
                    EFICIENCIA
                    {renderSortIndicator('efficiency')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((report, index) => (
                  <tr
                    key={report.employeeId}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#e0e0e0')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? '#fff' : '#f5f5f5')
                    }
                  >
                    <td
                      style={{
                        padding: '1rem',
                        border: '2px solid #000',
                        fontWeight: 'bold',
                      }}
                    >
                      {report.employeeName}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        border: '2px solid #000',
                        textAlign: 'right',
                      }}
                    >
                      {report.completedOrders}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        border: '2px solid #000',
                        textAlign: 'right',
                      }}
                    >
                      {formatTime(report.averageCompletionTime)}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        border: '2px solid #000',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color:
                          report.efficiency >= 80
                            ? '#16a34a'
                            : report.efficiency >= 60
                              ? '#ca8a04'
                              : '#dc2626',
                      }}
                    >
                      {formatEfficiency(report.efficiency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && sortedData.length > 0 && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              border: '2px solid #000',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            TOTAL DE REGISTROS: {sortedData.length}
          </div>
        )}
      </BrutalistCard>
    </div>
  )
}
