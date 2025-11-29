import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { getUserId } from '@infrastructure/auth/tokenManager'
import type { CreateOrderData, ClientOrder } from '../models'
import { OrderStatus, isValidOrderStatus } from '@shared/types'

const mapOrderStatus = (status: string | undefined): OrderStatus => {
  if (status && isValidOrderStatus(status)) {
    return status
  }
  return OrderStatus.PENDIENTE
}

/**
 * Order service for client module
 * Handles all order-related API calls
 */
export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData: CreateOrderData): Promise<ClientOrder> => {
    const payload = {
      restaurantId: orderData.restauranteId,
      dishes: orderData.platos.map((plato) => ({
        dishId: plato.platoId,
        quantity: plato.cantidad,
      })),
    }

    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PEDIDOS}/orders`,
      payload
    )
    const data = response.data

    return {
      id: Number(data.id),
      restauranteId: data.restaurantId,
      restauranteNombre: '',
      items: (data.dishes ?? []).map((dish: any) => ({
        platoNombre: `Plato ${dish.dishId}`,
        cantidad: dish.quantity,
        precio: 0,
      })),
      total: 0,
      estado: mapOrderStatus(data.status),
      pin: undefined,
      fechaCreacion: data.date,
    }
  },

  /**
   * Get all orders/traces for the authenticated client
   */
  getMyOrders: async (): Promise<ClientOrder[]> => {
    const clientId = getUserId()
    if (!clientId) {
      throw new Error('User not authenticated')
    }
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.TRAZABILIDAD}/trace/client/${clientId}`
    )
    return response.data
  },

  /**
   * Cancel a pending order
   */
  cancelOrder: async (orderId: number): Promise<void> => {
    await axiosInstance.patch(`${API_ENDPOINTS.PEDIDOS}/orders/cancel/${orderId}`)
  },

  /**
   * Get PIN for a ready order 
   */
  getOrderPin: async (orderId: number): Promise<string> => {
    // Backend does not expose a PIN retrieval endpoint; fallback to order details
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PEDIDOS}/orders/${orderId}`
    )
    if (response.data?.pin) {
      return response.data.pin
    }
    throw new Error('El endpoint de PIN no esta disponible')
  },
}
