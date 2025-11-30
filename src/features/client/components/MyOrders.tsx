import { useState, useEffect } from 'react'
import {
  BrutalistCard,
  BrutalistButton,
  LoadingSpinner,
  ErrorAlert,
  SuccessAlert,
} from '@shared/components'
import { OrderStatus, ORDER_STATUS_LABELS } from '@shared/types'

/**
 * Maps order status to CSS badge class for theme-aware styling
 */
const getStatusBadgeClass = (status: OrderStatus): string => {
  const badgeClasses: Record<OrderStatus, string> = {
    [OrderStatus.PENDIENTE]: 'badge-pending',
    [OrderStatus.EN_PREPARACION]: 'badge-preparing',
    [OrderStatus.LISTO]: 'badge-ready',
    [OrderStatus.ENTREGADO]: 'badge-delivered',
    [OrderStatus.CANCELADO]: 'badge-cancelled',
  }
  return badgeClasses[status]
}
import { orderService } from '../services/orderService'
import { ClientOrder } from '../models'

/**
 * MyOrders Component - CRITICAL
 * Displays user orders with PIN display for ready orders
 * Implements polling for real-time updates
 */
export const MyOrders = () => {
  const [orders, setOrders] = useState<ClientOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Polling every 10 seconds for real-time updates
  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders()
      setOrders(data)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      setError('Error al cargar pedidos. Por favor, intenta de nuevo.')
      console.error('Error fetching orders:', err)
      setIsLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    if (
      !window.confirm(
        'Estas seguro de que deseas cancelar este pedido? Esta accion no se puede deshacer.'
      )
    ) {
      return
    }

    try {
      await orderService.cancelOrder(orderId)
      setSuccessMessage('Pedido cancelado exitosamente')
      setTimeout(() => setSuccessMessage(null), 3000)
      await fetchOrders()
    } catch (err) {
      setError('Error al cancelar pedido. Por favor, intenta de nuevo.')
      console.error('Error cancelling order:', err)
      setTimeout(() => setError(null), 5000)
    }
  }

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 uppercase tracking-wide">
        MIS PEDIDOS
      </h1>

      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <ErrorAlert message={error} />
        </div>
      )}

      {successMessage && (
        <div className="mb-6">
          <SuccessAlert message={successMessage} />
        </div>
      )}

      {/* Empty State */}
      {orders.length === 0 && !isLoading && (
        <BrutalistCard>
          <div className="text-center py-12">
            <p className="text-2xl text-muted-foreground mb-6">
              No tienes pedidos activos
            </p>
            <p className="text-muted-foreground/80 mb-6">
              Comienza a ordenar de tus restaurantes favoritos
            </p>
          </div>
        </BrutalistCard>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <BrutalistCard key={order.id}>
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b-2 border-border">
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2 uppercase tracking-wide">
                  PEDIDO #{order.id}
                </h2>
                <p className="text-muted-foreground mb-1">
                  <span className="font-bold text-card-foreground">
                    RESTAURANTE:
                  </span>{' '}
                  {order.restauranteNombre}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.fechaCreacion)}
                </p>
              </div>

              {/* Status Badge */}
              <div
                className={`mt-4 md:mt-0 inline-block px-6 py-3 border-2 border-border font-bold uppercase tracking-wide text-center ${getStatusBadgeClass(order.estado)}`}
              >
                {ORDER_STATUS_LABELS[order.estado]}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-card-foreground mb-3 uppercase tracking-wide">
                ITEMS:
              </h3>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center text-muted-foreground py-2 border-b border-border/50"
                  >
                    <span>
                      <span className="font-bold text-card-foreground">
                        {item.cantidad}x
                      </span>{' '}
                      {item.platoNombre}
                    </span>
                    <span className="font-bold text-[var(--color-success)]">
                      {formatCurrency(item.precio * item.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6 py-4 border-t-2 border-border">
              <span className="text-xl font-bold text-card-foreground uppercase tracking-wide">
                TOTAL:
              </span>
              <span className="text-3xl font-bold text-[var(--color-success)]">
                {formatCurrency(order.total)}
              </span>
            </div>

            {/* Status-specific Actions and Displays */}
            {/* CRITICAL: PIN Display for Ready Orders - KEPT DARK/TERMINAL STYLE INTENTIONALLY */}
            {order.estado === OrderStatus.LISTO && order.pin && (
              <div className="border-4 border-[var(--color-success)] p-8 mt-4 bg-black animate-pulse">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-[var(--color-success)] mb-6 uppercase tracking-wide">
                    TU PEDIDO ESTA LISTO PARA RECOGER
                  </p>

                  <div className="bg-black border-4 border-[var(--color-success)] p-6 mb-6">
                    <p className="text-sm text-gray-400 mb-3 uppercase tracking-wide">
                      CODIGO DE RETIRO:
                    </p>
                    <p className="text-6xl md:text-8xl font-bold text-[var(--color-success)] tracking-widest font-mono">
                      {order.pin}
                    </p>
                  </div>

                  <p className="text-base md:text-lg text-gray-400">
                    Dicta este codigo al empleado para recibir tu comida.
                  </p>
                </div>
              </div>
            )}

            {/* Pending Order - Show Cancel Button */}
            {order.estado === OrderStatus.PENDIENTE && (
              <div className="space-y-3">
                <p className="text-muted-foreground text-center py-2">
                  Tu pedido esta esperando confirmacion del restaurante
                </p>
                <BrutalistButton
                  variant="danger"
                  onClick={() => handleCancelOrder(order.id)}
                  fullWidth
                >
                  CANCELAR PEDIDO
                </BrutalistButton>
              </div>
            )}

            {/* In Preparation - Show Progress Message */}
            {order.estado === OrderStatus.EN_PREPARACION && (
              <div className="bg-[var(--color-warning)] border-2 border-border p-6 text-center">
                <p className="text-xl font-bold text-black uppercase tracking-wide">
                  TU PEDIDO SE ESTA COCINANDO...
                </p>
                <p className="text-sm text-black mt-2">
                  El restaurante esta preparando tu orden
                </p>
              </div>
            )}

            {/* Delivered - Show Success Message */}
            {order.estado === OrderStatus.ENTREGADO && (
              <div className="bg-primary border-2 border-border p-6 text-center">
                <p className="text-xl font-bold text-primary-foreground uppercase tracking-wide">
                  PEDIDO ENTREGADO
                </p>
                <p className="text-sm text-primary-foreground/90 mt-2">
                  Esperamos que hayas disfrutado tu comida!
                </p>
              </div>
            )}

            {/* Cancelled - Show Cancelled Message */}
            {order.estado === OrderStatus.CANCELADO && (
              <div className="bg-destructive border-2 border-border p-6 text-center">
                <p className="text-xl font-bold text-destructive-foreground uppercase tracking-wide">
                  PEDIDO CANCELADO
                </p>
                <p className="text-sm text-destructive-foreground/90 mt-2">
                  Este pedido ha sido cancelado
                </p>
              </div>
            )}
          </BrutalistCard>
        ))}
      </div>

      {/* Auto-refresh indicator */}
      {!isLoading && orders.length > 0 && (
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Actualizacion automatica cada 10 segundos
        </div>
      )}
    </div>
  )
}
