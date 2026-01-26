import React, { useState, useMemo } from 'react'
import { LoadingSpinner } from '@shared/components'
import { useAuth } from '@infrastructure/auth'
import { Order, OrdersByStatus } from '../models'
import { OrderStatus } from '@shared/types'
import {
  useAssignOrder,
  useDeliverOrder,
  useMarkOrderReady,
  useOrdersByStatus,
} from '../queries/employeeQueries'
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null)

  const restaurantId = Number(getRestaurantId() ?? 0)
  const pendingQuery = useOrdersByStatus(restaurantId, OrderStatus.PENDIENTE)
  const preparingQuery = useOrdersByStatus(
    restaurantId,
    OrderStatus.EN_PREPARACION
  )
  const readyQuery = useOrdersByStatus(restaurantId, OrderStatus.LISTO)
  const deliveredQuery = useOrdersByStatus(restaurantId, OrderStatus.ENTREGADO)
  const assignOrderMutation = useAssignOrder()
  const markReadyMutation = useMarkOrderReady()
  const deliverOrderMutation = useDeliverOrder()

  const ordersByStatus = useMemo<OrdersByStatus>(
    () => ({
      PENDIENTE: pendingQuery.data ?? [],
      EN_PREPARACION: preparingQuery.data ?? [],
      LISTO: readyQuery.data ?? [],
      ENTREGADO: deliveredQuery.data ?? [],
    }),
    [
      pendingQuery.data,
      preparingQuery.data,
      readyQuery.data,
      deliveredQuery.data,
    ]
  )

  const isLoading =
    pendingQuery.isLoading ||
    preparingQuery.isLoading ||
    readyQuery.isLoading ||
    deliveredQuery.isLoading

  /**
   * Assign order to employee (PENDIENTE -> EN_PREPARACION)
   */
  const handleAssignOrder = async (orderId: string) => {
    if (!userId) return

    setLoadingOrderId(orderId)
    try {
      await assignOrderMutation.mutateAsync({
        orderId,
        employeeId: Number(userId),
        restaurantId,
      })
    } catch (error) {
      console.error('Error assigning order:', error)
    } finally {
      setLoadingOrderId(null)
    }
  }

  /**
   * Mark order as ready (EN_PREPARACION -> LISTO)
   */
  const handleMarkReady = async (orderId: string) => {
    setLoadingOrderId(orderId)
    try {
      await markReadyMutation.mutateAsync(orderId)
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
      const result = await deliverOrderMutation.mutateAsync({
        orderId: selectedOrder.id,
        pin,
      })

      if (result.valido) {
        // Close modal and refresh orders
        setIsPinModalOpen(false)
        setSelectedOrder(null)
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
    orderId: string,
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
    (order) => order.empleadoId === (userId ?? '')
  )

  if (!restaurantId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground uppercase tracking-wide text-sm">
          Restaurante no disponible para el empleado
        </p>
      </div>
    )
  }

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
          <div className="border-2 border-[var(--color-neutral)] bg-secondary p-4">
            <h3 className="text-xl font-bold text-card-foreground uppercase tracking-wider flex items-center justify-between">
              <span>PENDIENTES</span>
              <span className="text-muted-foreground text-sm">
                ({ordersByStatus.PENDIENTE.length})
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {ordersByStatus.PENDIENTE.length === 0 ? (
              <div className="text-center p-8 border-2 border-[var(--color-neutral)] border-dashed bg-secondary">
                <p className="text-muted-foreground uppercase tracking-wide text-sm">
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
          <div className="border-2 border-[var(--color-warning)] bg-secondary p-4">
            <h3 className="text-xl font-bold text-card-foreground uppercase tracking-wider flex items-center justify-between">
              <span>EN PREPARACIÓN</span>
              <span className="text-[var(--color-warning)] text-sm">
                ({myPreparingOrders.length})
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {myPreparingOrders.length === 0 ? (
              <div className="text-center p-8 border-2 border-[var(--color-warning)] border-dashed bg-secondary">
                <p className="text-muted-foreground uppercase tracking-wide text-sm">
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
          <div className="border-2 border-[var(--color-success)] bg-secondary p-4">
            <h3 className="text-xl font-bold text-card-foreground uppercase tracking-wider flex items-center justify-between">
              <span>LISTOS</span>
              <span className="text-[var(--color-success)] text-sm">
                ({ordersByStatus.LISTO.length})
              </span>
            </h3>
          </div>

          <div className="space-y-4">
            {ordersByStatus.LISTO.length === 0 ? (
              <div className="text-center p-8 border-2 border-[var(--color-success)] border-dashed bg-secondary">
                <p className="text-muted-foreground uppercase tracking-wide text-sm">
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
        orderId={selectedOrder?.id || ''}
      />
    </>
  )
}

OrdersKanban.displayName = 'OrdersKanban'
