import React, { useState, useCallback } from 'react'
import { BrutalistCard, BrutalistButton } from '@shared/components'
import { Order } from '../models'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@shared/types'

/**
 * Formats order ID for compact display: shows first 8 and last 4 characters
 * Example: "697581C65329ABCDEF" -> "697581C6...CDEF"
 */
const formatOrderId = (id: string): string => {
  if (id.length <= 14) return id
  return `${id.slice(0, 8)}...${id.slice(-4)}`
}

/**
 * Compact OrderIdBadge for Kanban cards
 * Displays formatted order ID with copy functionality
 */
const OrderIdBadge = ({ orderId }: { orderId: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy order ID:', err)
    }
  }, [orderId])

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary border-2 border-border font-mono text-xs text-card-foreground tracking-wide cursor-pointer hover:bg-muted transition-colors"
      onClick={handleCopy}
      title={`ID completo: ${orderId} (clic para copiar)`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCopy()
        }
      }}
      aria-label={`ID del pedido: ${orderId}. Clic para copiar`}
    >
      <span className="text-muted-foreground">#</span>
      <span className="font-bold">{formatOrderId(orderId)}</span>
      {copied ? (
        <span className="text-[var(--color-success)] font-bold text-[10px] uppercase">
          OK
        </span>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
          aria-hidden="true"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </span>
  )
}

interface OrderCardProps {
  order: Order
  onAction: (orderId: string, action: 'assign' | 'ready' | 'deliver') => void
  actionLabel: string
  action: 'assign' | 'ready' | 'deliver'
  isLoading?: boolean
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAction,
  actionLabel,
  action,
  isLoading = false,
}) => {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )

  const statusColor = ORDER_STATUS_COLORS[order.estado]

  return (
    <BrutalistCard className="mb-4">
      {/* Header with order number and status badge */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-card-foreground mb-1">
            PEDIDO
          </h3>
          <OrderIdBadge orderId={order.id} />
        </div>
        <div
          className="px-3 py-1 border-2 font-bold text-xs uppercase tracking-wider bg-secondary/50 flex-shrink-0 whitespace-nowrap"
          style={{
            borderColor: statusColor,
            color: statusColor,
          }}
        >
          {ORDER_STATUS_LABELS[order.estado]}
        </div>
      </div>

      {/* Client information */}
      <div className="mb-4 pb-4 border-b-2 border-border/30">
        <p className="text-card-foreground font-semibold mb-1">
          CLIENTE: {order.clienteNombre}
        </p>
        <p className="text-muted-foreground text-sm">{order.clienteCorreo}</p>
      </div>

      {/* Order items */}
      <div className="mb-4">
        <p className="text-card-foreground font-bold text-sm mb-2 uppercase tracking-wider">
          Items:
        </p>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-card-foreground">
                <span className="font-bold text-[var(--color-success)]">
                  {item.cantidad}x
                </span>{' '}
                {item.platoNombre}
              </span>
              <span className="text-muted-foreground font-mono">
                ${(item.precio * item.cantidad).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="mb-4 pt-4 border-t-2 border-border/30">
        <div className="flex justify-between items-center">
          <span className="text-card-foreground font-bold uppercase tracking-wider">
            Total:
          </span>
          <span className="text-[var(--color-success)] font-bold text-xl font-mono">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Action button */}
      <BrutalistButton
        variant="primary"
        fullWidth
        disabled={isLoading}
        onClick={() => onAction(order.id, action)}
      >
        {isLoading ? 'PROCESANDO...' : actionLabel}
      </BrutalistButton>
    </BrutalistCard>
  )
}

OrderCard.displayName = 'OrderCard'
