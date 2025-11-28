import type { CreateOrderData, ClientOrder } from '../models'

export const orderService = {
  createOrder: async (data: CreateOrderData): Promise<ClientOrder> => {
    // TODO: Implement create order API call
    return Promise.resolve({
      id: '1',
      restaurantId: data.restaurantId,
      status: 'PENDING',
      items: [],
      totalAmount: 0,
      securityPin: '123456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  getMyOrders: async (): Promise<ClientOrder[]> => {
    // TODO: Implement get my orders API call
    return Promise.resolve([])
  },

  getOrderById: async (id: string): Promise<ClientOrder> => {
    // TODO: Implement get order by id API call
    return Promise.resolve({
      id,
      restaurantId: '1',
      status: 'PENDING',
      items: [],
      totalAmount: 0,
      securityPin: '123456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },

  cancelOrder: async (id: string): Promise<ClientOrder> => {
    // TODO: Implement cancel order API call
    return Promise.resolve({
      id,
      restaurantId: '1',
      status: 'CANCELLED',
      items: [],
      totalAmount: 0,
      securityPin: '123456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  },
}
