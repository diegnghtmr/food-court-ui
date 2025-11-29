/**
 * Restaurant Service (Admin)
 * API calls for restaurant management by admin
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { CreateRestaurantData, Restaurant } from '../models'

export const restaurantService = {
  /**
   * Create a new restaurant
   * @param data - Restaurant creation data
   * @returns Promise with created restaurant data
   */
  createRestaurant: async (data: CreateRestaurantData): Promise<Restaurant> => {
    // Map frontend fields to backend fields
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.PLAZOLETA}/restaurants`,
      {
        name: data.name,
        address: data.address,
        phone: data.phone,
        logoUrl: data.urlLogo,
        nit: data.nit,
        ownerId: Number(data.ownerId), // Convert to number
      }
    )

    // Map backend response to frontend model
    return {
      id: response.data.id?.toString() || '',
      name: response.data.name || data.name,
      address: response.data.address || data.address,
      phone: response.data.phone || data.phone,
      urlLogo: response.data.logoUrl || data.urlLogo,
      nit: response.data.nit || data.nit,
      ownerId: response.data.ownerId?.toString() || data.ownerId,
      ownerName: response.data.ownerName,
      createdAt: response.data.createdAt || new Date().toISOString(),
    }
  },

  /**
   * Get all restaurants (paginated)
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Promise with array of restaurants
   */
  getRestaurants: async (
    page: number = 0,
    size: number = 10
  ): Promise<Restaurant[]> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/restaurants`,
      {
        params: { page, size },
      }
    )

    // Backend might return paginated response
    const data = response.data.content || response.data

    // Map backend array to frontend models
    return data.map((restaurant: any) => ({
      id: restaurant.id?.toString() || '',
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      urlLogo: restaurant.logoUrl,
      nit: restaurant.nit,
      ownerId: restaurant.ownerId?.toString() || '',
      ownerName: restaurant.ownerName,
      createdAt: restaurant.createdAt,
    }))
  },

  /**
   * Get restaurant by ID
   * @param id - Restaurant ID
   * @returns Promise with restaurant data
   */
  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.PLAZOLETA}/restaurants/${id}`
    )

    // Map backend response to frontend model
    return {
      id: response.data.id?.toString() || id,
      name: response.data.name,
      address: response.data.address,
      phone: response.data.phone,
      urlLogo: response.data.logoUrl,
      nit: response.data.nit,
      ownerId: response.data.ownerId?.toString() || '',
      ownerName: response.data.ownerName,
      createdAt: response.data.createdAt,
    }
  },
}
