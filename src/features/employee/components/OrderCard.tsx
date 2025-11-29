import React from 'react'
import { BrutalistCard, BrutalistButton } from '@shared/components'
import { Order } from '../models'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@shared/types'

interface OrderCardProps {
  order: Order
  onAction: (orderId: number, action: 'assign' | 'ready' | 'deliver') => void
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#f5f5f5]">PEDIDO #{order.id}</h3>
        <div
          className="px-3 py-1 border-2 font-bold text-xs uppercase tracking-wider"
          style={{
            borderColor: statusColor,
            color: statusColor,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}
        >
          {ORDER_STATUS_LABELS[order.estado]}
        </div>
      </div>

      {/* Client information */}
      <div className="mb-4 pb-4 border-b-2 border-[#ffffff]/20">
        <p className="text-[#f5f5f5] font-semibold mb-1">
          CLIENTE: {order.clienteNombre}
        </p>
        <p className="text-[#808080] text-sm">{order.clienteCorreo}</p>
      </div>

      {/* Order items */}
      <div className="mb-4">
        <p className="text-[#f5f5f5] font-bold text-sm mb-2 uppercase tracking-wider">
          Items:
        </p>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-[#f5f5f5]">
                <span className="font-bold text-[#00ff00]">
                  {item.cantidad}x
                </span>{' '}
                {item.platoNombre}
              </span>
              <span className="text-[#808080] font-mono">
                ${(item.precio * item.cantidad).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="mb-4 pt-4 border-t-2 border-[#ffffff]/20">
        <div className="flex justify-between items-center">
          <span className="text-[#f5f5f5] font-bold uppercase tracking-wider">
            Total:
          </span>
          <span className="text-[#00ff00] font-bold text-xl font-mono">
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
