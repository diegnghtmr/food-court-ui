import type { Dish } from '../models'

export const dishService = {
  getDishesByRestaurant: async (
    _restaurantId: string,
    _page: number = 0,
    _size: number = 10,
    _category?: string
  ): Promise<{ content: Dish[]; totalPages: number }> => {
    // TODO: Implement get dishes by restaurant API call with pagination and filter
    return Promise.resolve({
      content: [],
      totalPages: 0,
    })
  },

  getDishById: async (id: string): Promise<Dish> => {
    // TODO: Implement get dish by id API call
    return Promise.resolve({
      id,
      name: 'Mock Dish',
      description: 'Mock description',
      price: 0,
      imageUrl: 'https://example.com/dish.jpg',
      category: 'APPETIZER',
      restaurantId: '1',
      active: true,
    })
  },

  searchDishes: async (
    _restaurantId: string,
    _query: string
  ): Promise<Dish[]> => {
    // TODO: Implement search dishes API call
    return Promise.resolve([])
  },
}
