import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OrderStatus } from '@shared/types'

const mockGet = vi.fn()
const mockPatch = vi.fn()
const mockPost = vi.fn()

vi.mock('@infrastructure/api/axiosInstance', () => ({
  default: {
    get: mockGet,
    patch: mockPatch,
    post: mockPost,
  },
}))

const loadService = async () => {
  const module = await import('./orderManagementService')
  return module.orderManagementService
}

describe('orderManagementService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('mapea órdenes con datos de platos y cliente', async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          content: [
            {
              id: 10,
              restaurantId: 50,
              clientId: 99,
              status: OrderStatus.PENDIENTE,
              dishes: [{ dishId: 7, quantity: 2 }],
              chefId: null,
              pin: '1234',
              date: '2024-01-01',
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          content: [{ id: 7, name: 'Hamburguesa', price: 15000 }],
        },
      })
      .mockResolvedValueOnce({
        data: { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
      })

    const orderManagementService = await loadService()
    const orders = await orderManagementService.getOrdersByStatus(
      50,
      OrderStatus.PENDIENTE
    )

    expect(orders).toHaveLength(1)
    expect(orders[0]).toMatchObject({
      id: 10,
      restauranteId: 50,
      clienteId: 99,
      clienteNombre: 'Jane Doe',
      clienteCorreo: 'jane@example.com',
      estado: OrderStatus.PENDIENTE,
    })
    expect(orders[0].items[0]).toMatchObject({
      platoId: 7,
      platoNombre: 'Hamburguesa',
      cantidad: 2,
      precio: 15000,
    })
  })

  it('asigna orden a empleado y retorna orden mapeada', async () => {
    mockPatch.mockResolvedValueOnce({
      data: {
        id: 5,
        restaurantId: 20,
        clientId: 88,
        status: OrderStatus.EN_PREPARACION,
        dishes: [{ dishId: 3, quantity: 1 }],
        chefId: 7,
        pin: '5555',
        date: '2024-02-02',
      },
    })

    mockGet
      .mockResolvedValueOnce({
        data: { content: [{ id: 3, name: 'Papas', price: 5000 }] },
      })
      .mockResolvedValueOnce({
        data: { firstName: 'Ana', lastName: 'Rojas', email: 'ana@example.com' },
      })

    const orderManagementService = await loadService()
    const order = await orderManagementService.assignOrderToEmployee(5, 7)

    expect(mockPatch).toHaveBeenCalledWith(
      expect.stringContaining('/orders/5/assign')
    )
    expect(order.estado).toBe(OrderStatus.EN_PREPARACION)
    expect(order.items[0].platoNombre).toBe('Papas')
  })

  it('marca orden como lista', async () => {
    mockPatch.mockResolvedValueOnce({
      data: {
        id: 6,
        restaurantId: 22,
        clientId: 90,
        status: OrderStatus.LISTO,
        dishes: [{ dishId: 9, quantity: 1 }],
        chefId: 2,
        pin: '7777',
        date: '2024-03-03',
      },
    })

    mockGet
      .mockResolvedValueOnce({
        data: { content: [{ id: 9, name: 'Taco', price: 8000 }] },
      })
      .mockResolvedValueOnce({
        data: { firstName: 'Luis', lastName: 'Perez', email: 'luis@example.com' },
      })

    const orderManagementService = await loadService()
    const order = await orderManagementService.markOrderReady(6)

    expect(order.estado).toBe(OrderStatus.LISTO)
    expect(order.items[0].platoNombre).toBe('Taco')
    expect(order.pin).toBe('7777')
  })

  it('entrega orden validando PIN', async () => {
    mockPost.mockResolvedValueOnce({})
    const orderManagementService = await loadService()

    const result = await orderManagementService.deliverOrder(9, '9999')

    expect(mockPost).toHaveBeenCalledWith(
      expect.stringContaining('/deliver/9/9999')
    )
    expect(result).toEqual({ valido: true, mensaje: 'Pedido entregado' })
  })

  it('propaga error si falla obtener órdenes por estado', async () => {
    mockGet.mockRejectedValueOnce(new Error('network'))
    const orderManagementService = await loadService()
    await expect(
      orderManagementService.getOrdersByStatus(1, OrderStatus.PENDIENTE)
    ).rejects.toThrow(/network/i)
  })

  it('propaga error si falla la entrega con PIN', async () => {
    mockPost.mockRejectedValueOnce(new Error('deliver fail'))
    const orderManagementService = await loadService()
    await expect(
      orderManagementService.deliverOrder(99, '0000')
    ).rejects.toThrow(/deliver fail/i)
  })
})
