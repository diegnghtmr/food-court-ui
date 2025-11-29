/**
 * DishService Tests
 * Unit tests for dish management service API calls
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { dishService } from './dishService'
import axiosInstance from '@infrastructure/api/axiosInstance'

// Mock axios
vi.mock('@infrastructure/api/axiosInstance')

describe('dishService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createDish', () => {
    it('should create a new dish successfully', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Hamburguesa',
          description: 'Hamburguesa con queso',
          price: 15000,
          imageUrl: 'https://example.com/burger.jpg',
          category: 'PLATO_FUERTE',
          restaurantId: 1,
          active: true,
          createdAt: '2025-01-01T00:00:00Z',
        },
      }

      vi.mocked(axiosInstance.post).mockResolvedValue(mockResponse)

      const dishData = {
        name: 'Hamburguesa',
        description: 'Hamburguesa con queso',
        price: 15000,
        imageUrl: 'https://example.com/burger.jpg',
        category: 'PLATO_FUERTE',
        restaurantId: '1',
      }

      const result = await dishService.createDish(dishData)

      expect(axiosInstance.post).toHaveBeenCalledWith(
        expect.stringContaining('/dishes'),
        {
          name: dishData.name,
          description: dishData.description,
          price: dishData.price,
          imageUrl: dishData.imageUrl,
          category: dishData.category,
          restaurantId: 1,
        }
      )
      expect(result.id).toBe('1')
      expect(result.name).toBe('Hamburguesa')
    })
  })

  describe('updateDish', () => {
    it('should update dish description and price only', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Hamburguesa',
          description: 'Nueva descripción',
          price: 18000,
          imageUrl: 'https://example.com/burger.jpg',
          category: 'PLATO_FUERTE',
          restaurantId: 1,
          active: true,
          createdAt: '2025-01-01T00:00:00Z',
        },
      }

      vi.mocked(axiosInstance.patch).mockResolvedValue(mockResponse)

      const updateData = {
        description: 'Nueva descripción',
        price: 18000,
      }

      const result = await dishService.updateDish('1', updateData)

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        expect.stringContaining('/dishes/1'),
        updateData
      )
      expect(result.description).toBe('Nueva descripción')
      expect(result.price).toBe(18000)
    })
  })

  describe('toggleDishStatus', () => {
    it('should toggle dish active status', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'Hamburguesa',
          description: 'Hamburguesa con queso',
          price: 15000,
          imageUrl: 'https://example.com/burger.jpg',
          category: 'PLATO_FUERTE',
          restaurantId: 1,
          active: false,
          createdAt: '2025-01-01T00:00:00Z',
        },
      }

      vi.mocked(axiosInstance.patch).mockResolvedValue(mockResponse)

      const result = await dishService.toggleDishStatus('1')

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        expect.stringContaining('/dishes/1/status')
      )
      expect(result.active).toBe(false)
    })
  })

  describe('getDishes', () => {
    it('should fetch paginated dishes for a restaurant', async () => {
      const mockResponse = {
        data: {
          content: [
            {
              id: 1,
              name: 'Hamburguesa',
              description: 'Deliciosa hamburguesa',
              price: 15000,
              imageUrl: 'https://example.com/burger.jpg',
              category: 'PLATO_FUERTE',
              restaurantId: 1,
              active: true,
              createdAt: '2025-01-01T00:00:00Z',
            },
          ],
          totalPages: 1,
          totalElements: 1,
          number: 0,
          size: 10,
        },
      }

      vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse)

      const result = await dishService.getDishes('1', 0, 10)

      expect(axiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/dishes/restaurant/1'),
        { params: { page: 0, size: 10 } }
      )
      expect(result.content).toHaveLength(1)
      expect(result.totalPages).toBe(1)
    })
  })
})
