import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { Restaurant, PaginatedResponse } from '../models'

interface RestaurantResponse {
  id: number
  name: string
  nit: string
  address: string
  phone: string
  urlLogo: string
  ownerId: number
}

const mapRestaurant = (data: RestaurantResponse): Restaurant => ({
  id: data.id,
  nombre: data.name,
  nit: data.nit,
  direccion: data.address,
  telefono: data.phone,
  urlLogo: data.urlLogo,
  idPropietario: data.ownerId,
})

/**
 * Restaurant service for client module
 * Handles all restaurant-related API calls
 */
export const restaurantService = {
  /**
   * Get paginated list of restaurants
   */
  getRestaurants: async (
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Restaurant>> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/restaurants`,
      {
        params: { page, size },
      }
    )
    const data = response.data
    if (Array.isArray(data)) {
      const content = data.map(mapRestaurant)
      return {
        content,
        totalPages: 1,
        totalElements: content.length,
        size: size,
        number: page,
      }
    }

    const content = Array.isArray(data?.content)
      ? data.content.map(mapRestaurant)
      : []

    return {
      content,
      totalPages: data?.totalPages ?? 1,
      totalElements: data?.totalElements ?? content.length,
      size: data?.size ?? size,
      number: data?.number ?? page,
    }
  },

  /**
   * Get restaurant by ID
   */
  getRestaurantById: async (id: number): Promise<Restaurant> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/restaurants`,
      { params: { page: 0, size: 100 } }
    )
    const data = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.content)
        ? response.data.content
        : []

    const restaurant = (data as RestaurantResponse[]).find(
      (item) => item.id === id
    )
    if (!restaurant) {
      throw new Error('Restaurante no encontrado')
    }

    return mapRestaurant(restaurant)
  },
}
