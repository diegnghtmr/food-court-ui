import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { Dish } from '../models'

/**
 * Dish service for client module
 * Handles all dish-related API calls
 */
export const dishService = {
  /**
   * Get all active dishes by restaurant ID
   */
  getDishesByRestaurant: async (restaurantId: number): Promise<Dish[]> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/plazoleta/platos`,
      {
        params: {
          restauranteId: restaurantId,
          activo: true,
        },
      }
    )
    return response.data
  },
}
