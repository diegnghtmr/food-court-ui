import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { Order, PinValidationResponse } from '../models'
import { OrderStatus, isValidOrderStatus } from '@shared/types'

type DishInfo = { nombre: string; precio: number }
type DishMap = Map<number, DishInfo>
type UserInfo = { nombre: string; correo: string }

interface DishResponse {
  id: number | string
  name?: string
  price?: number
}

interface OrderDishResponse {
  dishId: number | string
  quantity: number
}

interface OrderResponse {
  id: number | string
  restaurantId: number | string
  dishes?: OrderDishResponse[]
  status?: string
  clientId?: number | string
  chefId?: number | string
  pin?: string
  date: string
}

const dishesCache: Map<number, DishMap> = new Map()
const userCache: Map<number, UserInfo> = new Map()

const fetchDishesByRestaurant = async (
  restaurantId: number
): Promise<DishMap> => {
  if (dishesCache.has(restaurantId)) {
    return dishesCache.get(restaurantId) as DishMap
  }

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PLAZOLETA}/dishes/restaurant/${restaurantId}`,
    { params: { page: 0, size: 200 } }
  )

  const raw = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.content)
      ? response.data.content
      : []

  const map: DishMap = new Map()
  const dishes: DishResponse[] = raw
  dishes.forEach((d) => {
    if (d?.id !== undefined && d?.id !== null) {
      map.set(Number(d.id), {
        nombre: d.name ?? `Plato ${d.id}`,
        precio: Number(d.price) || 0,
      })
    }
  })

  dishesCache.set(restaurantId, map)
  return map
}

const fetchUser = async (userId: number): Promise<UserInfo> => {
  if (userCache.has(userId)) {
    return userCache.get(userId) as UserInfo
  }

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.USUARIOS}/user/${userId}`
  )
  const data = response.data
  const info: UserInfo = {
    nombre: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
    correo: data.email ?? '',
  }
  userCache.set(userId, info)
  return info
}

const mapOrder = async (data: OrderResponse): Promise<Order> => {
  const restaurantId = Number(data.restaurantId ?? 0)
  const dishesMap = await fetchDishesByRestaurant(restaurantId)
  const clienteId = Number(data.clientId ?? 0)
  const userInfo = await fetchUser(clienteId)
  const orderId = String(data.id ?? '')

  const dishes = Array.isArray(data.dishes) ? data.dishes : []
  const items =
    dishes.map((dish) => {
      const dishId = Number(dish.dishId)
      const dishInfo = dishesMap.get(dishId)
      return {
        id: dishId,
        platoId: dishId,
        platoNombre: dishInfo?.nombre ?? `Plato ${dishId}`,
        cantidad: dish.quantity,
        precio: dishInfo?.precio ?? 0,
      }
    }) ?? []

  return {
    id: orderId,
    restauranteId: restaurantId,
    clienteId,
    clienteNombre: userInfo.nombre || `Cliente ${clienteId}`,
    clienteCorreo: userInfo.correo,
    items,
    estado: isValidOrderStatus(data.status ?? '')
      ? (data.status as OrderStatus)
      : OrderStatus.PENDIENTE,
    empleadoId: data.chefId ? String(data.chefId) : undefined,
    pin: data.pin,
    fechaCreacion: data.date,
  }
}

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
    const orders: OrderResponse[] = Array.isArray(content) ? content : []
    return Promise.all(orders.map((o) => mapOrder(o)))
  },

  /**
   * Assign order to employee (PENDIENTE -> EN_PREPARACION)
   * @param orderId - Order ID to assign
   * @param employeeId - Employee ID
   * @returns Updated order
   */
  assignOrderToEmployee: async (
    orderId: string,
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
  markOrderReady: async (orderId: string): Promise<Order> => {
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
    orderId: string,
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
