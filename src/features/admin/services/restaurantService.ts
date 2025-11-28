import type { CreateRestaurantData, Restaurant } from '../models'

export const restaurantService = {
  createRestaurant: async (data: CreateRestaurantData): Promise<Restaurant> => {
    // TODO: Implement create restaurant API call
    return Promise.resolve({
      id: '1',
      name: data.name,
      address: data.address,
      phone: data.phone,
      urlLogo: data.urlLogo,
      nit: data.nit,
      ownerId: data.ownerId,
      createdAt: new Date().toISOString(),
    })
  },

  getRestaurants: async (): Promise<Restaurant[]> => {
    // TODO: Implement get restaurants API call
    return Promise.resolve([])
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
      ownerId: '1',
      createdAt: new Date().toISOString(),
    })
  },
}
