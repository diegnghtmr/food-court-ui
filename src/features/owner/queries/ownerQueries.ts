import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ownerStatsService } from '../services/ownerStatsService'
import { analyticsService } from '../services/analyticsService'
import { dishService } from '../services/dishService'
import { employeeService } from '../services/employeeService'
import type {
  CreateDishData,
  UpdateDishData,
  CreateEmployeeData,
} from '../models'
import type { EfficiencyReport } from '../models'

const ownerQueryKeys = {
  stats: (restaurantId: string) => ['owner', 'stats', restaurantId] as const,
  dishes: (restaurantId: string, page: number, size: number) =>
    ['owner', 'dishes', restaurantId, page, size] as const,
  dish: (dishId: string) => ['owner', 'dish', dishId] as const,
  efficiency: (restaurantId: string, startDate?: string, endDate?: string) => [
    'owner',
    'efficiency',
    restaurantId,
    startDate ?? '',
    endDate ?? '',
  ],
} as const

export const useOwnerStats = (restaurantId: string) => {
  return useQuery({
    queryKey: ownerQueryKeys.stats(restaurantId),
    queryFn: () => ownerStatsService.getOwnerStats(restaurantId),
    enabled: Boolean(restaurantId),
  })
}

export const useOwnerDishes = (
  restaurantId: string,
  page: number,
  size: number
) => {
  return useQuery({
    queryKey: ownerQueryKeys.dishes(restaurantId, page, size),
    queryFn: () => dishService.getDishes(restaurantId, page, size),
    enabled: Boolean(restaurantId),
  })
}

export const useDishById = (dishId: string) => {
  return useQuery({
    queryKey: ownerQueryKeys.dish(dishId),
    queryFn: () => dishService.getDishById(dishId),
    enabled: Boolean(dishId),
  })
}

export const useEfficiencyReport = (
  restaurantId: string,
  startDate?: string,
  endDate?: string
) => {
  return useQuery<EfficiencyReport[]>({
    queryKey: ownerQueryKeys.efficiency(restaurantId, startDate, endDate),
    queryFn: () =>
      analyticsService.getEfficiencyReport(restaurantId, startDate, endDate),
    enabled: Boolean(restaurantId),
  })
}

export const useExportEfficiencyReport = () => {
  return useMutation({
    mutationFn: (payload: {
      restaurantId: string
      startDate?: string
      endDate?: string
    }) =>
      analyticsService.exportEfficiencyReport(
        payload.restaurantId,
        payload.startDate,
        payload.endDate
      ),
  })
}

export const useCreateDish = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDishData) => dishService.createDish(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['owner', 'dishes', variables.restaurantId],
      })
    },
  })
}

export const useUpdateDish = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateDishData }) =>
      dishService.updateDish(payload.id, payload.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ownerQueryKeys.dish(data.id),
      })
      if (data.restaurantId) {
        queryClient.invalidateQueries({
          queryKey: ['owner', 'dishes', data.restaurantId],
        })
      }
    },
  })
}

export const useToggleDishStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dishId: string) => dishService.toggleDishStatus(dishId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ownerQueryKeys.dish(data.id) })
      if (data.restaurantId) {
        queryClient.invalidateQueries({
          queryKey: ['owner', 'dishes', data.restaurantId],
        })
      }
    },
  })
}

export const useCreateEmployee = () => {
  return useMutation({
    mutationFn: (data: CreateEmployeeData) =>
      employeeService.createEmployee(data),
  })
}
