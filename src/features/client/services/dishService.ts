import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { Dish } from '../models'
import { DishCategory, isValidDishCategory } from '@shared/types'

interface DishResponse {
  id: number
  name: string
  price: number
  description: string
  urlImage: string
  categoryName?: string
  active?: boolean
  restaurantId: number
}

const mapDish = (data: DishResponse): Dish => {
  const normalizedCategory =
    typeof data.categoryName === 'string'
      ? data.categoryName.toUpperCase().replace(/\s+/g, '_')
      : ''

  const categoria = isValidDishCategory(normalizedCategory)
    ? (normalizedCategory as DishCategory)
    : DishCategory.PLATO_FUERTE

  return {
    id: data.id,
    nombre: data.name,
    precio: Number(data.price),
    descripcion: data.description,
    urlImagen: data.urlImage,
    categoria,
    activo: Boolean(data.active),
    restauranteId: data.restaurantId,
  }
}

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
      `${API_ENDPOINTS.PLAZOLETA}/dishes/restaurant/${restaurantId}`,
      { params: { page: 0, size: 50 } }
    )
    const data = response.data
    const items = Array.isArray(data) ? data : (data?.content ?? [])
    return items.map(mapDish)
  },
}
