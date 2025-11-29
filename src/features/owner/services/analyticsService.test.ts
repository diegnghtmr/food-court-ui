import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockGet = vi.fn()

vi.mock('@infrastructure/api/axiosInstance', () => ({
  default: {
    get: mockGet,
  },
}))

const loadService = async () => {
  const module = await import('./analyticsService')
  return module.analyticsService
}

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('mapea el reporte de eficiencia con valores por defecto', async () => {
    mockGet.mockResolvedValueOnce({
      data: [
        {
          employeeId: 10,
          employeeName: 'Carlos',
          completedOrders: 5,
          averageCompletionTime: 12,
          efficiency: 0.9,
          period: '2024-01',
        },
        {
          employeeId: null,
          employeeName: null,
          completedOrders: null,
          averageCompletionTime: null,
          efficiency: null,
        },
      ],
    })

    const analyticsService = await loadService()
    const result = await analyticsService.getEfficiencyReport(
      '1',
      '2024-01-01',
      '2024-01-31'
    )

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/trace/efficiency'),
      {
        params: {
          restaurantId: '1',
          startDate: '2024-01-01',
          endDate: '2024-01-31',
        },
      }
    )
    expect(result[0]).toMatchObject({
      employeeId: '10',
      employeeName: 'Carlos',
      completedOrders: 5,
      averageCompletionTime: 12,
      efficiency: 0.9,
      period: '2024-01',
    })
    expect(result[1]).toMatchObject({
      employeeId: '',
      employeeName: 'Desconocido',
      completedOrders: 0,
      averageCompletionTime: 0,
      efficiency: 0,
    })
  })

  it('devuelve Blob al exportar reporte', async () => {
    const blob = new Blob(['data'])
    mockGet.mockResolvedValueOnce({ data: blob })

    const analyticsService = await loadService()
    const result = await analyticsService.exportEfficiencyReport('2')

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/trace/efficiency/export'),
      { params: { restaurantId: '2' }, responseType: 'blob' }
    )
    expect(result).toBe(blob)
  })
})
