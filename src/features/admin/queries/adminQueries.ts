import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminStatsService } from '../services/adminStatsService'
import { adminActivityService } from '../services/adminActivityService'
import { ownerService } from '../services/ownerService'
import { restaurantService } from '../services/restaurantService'
import type { CreateOwnerData, CreateRestaurantData } from '../models'

const adminQueryKeys = {
  stats: ['admin', 'stats'] as const,
  activity: ['admin', 'activity'] as const,
} as const

export const useAdminStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.stats,
    queryFn: () => adminStatsService.getAdminStats(),
  })
}

export const useAdminActivity = () => {
  return useQuery({
    queryKey: adminQueryKeys.activity,
    queryFn: () => adminActivityService.getRecentActivity(),
  })
}

export const useCreateOwner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateOwnerData) => ownerService.createOwner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.activity })
    },
  })
}

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRestaurantData) =>
      restaurantService.createRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats })
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.activity })
    },
  })
}
