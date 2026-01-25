/**
 * Admin Stats Service
 * Aggregates stats for admin dashboard.
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { AdminStats } from '../models'
import { ownerService } from './ownerService'

interface RestaurantPagePayload {
  content?: unknown
  totalPages?: number
}

interface RestaurantRecord {
  id?: string | number
}

interface RestaurantSummary {
  id: string
}

interface RestaurantPage {
  totalPages: number
  hasTotalPages: boolean
  count: number
  restaurants: RestaurantSummary[]
}

interface DishPagePayload {
  content?: unknown
}

const RESTAURANT_PAGE_SIZE = 200
const DISH_PAGE_SIZE = 1

const toRestaurantId = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as RestaurantRecord
  if (record.id === undefined || record.id === null) {
    return null
  }

  return String(record.id)
}

const parseRestaurantsPage = (data: unknown): RestaurantPage => {
  const pageData = data as RestaurantPagePayload
  const rawContent = Array.isArray(pageData?.content)
    ? pageData.content
    : Array.isArray(data)
      ? data
      : []

  const restaurants = rawContent
    .map((item) => {
      const id = toRestaurantId(item)
      return id ? { id } : null
    })
    .filter((item): item is RestaurantSummary => item !== null)

  const hasTotalPages = typeof pageData?.totalPages === 'number'

  return {
    count: restaurants.length,
    totalPages:
      typeof pageData?.totalPages === 'number' ? pageData.totalPages : 0,
    hasTotalPages,
    restaurants,
  }
}

const fetchRestaurantsPage = async (page: number): Promise<RestaurantPage> => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PLAZOLETA}/restaurants`,
    {
      params: {
        page,
        size: RESTAURANT_PAGE_SIZE,
      },
    }
  )

  return parseRestaurantsPage(response.data)
}

const fetchAllRestaurants = async (): Promise<RestaurantSummary[]> => {
  let page = 0
  const restaurants: RestaurantSummary[] = []

  while (true) {
    const current = await fetchRestaurantsPage(page)
    restaurants.push(...current.restaurants)

    if (current.hasTotalPages) {
      if (page + 1 >= current.totalPages) {
        break
      }
    } else if (current.count < RESTAURANT_PAGE_SIZE) {
      break
    }

    page += 1
  }

  return restaurants
}

const parseDishCount = (data: unknown): number => {
  const payload = data as DishPagePayload
  const rawContent = Array.isArray(payload?.content)
    ? payload.content
    : Array.isArray(data)
      ? data
      : []

  return rawContent.length
}

const hasActiveDishes = async (restaurantId: string): Promise<boolean> => {
  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PLAZOLETA}/dishes/restaurant/${restaurantId}`,
    {
      params: {
        page: 0,
        size: DISH_PAGE_SIZE,
      },
    }
  )

  return parseDishCount(response.data) > 0
}

export const adminStatsService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const [owners, restaurants] = await Promise.all([
      ownerService.getOwners(),
      fetchAllRestaurants(),
    ])

    const activeFlags = await Promise.all(
      restaurants.map((restaurant) => hasActiveDishes(restaurant.id))
    )
    const activeRestaurants = activeFlags.filter(Boolean).length

    return {
      totalOwners: owners.length,
      totalRestaurants: restaurants.length,
      activeRestaurants,
    }
  },
}
