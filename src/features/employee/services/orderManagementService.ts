import type { Order, OrdersByStatus } from '../models'

export const orderManagementService = {
  getOrdersByStatus: async (_restaurantId: string): Promise<OrdersByStatus> => {
    // TODO: Implement get orders by status API call
    return Promise.resolve({
      pending: [],
      preparing: [],
      ready: [],
      delivered: [],
    })
  },

  assignOrderToEmployee: async (orderId: string): Promise<Order> => {
    // TODO: Implement assign order API call
    return Promise.resolve({
      id: orderId,
      clientId: '1',
      restaurantId: '1',
      status: 'PREPARING',
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  markOrderReady: async (orderId: string): Promise<Order> => {
    // TODO: Implement mark order ready API call
    return Promise.resolve({
      id: orderId,
      clientId: '1',
      restaurantId: '1',
      status: 'READY',
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  deliverOrder: async (
    orderId: string,
    _securityPin: string
  ): Promise<Order> => {
    // TODO: Implement deliver order API call (requires PIN validation)
    return Promise.resolve({
      id: orderId,
      clientId: '1',
      restaurantId: '1',
      status: 'DELIVERED',
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    // TODO: Implement cancel order API call
    return Promise.resolve({
      id: orderId,
      clientId: '1',
      restaurantId: '1',
      status: 'CANCELLED',
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },
}
