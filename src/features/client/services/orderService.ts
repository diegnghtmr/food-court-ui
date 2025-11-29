import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { CreateOrderData, ClientOrder } from '../models'

/**
 * Order service for client module
 * Handles all order-related API calls
 */
export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: CreateOrderData): Promise<ClientOrder> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PEDIDOS}/pedidos`,
      orderData
    )
    return response.data
  },

  /**
   * Get all orders for the authenticated client
   */
  getMyOrders: async (): Promise<ClientOrder[]> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TRAZABILIDAD}/trazabilidad/pedidos/mis-pedidos`
    )
    return response.data
  },

  /**
   * Cancel a pending order
   */
  cancelOrder: async (orderId: number): Promise<void> => {
    await axiosInstance.patch(
      `${API_ENDPOINTS.PEDIDOS}/pedidos/${orderId}/cancelar`
    )
  },

  /**
   * Get PIN for a ready order (CRITICAL for pickup)
   */
  getOrderPin: async (orderId: number): Promise<string> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PEDIDOS}/pedidos/${orderId}/pin`
    )
    return response.data.pin
  },
}
