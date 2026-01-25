/**
 * Admin Activity Service
 * Aggregates recent activity for admin dashboard.
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import { ADMIN_ACTIVITY_TYPES, type AdminActivity, type Owner } from '../models'
import { ownerService } from './ownerService'

interface RestaurantPagePayload {
  content?: unknown
  totalPages?: number
}

interface RestaurantRecord {
  id?: string | number
  name?: string
  ownerName?: string
  ownerId?: string | number
  createdAt?: string
}

interface RestaurantSummary {
  id: string
  name: string
  ownerName: string
  ownerId: string
  createdAt: string
}

interface RestaurantPage {
  totalPages: number
  hasTotalPages: boolean
  restaurants: RestaurantSummary[]
}

const RESTAURANT_PAGE_SIZE = 200
const MAX_ACTIVITY_ITEMS = 8

const toRestaurantSummary = (value: unknown): RestaurantSummary | null => {
  if (!value || typeof value !== 'object') {
    return null
  }

  const record = value as RestaurantRecord
  if (record.id === undefined || record.id === null) {
    return null
  }

  return {
    id: String(record.id),
    name: record.name ?? 'Restaurante sin nombre',
    ownerName: record.ownerName ?? '',
    ownerId: record.ownerId !== undefined ? String(record.ownerId) : '',
    createdAt: record.createdAt ?? '',
  }
}

const parseRestaurantsPage = (data: unknown): RestaurantPage => {
  const pageData = data as RestaurantPagePayload
  const rawContent = Array.isArray(pageData?.content)
    ? pageData.content
    : Array.isArray(data)
      ? data
      : []

  const restaurants = rawContent
    .map(toRestaurantSummary)
    .filter((item): item is RestaurantSummary => item !== null)

  const hasTotalPages = typeof pageData?.totalPages === 'number'

  return {
    restaurants,
    totalPages:
      typeof pageData?.totalPages === 'number' ? pageData.totalPages : 0,
    hasTotalPages,
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
    } else if (current.restaurants.length < RESTAURANT_PAGE_SIZE) {
      break
    }

    page += 1
  }

  return restaurants
}

const formatOwnerName = (owner: Owner): string => {
  return `${owner.name} ${owner.surname}`.trim()
}

const buildOwnerActivity = (owner: Owner): AdminActivity => {
  return {
    id: `owner-${owner.id}`,
    type: ADMIN_ACTIVITY_TYPES.OWNER,
    title: 'Propietario creado',
    description: formatOwnerName(owner) || owner.email,
    createdAt: owner.createdAt ?? '',
  }
}

const buildRestaurantActivity = (
  restaurant: RestaurantSummary
): AdminActivity => {
  const ownerLabel = restaurant.ownerName
    ? `Propietario: ${restaurant.ownerName}`
    : restaurant.ownerId
      ? `Propietario ID: ${restaurant.ownerId}`
      : 'Propietario sin asignar'

  return {
    id: `restaurant-${restaurant.id}`,
    type: ADMIN_ACTIVITY_TYPES.RESTAURANT,
    title: 'Restaurante creado',
    description: `${restaurant.name} · ${ownerLabel}`,
    createdAt: restaurant.createdAt ?? '',
  }
}

const getTimestamp = (value: string): number => {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

export const adminActivityService = {
  getRecentActivity: async (
    limit: number = MAX_ACTIVITY_ITEMS
  ): Promise<AdminActivity[]> => {
    const [owners, restaurants] = await Promise.all([
      ownerService.getOwners(),
      fetchAllRestaurants(),
    ])

    const activities = [
      ...owners.map(buildOwnerActivity),
      ...restaurants.map(buildRestaurantActivity),
    ]

    return activities
      .sort(
        (left, right) =>
          getTimestamp(right.createdAt) - getTimestamp(left.createdAt)
      )
      .slice(0, limit)
  },
}
