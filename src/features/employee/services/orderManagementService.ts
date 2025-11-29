import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { Order, PinValidationResponse } from '../models'
import { OrderStatus, isValidOrderStatus } from '@shared/types'

type DishInfo = { nombre: string; precio: number }
type DishMap = Map<number, DishInfo>
type UserInfo = { nombre: string; correo: string }

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
  raw.forEach((d: any) => {
    if (d?.id) {
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

const mapOrder = async (data: any): Promise<Order> => {
  const restaurantId = Number(data.restaurantId)
  const dishesMap = await fetchDishesByRestaurant(restaurantId)
  const clienteId = Number(data.clientId)
  const userInfo = await fetchUser(clienteId)

  const items =
    (data.dishes ?? []).map((dish: any) => {
      const dishInfo = dishesMap.get(Number(dish.dishId))
      return {
        id: dish.dishId,
        platoId: dish.dishId,
        platoNombre: dishInfo?.nombre ?? `Plato ${dish.dishId}`,
        cantidad: dish.quantity,
        precio: dishInfo?.precio ?? 0,
      }
    }) ?? []

  return {
    id: Number(data.id),
    restauranteId: restaurantId,
    clienteId,
    clienteNombre: userInfo.nombre || `Cliente ${clienteId}`,
    clienteCorreo: userInfo.correo,
    items,
    estado: isValidOrderStatus(data.status)
      ? (data.status as OrderStatus)
      : OrderStatus.PENDIENTE,
    empleadoId: data.chefId ?? undefined,
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
    const orders = content ?? []
    return Promise.all(orders.map((o: any) => mapOrder(o)))
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
