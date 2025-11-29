import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { Restaurant, PaginatedResponse } from '../models'

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
      `${API_ENDPOINTS.PLAZOLETA}/plazoleta/restaurantes`,
      {
        params: { page, size },
      }
    )
    return response.data
  },

  /**
   * Get restaurant by ID
   */
  getRestaurantById: async (id: number): Promise<Restaurant> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/plazoleta/restaurantes/${id}`
    )
    return response.data
  },
}
