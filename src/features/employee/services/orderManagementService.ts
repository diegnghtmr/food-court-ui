import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { Order, PinValidationResponse } from '../models'
import { OrderStatus, isValidOrderStatus } from '@shared/types'

const mapOrder = (data: any): Order => ({
  id: Number(data.id),
  restauranteId: data.restaurantId,
  clienteId: data.clientId,
  clienteNombre: '',
  clienteCorreo: '',
  items: (data.dishes ?? []).map((dish: any) => ({
    id: dish.dishId,
    platoId: dish.dishId,
    platoNombre: `Plato ${dish.dishId}`,
    cantidad: dish.quantity,
    precio: 0,
  })),
  estado: isValidOrderStatus(data.status)
    ? (data.status as OrderStatus)
    : OrderStatus.PENDIENTE,
  empleadoId: data.chefId ?? undefined,
  pin: data.pin,
  fechaCreacion: data.date,
})

/**
 * Order Management Service
 * Handles all employee-related order operations
 */
export const orderManagementService = {
  /**
   * Get orders by status and restaurant
   * @param restaurantId - Restaurant ID
   * @param status - Order status to filter
   * @returns Array of orders
   */
  getOrdersByStatus: async (
    _restaurantId: number,
    status: OrderStatus
  ): Promise<Order[]> => {
    void _restaurantId
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PEDIDOS}/orders`,
      { params: { status, page: 0, size: 30 } }
    )
    const data = response.data
    const content = Array.isArray(data?.content) ? data.content : data
    return (content ?? []).map(mapOrder)
  },

  /**
   * Assign order to employee (PENDIENTE -> EN_PREPARACION)
   * @param orderId - Order ID to assign
   * @param employeeId - Employee ID
   * @returns Updated order
   */
  assignOrderToEmployee: async (
    orderId: number,
    _employeeId: number
  ): Promise<Order> => {
    void _employeeId
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PEDIDOS}/orders/${orderId}/assign`
    )
    return mapOrder(response.data)
  },

  /**
   * Mark order as ready (EN_PREPARACION -> LISTO)
   * @param orderId - Order ID
   * @returns Updated order with PIN
   */
  markOrderReady: async (orderId: number): Promise<Order> => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PEDIDOS}/orders/${orderId}/ready`
    )
    return mapOrder(response.data)
  },

  /**
   * Validate PIN and deliver order (LISTO -> ENTREGADO)
   * @param orderId - Order ID
   * @param pin - Security PIN from client
   * @returns Validation response
   */
  deliverOrder: async (
    orderId: number,
    pin: string
  ): Promise<PinValidationResponse> => {
    await axiosInstance.post(
      `${API_ENDPOINTS.PEDIDOS}/orders/deliver/${orderId}/${pin}`
    )
    return {
      valido: true,
      mensaje: 'Pedido entregado',
    }
  },
}
