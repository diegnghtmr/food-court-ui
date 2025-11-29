/**
 * Dish Service (Owner)
 * API calls for dish management by restaurant owner
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { Dish, CreateDishData, UpdateDishData } from '../models'

/**
 * Paginated response from backend
 */
interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export const dishService = {
  /**
   * Create a new dish
   * @param data - Dish creation data
   * @returns Promise with created dish data
   */
  createDish: async (data: CreateDishData): Promise<Dish> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PLAZOLETA}/dishes`,
      {
        name: data.name,
        description: data.description,
        price: data.price,
        imageUrl: data.imageUrl,
        category: data.category,
        restaurantId: Number(data.restaurantId),
      }
    )

    return {
      id: response.data.id?.toString() || '',
      name: response.data.name || data.name,
      description: response.data.description || data.description,
      price: response.data.price || data.price,
      imageUrl: response.data.imageUrl || data.imageUrl,
      category: response.data.category || data.category,
      restaurantId: response.data.restaurantId?.toString() || data.restaurantId,
      active: response.data.active !== undefined ? response.data.active : true,
      createdAt: response.data.createdAt || new Date().toISOString(),
    }
  },

  /**
   * Update dish (only description and price can be updated)
   * @param id - Dish ID
   * @param data - Update data
   * @returns Promise with updated dish
   */
  updateDish: async (id: string, data: UpdateDishData): Promise<Dish> => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PLAZOLETA}/dishes/${id}`,
      {
        description: data.description,
        price: data.price,
      }
    )

    return {
      id: response.data.id?.toString() || id,
      name: response.data.name,
      description: response.data.description,
      price: response.data.price,
      imageUrl: response.data.imageUrl,
      category: response.data.category,
      restaurantId: response.data.restaurantId?.toString() || '',
      active: response.data.active,
      createdAt: response.data.createdAt,
    }
  },

  /**
   * Toggle dish active status (activate/deactivate)
   * @param id - Dish ID
   * @returns Promise with updated dish
   */
  toggleDishStatus: async (id: string): Promise<Dish> => {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.PLAZOLETA}/dishes/${id}/status`
    )

    return {
      id: response.data.id?.toString() || id,
      name: response.data.name,
      description: response.data.description,
      price: response.data.price,
      imageUrl: response.data.imageUrl,
      category: response.data.category,
      restaurantId: response.data.restaurantId?.toString() || '',
      active: response.data.active,
      createdAt: response.data.createdAt,
    }
  },

  /**
   * Get all dishes for a restaurant (paginated)
   * @param restaurantId - Restaurant ID
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Promise with paginated response of dishes
   */
  getDishes: async (
    restaurantId: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Dish>> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/dishes/restaurant/${restaurantId}`,
      {
        params: { page, size },
      }
    )

    // Backend might return paginated response
    const content = response.data.content || response.data
    const dishes = Array.isArray(content) ? content : []

    const mappedDishes = dishes.map((dish: any) => ({
      id: dish.id?.toString() || '',
      name: dish.name,
      description: dish.description,
      price: dish.price,
      imageUrl: dish.imageUrl,
      category: dish.category,
      restaurantId: dish.restaurantId?.toString() || restaurantId,
      active: dish.active,
      createdAt: dish.createdAt,
    }))

    return {
      content: mappedDishes,
      totalPages: response.data.totalPages || Math.ceil(mappedDishes.length / size),
      totalElements: response.data.totalElements || mappedDishes.length,
      number: response.data.number ?? page,
      size: response.data.size ?? size,
    }
  },

  /**
   * Get dish by ID
   * @param id - Dish ID
   * @returns Promise with dish data
   */
  getDishById: async (id: string): Promise<Dish> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/dishes/${id}`
    )

    return {
      id: response.data.id?.toString() || id,
      name: response.data.name,
      description: response.data.description,
      price: response.data.price,
      imageUrl: response.data.imageUrl,
      category: response.data.category,
      restaurantId: response.data.restaurantId?.toString() || '',
      active: response.data.active,
      createdAt: response.data.createdAt,
    }
  },
}
