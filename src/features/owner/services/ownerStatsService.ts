/**
 * Owner Stats Service
 * Aggregates stats for owner dashboard.
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { OrderStatus } from '@shared/types'
import type { OwnerStats } from '../models'
import { dishService } from './dishService'
import { employeeService } from './employeeService'

interface OrderResponse {
  id?: string | number
  date?: string
}

interface OrdersPagePayload {
  content?: unknown
  totalPages?: number
  totalElements?: number
}

interface OrderRecord {
  id?: string | number
  date?: string
}

interface OrdersPage {
  content: OrderResponse[]
  totalPages: number
  totalElements: number
}

const DISH_PAGE_SIZE = 200
const ORDER_PAGE_SIZE = 200

const ORDER_STATUSES = [
  OrderStatus.PENDIENTE,
  OrderStatus.EN_PREPARACION,
  OrderStatus.LISTO,
  OrderStatus.ENTREGADO,
  OrderStatus.CANCELADO,
] as const

const toOrderResponse = (value: unknown): OrderResponse => {
  if (!value || typeof value !== 'object') {
    return {}
  }

  const record = value as OrderRecord
  return {
    id: record.id,
    date: record.date,
  }
}

const parseOrdersPage = (data: unknown): OrdersPage => {
  const pageData = data as OrdersPagePayload

  const rawContent = Array.isArray(pageData?.content)
    ? pageData.content
    : Array.isArray(data)
      ? data
      : []

  const content = rawContent.map(toOrderResponse)
  const totalPages =
    typeof pageData?.totalPages === 'number' ? pageData.totalPages : 1
  const totalElements =
    typeof pageData?.totalElements === 'number'
      ? pageData.totalElements
      : content.length

  return {
    content,
    totalPages,
    totalElements,
  }
}

const fetchOrdersPage = async (
  status: OrderStatus,
  page: number
): Promise<OrdersPage> => {
  const response = await axiosInstance.get(`${API_ENDPOINTS.PEDIDOS}/orders`, {
    params: {
      status,
      page,
      size: ORDER_PAGE_SIZE,
    },
  })

  return parseOrdersPage(response.data)
}

const fetchAllOrdersByStatus = async (
  status: OrderStatus
): Promise<OrderResponse[]> => {
  const firstPage = await fetchOrdersPage(status, 0)
  if (firstPage.totalPages <= 1) {
    return firstPage.content
  }

  const pageRequests: Promise<OrdersPage>[] = []
  for (let page = 1; page < firstPage.totalPages; page += 1) {
    pageRequests.push(fetchOrdersPage(status, page))
  }

  const pages = await Promise.all(pageRequests)
  return [...firstPage.content, ...pages.flatMap((page) => page.content)]
}

const isSameDay = (left: Date, right: Date): boolean => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

const isOrderToday = (dateString?: string): boolean => {
  if (!dateString) return false
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return false
  return isSameDay(date, new Date())
}

export const ownerStatsService = {
  getOwnerStats: async (restaurantId: string): Promise<OwnerStats> => {
    const [dishes, employees, ordersByStatus] = await Promise.all([
      (async () => {
        const firstPage = await dishService.getDishes(
          restaurantId,
          0,
          DISH_PAGE_SIZE
        )
        if (firstPage.totalPages <= 1) {
          return firstPage.content
        }

        const pageRequests = Array.from(
          { length: firstPage.totalPages - 1 },
          (_, index) =>
            dishService.getDishes(restaurantId, index + 1, DISH_PAGE_SIZE)
        )
        const pages = await Promise.all(pageRequests)
        return [...firstPage.content, ...pages.flatMap((page) => page.content)]
      })(),
      employeeService.getEmployees(restaurantId),
      (async () => {
        const orders = await Promise.all(
          ORDER_STATUSES.map((status) => fetchAllOrdersByStatus(status))
        )
        const uniqueOrders = new Map<string, OrderResponse>()
        orders.flat().forEach((order) => {
          if (order.id === undefined || order.id === null) return
          uniqueOrders.set(String(order.id), order)
        })
        return Array.from(uniqueOrders.values())
      })(),
    ])

    const activeDishes = dishes.filter((dish) => dish.active).length
    const ordersToday = ordersByStatus.filter((order) =>
      isOrderToday(order.date)
    ).length

    return {
      totalDishes: dishes.length,
      activeDishes,
      totalEmployees: employees.length,
      ordersToday,
    }
  },
}
