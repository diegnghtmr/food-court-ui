import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { Order, PinValidationResponse } from '../models'
import { OrderStatus } from '@shared/types'

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
    restaurantId: number,
    status: OrderStatus
  ): Promise<Order[]> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PEDIDOS}/pedidos`,
      {
        params: {
          restauranteId: restaurantId,
          estado: status,
        },
      }
    )
    return response.data
  },

  /**
   * Assign order to employee (PENDIENTE -> EN_PREPARACION)
   * @param orderId - Order ID to assign
   * @param employeeId - Employee ID
   * @returns Updated order
   */
  assignOrderToEmployee: async (
    orderId: number,
    employeeId: number
  ): Promise<Order> => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PEDIDOS}/pedidos/${orderId}/asignar`,
      {
        empleadoId: employeeId,
        nuevoEstado: OrderStatus.EN_PREPARACION,
      }
    )
    return response.data
  },

  /**
   * Mark order as ready (EN_PREPARACION -> LISTO)
   * @param orderId - Order ID
   * @returns Updated order with PIN
   */
  markOrderReady: async (orderId: number): Promise<Order> => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PEDIDOS}/pedidos/${orderId}/estado`,
      {
        nuevoEstado: OrderStatus.LISTO,
      }
    )
    return response.data
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
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PEDIDOS}/pedidos/${orderId}/validar-pin`,
      { pin }
    )
    return response.data
  },
}
