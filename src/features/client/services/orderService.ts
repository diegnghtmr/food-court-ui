import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { getUserId } from '@infrastructure/auth/tokenManager'
import type { CreateOrderData, ClientOrder } from '../models'
import { OrderStatus, isValidOrderStatus } from '@shared/types'

type RestaurantMap = Map<number, { nombre: string }>
type DishInfo = { nombre: string; precio: number }
type DishMap = Map<number, DishInfo>

interface RestaurantResponse {
  id: number | string
  name?: string
}

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
  pin?: string
  date: string
}

interface TraceResponse {
  orderId: number | string
  newState?: string
}

const restaurantCache: RestaurantMap = new Map()
const dishesCache: Map<number, DishMap> = new Map()

const mapOrderStatus = (status: string | undefined): OrderStatus => {
  if (status && isValidOrderStatus(status)) {
    return status
  }
  return OrderStatus.PENDIENTE
}

const fetchRestaurants = async (): Promise<RestaurantMap> => {
  if (restaurantCache.size > 0) return restaurantCache

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PLAZOLETA}/restaurants`,
    { params: { page: 0, size: 200 } }
  )

  const raw = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.content)
      ? response.data.content
      : []

  const restaurants: RestaurantResponse[] = raw
  restaurants.forEach((r) => {
    if (r?.id !== undefined && r?.id !== null) {
      restaurantCache.set(Number(r.id), {
        nombre: r.name ?? `Restaurante ${r.id}`,
      })
    }
  })

  return restaurantCache
}

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

const mapOrderResponse = async (
  data: OrderResponse,
  fallbackStatus?: OrderStatus
): Promise<ClientOrder> => {
  const restaurants = await fetchRestaurants()
  const restaurantId = Number(data.restaurantId ?? 0)
  const dishesMap = await fetchDishesByRestaurant(restaurantId)
  const orderId = String(data.id)

  const dishes = Array.isArray(data.dishes) ? data.dishes : []
  const items =
    dishes.map((dish) => {
      const dishId = Number(dish.dishId)
      const dishInfo = dishesMap.get(dishId)
      return {
        platoNombre: dishInfo?.nombre ?? `Plato ${dishId}`,
        cantidad: dish.quantity,
        precio: dishInfo?.precio ?? 0,
      }
    }) ?? []

  const total = items.reduce(
    (sum: number, item) => sum + item.precio * item.cantidad,
    0
  )

  return {
    id: orderId,
    restauranteId: restaurantId,
    restauranteNombre:
      restaurants.get(restaurantId)?.nombre ?? `Restaurante ${restaurantId}`,
    items,
    total,
    estado: mapOrderStatus(data.status ?? fallbackStatus),
    pin: data.pin ?? undefined,
    fechaCreacion: data.date,
  }
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

    return mapOrderResponse(response.data)
  },

  /**
   * Get all orders/traces for the authenticated client
   */
  getMyOrders: async (): Promise<ClientOrder[]> => {
    const clientId = getUserId()
    if (!clientId) {
      throw new Error('User not authenticated')
    }
    const traceResponse = await axiosInstance.get(
      `${API_ENDPOINTS.TRAZABILIDAD}/trace/client/${clientId}`
    )

    const traces: TraceResponse[] = Array.isArray(traceResponse.data)
      ? traceResponse.data
      : []

    if (traces.length === 0) {
      return []
    }

    const latestStatusByOrder: Map<string, OrderStatus> = new Map()
    traces.forEach((t) => {
      const orderId = String(t.orderId)
      const status = mapOrderStatus(t.newState)
      latestStatusByOrder.set(orderId, status)
    })

    const orderIds = Array.from(new Set(traces.map((t) => String(t.orderId))))

    const ordersDetails = await Promise.all(
      orderIds.map(async (id) => {
        try {
          const res = await axiosInstance.get(
            `${API_ENDPOINTS.PEDIDOS}/orders/${id}`
          )
          return res.data
        } catch (err) {
          console.error(`No se pudo obtener el pedido ${id}`, err)
          return null
        }
      })
    )

    const mappedOrders: ClientOrder[] = []
    for (const detail of ordersDetails) {
      if (!detail) continue
      const orderId = String(detail.id)
      const fallbackStatus = latestStatusByOrder.get(orderId)
      mappedOrders.push(await mapOrderResponse(detail, fallbackStatus))
    }

    return mappedOrders.sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    )
  },

  /**
   * Cancel a pending order
   */
  cancelOrder: async (orderId: string): Promise<void> => {
    await axiosInstance.patch(
      `${API_ENDPOINTS.PEDIDOS}/orders/cancel/${orderId}`
    )
  },

  /**
   * Get PIN for a ready order
   */
  getOrderPin: async (orderId: number): Promise<string> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PEDIDOS}/orders/${orderId}`
    )
    if (response.data?.pin) {
      return response.data.pin
    }
    throw new Error('El endpoint de PIN no esta disponible')
  },
}
