import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OrderStatus } from '@shared/types'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPatch = vi.fn()
vi.mock('@infrastructure/api/axiosInstance', () => ({
  default: {
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
  },
}))

const tokenMocks = vi.hoisted(() => ({
  getUserId: vi.fn(),
}))

vi.mock('@infrastructure/auth/tokenManager', () => ({
  getUserId: tokenMocks.getUserId,
}))

const loadService = async () => {
  const module = await import('./orderService')
  return module.orderService
}

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('crea un pedido y mapea la respuesta', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        id: 5,
        restaurantId: 10,
        dishes: [{ dishId: 1, quantity: 2 }],
        status: OrderStatus.PENDIENTE,
        date: '2024-01-01',
      },
    })

    mockGet
      .mockResolvedValueOnce({
        data: [{ id: 10, name: 'Rest A' }],
      })
      .mockResolvedValueOnce({
        data: [{ id: 1, name: 'Plato 1', price: 1000 }],
      })

    const orderService = await loadService()
    const result = await orderService.createOrder({
      restauranteId: 10,
      platos: [{ platoId: 1, cantidad: 2 }],
    })

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/orders'),
      {
        restaurantId: 10,
        dishes: [{ dishId: 1, quantity: 2 }],
      }
    )
    expect(result).toMatchObject({
      id: 5,
      restauranteId: 10,
      restauranteNombre: 'Rest A',
      total: 2000,
      estado: OrderStatus.PENDIENTE,
    })
  })

  it('obtiene pedidos del cliente y mapea estados', async () => {
    tokenMocks.getUserId.mockReturnValue('7')

    mockGet
      .mockResolvedValueOnce({
        data: [{ orderId: 20, newState: OrderStatus.LISTO }],
      })
      .mockResolvedValueOnce({
        data: {
          id: 20,
          restaurantId: 30,
          dishes: [{ dishId: 2, quantity: 1 }],
          status: OrderStatus.EN_PREPARACION,
          date: '2024-01-02',
        },
      })
      .mockResolvedValueOnce({
        data: [{ id: 30, name: 'Rest B' }],
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, name: 'Plato 2', price: 5000 }],
      })

    const orderService = await loadService()
    const orders = await orderService.getMyOrders()

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining('/trace/client/7')
    )
    expect(orders[0]).toMatchObject({
      id: 20,
      estado: OrderStatus.EN_PREPARACION, // prioriza el status del detalle
      restauranteNombre: 'Rest B',
      total: 5000,
    })
  })

  it('omite pedidos cuyo detalle falla pero continúa con los demás', async () => {
    tokenMocks.getUserId.mockReturnValue('9')

    mockGet
      .mockResolvedValueOnce({
        data: [
          { orderId: 30, newState: OrderStatus.LISTO },
          { orderId: 31, newState: OrderStatus.PENDIENTE },
        ],
      })
      // Detalle 30 falla
      .mockRejectedValueOnce(new Error('fail 30'))
      // Detalle 31 ok
      .mockResolvedValueOnce({
        data: {
          id: 31,
          restaurantId: 40,
          dishes: [{ dishId: 3, quantity: 1 }],
          status: OrderStatus.PENDIENTE,
          date: '2024-01-03',
        },
      })
      // Restaurants
      .mockResolvedValueOnce({
        data: [{ id: 40, name: 'Rest C' }],
      })
      // Dishes
      .mockResolvedValueOnce({
        data: [{ id: 3, name: 'Plato 3', price: 7000 }],
      })

    const orderService = await loadService()
    const orders = await orderService.getMyOrders()

    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe(31)
  })

  it('lanza si falla la obtención de trazas', async () => {
    tokenMocks.getUserId.mockReturnValue('7')
    mockGet.mockRejectedValueOnce(new Error('trace fail'))

    const orderService = await loadService()
    await expect(orderService.getMyOrders()).rejects.toThrow(/trace fail/i)
  })

  it('realiza cancelación de pedido', async () => {
    const orderService = await loadService()
    mockPatch.mockResolvedValueOnce({})

    await orderService.cancelOrder(55)

    expect(mockPatch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/cancel/55')
    )
  })

  it('lanza error si no hay usuario autenticado al consultar pedidos', async () => {
    tokenMocks.getUserId.mockReturnValue(null)
    const orderService = await loadService()
    await expect(orderService.getMyOrders()).rejects.toThrow(
      /not authenticated/i
    )
  })
})
