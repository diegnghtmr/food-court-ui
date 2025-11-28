export interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  urlLogo: string
  nit: string
}

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  restaurantId: string
  active: boolean
}

export interface CartItem {
  dishId: string
  dishName: string
  price: number
  quantity: number
  restaurantId: string
}

export interface CreateOrderData {
  restaurantId: string
  items: {
    dishId: string
    quantity: number
  }[]
}

export interface ClientOrder {
  id: string
  restaurantId: string
  restaurantName?: string
  status: string
  items: {
    dishId: string
    dishName: string
    quantity: number
    price: number
  }[]
  totalAmount: number
  securityPin: string
  createdAt: string
  updatedAt: string
}

export interface OrderNotification {
  orderId: string
  status: string
  message: string
  timestamp: string
}
