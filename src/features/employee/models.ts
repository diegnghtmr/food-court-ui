export interface Order {
  id: string
  clientId: string
  clientName?: string
  restaurantId: string
  status: string
  items: OrderItem[]
  totalAmount: number
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  dishId: string
  dishName: string
  quantity: number
  price: number
}

export interface UpdateOrderStatusData {
  orderId: string
  newStatus: string
  securityPin?: string
}

export interface OrdersByStatus {
  pending: Order[]
  preparing: Order[]
  ready: Order[]
  delivered: Order[]
}

export interface PinValidation {
  orderId: string
  pin: string
}
