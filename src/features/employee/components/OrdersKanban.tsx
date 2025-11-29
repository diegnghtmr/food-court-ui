import React, { useState, useEffect, useCallback } from 'react'
import { LoadingSpinner } from '@shared/components'
import { useAuth } from '@infrastructure/auth'
import { Order, OrdersByStatus } from '../models'
import { OrderStatus } from '@shared/types'
import { orderManagementService } from '../services/orderManagementService'
import { OrderCard } from './OrderCard'
import { PinValidationModal } from './PinValidationModal'
import { getRestaurantId } from '@infrastructure/auth/tokenManager'

/**
 * Orders Kanban Board Component
 * Main component for employee order management with real-time polling
 *
 * Features:
 * - 4-column Kanban layout (PENDIENTE, EN_PREPARACION, LISTO, ENTREGADO)
 * - Automatic polling every 10 seconds
 * - Order state transitions: PENDIENTE -> EN_PREPARACION -> LISTO -> ENTREGADO
 * - PIN validation for order delivery
 * - Filters EN_PREPARACION orders by current employee
 */
export const OrdersKanban: React.FC = () => {
  const { userId } = useAuth()
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus>({
    PENDIENTE: [],
    EN_PREPARACION: [],
    LISTO: [],
    ENTREGADO: [],
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null)

  const restaurantId = getRestaurantId()

  /**
   * Fetch all orders for all statuses
   */
  const fetchOrders = useCallback(async () => {
    try {
      if (!restaurantId) {
        setIsLoading(false)
        console.error('Restaurant ID no disponible para el empleado')
        return
      }

      const [pendiente, enPreparacion, listo, entregado] = await Promise.all([
        orderManagementService.getOrdersByStatus(
          restaurantId,
          OrderStatus.PENDIENTE
        ),
        orderManagementService.getOrdersByStatus(
          restaurantId,
          OrderStatus.EN_PREPARACION
        ),
        orderManagementService.getOrdersByStatus(
          restaurantId,
          OrderStatus.LISTO
        ),
        orderManagementService.getOrdersByStatus(
          restaurantId,
          OrderStatus.ENTREGADO
        ),
      ])

      setOrdersByStatus({
        PENDIENTE: pendiente,
        EN_PREPARACION: enPreparacion,
        LISTO: listo,
        ENTREGADO: entregado,
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }, [restaurantId])

  /**
   * Initial load and polling setup
   * Polls every 10 seconds for real-time updates
   */
  useEffect(() => {
    fetchOrders()

    const interval = setInterval(() => {
      fetchOrders()
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [fetchOrders])

  /**
   * Assign order to employee (PENDIENTE -> EN_PREPARACION)
   */
  const handleAssignOrder = async (orderId: number) => {
    if (!userId) return

    setLoadingOrderId(orderId)
    try {
      await orderManagementService.assignOrderToEmployee(
        orderId,
        Number(userId)
      )
      await fetchOrders()
    } catch (error) {
      console.error('Error assigning order:', error)
    } finally {
      setLoadingOrderId(null)
    }
  }

  /**
   * Mark order as ready (EN_PREPARACION -> LISTO)
   */
  const handleMarkReady = async (orderId: number) => {
    setLoadingOrderId(orderId)
    try {
      await orderManagementService.markOrderReady(orderId)
      await fetchOrders()
    } catch (error) {
      console.error('Error marking order as ready:', error)
    } finally {
      setLoadingOrderId(null)
    }
  }

  /**
   * Initiate order delivery (opens PIN validation modal)
   */
  const handleDeliverOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsPinModalOpen(true)
  }

  /**
   * Handle PIN validation for order delivery
   * Returns true if PIN is valid, false otherwise
   */
  const handlePinValidation = async (pin: string): Promise<boolean> => {
    if (!selectedOrder) return false

    try {
      const result = await orderManagementService.deliverOrder(
        selectedOrder.id,
        pin
      )

      if (result.valido) {
        // Close modal and refresh orders
        setIsPinModalOpen(false)
        setSelectedOrder(null)
        await fetchOrders()
        return true
      }

      return false
    } catch (error) {
      console.error('Error validating PIN:', error)
      return false
    }
  }

  /**
   * Handle action based on order status
   */
  const handleOrderAction = (
    orderId: number,
    action: 'assign' | 'ready' | 'deliver'
  ) => {
    if (action === 'assign') {
      handleAssignOrder(orderId)
    } else if (action === 'ready') {
      handleMarkReady(orderId)
    } else if (action === 'deliver') {
      const order = ordersByStatus.LISTO.find((o) => o.id === orderId)
      if (order) {
        handleDeliverOrder(order)
      }
    }
  }

  /**
   * Filter EN_PREPARACION orders by current employee
   */
  const myPreparingOrders = ordersByStatus.EN_PREPARACION.filter(
    (order) => order.empleadoId === Number(userId)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUMN 1: PENDIENTES */}
        <div className="space-y-4">
          <div className="border-2 border-[#808080] bg-[#1a1a1a] p-4">
            <h3 className="text-xl font-bold text-[#f5f5f5] uppercase tracking-wider flex items-center justify-between">
              <span>PENDIENTES</span>
              <span className="text-[#808080] text-sm">
                ({ordersByStatus.PENDIENTE.length})
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {ordersByStatus.PENDIENTE.length === 0 ? (
              <div className="text-center p-8 border-2 border-[#808080] border-dashed bg-[#1a1a1a]">
                <p className="text-[#808080] uppercase tracking-wide text-sm">
                  No hay pedidos pendientes
                </p>
              </div>
            ) : (
              ordersByStatus.PENDIENTE.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAction={handleOrderAction}
                  actionLabel="TOMAR PEDIDO"
                  action="assign"
                  isLoading={loadingOrderId === order.id}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: EN PREPARACIÓN (only employee's orders) */}
        <div className="space-y-4">
          <div className="border-2 border-[#ff6b35] bg-[#1a1a1a] p-4">
            <h3 className="text-xl font-bold text-[#f5f5f5] uppercase tracking-wider flex items-center justify-between">
              <span>EN PREPARACIÓN</span>
              <span className="text-[#ff6b35] text-sm">
                ({myPreparingOrders.length})
              </span>
            </h3>
            <p className="text-[#808080] text-xs mt-1 uppercase">
              Mis pedidos asignados
            </p>
          </div>

          <div className="space-y-4">
            {myPreparingOrders.length === 0 ? (
              <div className="text-center p-8 border-2 border-[#ff6b35] border-dashed bg-[#1a1a1a]">
                <p className="text-[#808080] uppercase tracking-wide text-sm">
                  No tienes pedidos en preparación
                </p>
              </div>
            ) : (
              myPreparingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAction={handleOrderAction}
                  actionLabel="TERMINAR"
                  action="ready"
                  isLoading={loadingOrderId === order.id}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: LISTOS PARA ENTREGAR */}
        <div className="space-y-4">
          <div className="border-2 border-[#00ff00] bg-[#1a1a1a] p-4">
            <h3 className="text-xl font-bold text-[#f5f5f5] uppercase tracking-wider flex items-center justify-between">
              <span>LISTOS</span>
              <span className="text-[#00ff00] text-sm">
                ({ordersByStatus.LISTO.length})
              </span>
            </h3>
            <p className="text-[#808080] text-xs mt-1 uppercase">
              Esperando entrega
            </p>
          </div>

          <div className="space-y-4">
            {ordersByStatus.LISTO.length === 0 ? (
              <div className="text-center p-8 border-2 border-[#00ff00] border-dashed bg-[#1a1a1a]">
                <p className="text-[#808080] uppercase tracking-wide text-sm">
                  No hay pedidos listos
                </p>
              </div>
            ) : (
              ordersByStatus.LISTO.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAction={handleOrderAction}
                  actionLabel="ENTREGAR"
                  action="deliver"
                  isLoading={loadingOrderId === order.id}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* PIN Validation Modal */}
      <PinValidationModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false)
          setSelectedOrder(null)
        }}
        onValidate={handlePinValidation}
        orderId={selectedOrder?.id || 0}
      />
    </>
  )
}

OrdersKanban.displayName = 'OrdersKanban'
