import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { restaurantService } from '../services/restaurantService'
import { dishService } from '../services/dishService'
import { orderService } from '../services/orderService'
import type { CreateOrderData } from '../models'

const clientQueryKeys = {
  restaurants: (page: number, size: number) =>
    ['client', 'restaurants', page, size] as const,
  restaurant: (restaurantId: number) =>
    ['client', 'restaurant', restaurantId] as const,
  dishes: (restaurantId: number) =>
    ['client', 'dishes', restaurantId] as const,
  orders: ['client', 'orders'] as const,
} as const

export const useRestaurants = (page: number, size: number) => {
  return useQuery({
    queryKey: clientQueryKeys.restaurants(page, size),
    queryFn: () => restaurantService.getRestaurants(page, size),
  })
}

export const useRestaurant = (restaurantId: number) => {
  return useQuery({
    queryKey: clientQueryKeys.restaurant(restaurantId),
    queryFn: () => restaurantService.getRestaurantById(restaurantId),
    enabled: Number.isFinite(restaurantId) && restaurantId > 0,
  })
}

export const useDishesByRestaurant = (restaurantId: number) => {
  return useQuery({
    queryKey: clientQueryKeys.dishes(restaurantId),
    queryFn: () => dishService.getDishesByRestaurant(restaurantId),
    enabled: Number.isFinite(restaurantId) && restaurantId > 0,
  })
}

export const useMyOrders = () => {
  return useQuery({
    queryKey: clientQueryKeys.orders,
    queryFn: () => orderService.getMyOrders(),
    refetchInterval: 10000,
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.orders })
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientQueryKeys.orders })
    },
  })
}
