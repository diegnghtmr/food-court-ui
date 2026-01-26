import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderManagementService } from '../services/orderManagementService'
import { OrderStatus } from '@shared/types'

const employeeQueryKeys = {
  orders: (restaurantId: number, status: OrderStatus) =>
    ['employee', 'orders', restaurantId, status] as const,
} as const

export const useOrdersByStatus = (restaurantId: number, status: OrderStatus) => {
  return useQuery({
    queryKey: employeeQueryKeys.orders(restaurantId, status),
    queryFn: () => orderManagementService.getOrdersByStatus(restaurantId, status),
    enabled: Number.isFinite(restaurantId) && restaurantId > 0,
    refetchInterval: 10000,
  })
}

export const useAssignOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      orderId: string
      employeeId: number
      restaurantId: number
    }) =>
      orderManagementService.assignOrderToEmployee(
        payload.orderId,
        payload.employeeId
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['employee', 'orders', variables.restaurantId],
      })
      queryClient.invalidateQueries({ queryKey: ['employee', 'orders'] })
    },
  })
}

export const useMarkOrderReady = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => orderManagementService.markOrderReady(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'orders'] })
    },
  })
}

export const useDeliverOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { orderId: string; pin: string }) =>
      orderManagementService.deliverOrder(payload.orderId, payload.pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'orders'] })
    },
  })
}
