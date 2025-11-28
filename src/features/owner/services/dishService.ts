import type { Dish, CreateDishData, UpdateDishData } from '../models'

export const dishService = {
  createDish: async (data: CreateDishData): Promise<Dish> => {
    // TODO: Implement create dish API call
    return Promise.resolve({
      id: '1',
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      category: data.category,
      restaurantId: data.restaurantId,
      active: true,
      createdAt: new Date().toISOString(),
    })
  },

  updateDish: async (id: string, data: UpdateDishData): Promise<Dish> => {
    // TODO: Implement update dish API call
    return Promise.resolve({
      id,
      name: 'Mock Dish',
      description: data.description || 'Mock description',
      price: data.price || 0,
      imageUrl: 'https://example.com/dish.jpg',
      category: 'APPETIZER',
      restaurantId: '1',
      active: true,
      createdAt: new Date().toISOString(),
    })
  },

  toggleDishStatus: async (id: string): Promise<Dish> => {
    // TODO: Implement toggle dish status API call
    return Promise.resolve({
      id,
      name: 'Mock Dish',
      description: 'Mock description',
      price: 0,
      imageUrl: 'https://example.com/dish.jpg',
      category: 'APPETIZER',
      restaurantId: '1',
      active: false,
      createdAt: new Date().toISOString(),
    })
  },

  getDishes: async (_restaurantId: string): Promise<Dish[]> => {
    // TODO: Implement get dishes API call
    return Promise.resolve([])
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
      createdAt: new Date().toISOString(),
    })
  },
}
