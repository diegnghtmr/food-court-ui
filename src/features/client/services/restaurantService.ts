import type { Restaurant } from '../models'

export const restaurantService = {
  getRestaurants: async (
    _page: number = 0,
    _size: number = 10
  ): Promise<{ content: Restaurant[]; totalPages: number }> => {
    // TODO: Implement get restaurants API call with pagination
    return Promise.resolve({
      content: [],
      totalPages: 0,
    })
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    // TODO: Implement get restaurant by id API call
    return Promise.resolve({
      id,
      name: 'Mock Restaurant',
      address: '123 Main St',
      phone: '+1234567890',
      urlLogo: 'https://example.com/logo.png',
      nit: '123456789',
    })
  },

  searchRestaurants: async (_query: string): Promise<Restaurant[]> => {
    // TODO: Implement search restaurants API call
    return Promise.resolve([])
  },
}
