/**
 * Order Status Enum
 * Represents the lifecycle states of an order
 */
export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  LISTO = 'LISTO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

/**
 * Human-readable labels for order statuses
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: 'Pendiente',
  [OrderStatus.EN_PREPARACION]: 'En Preparación',
  [OrderStatus.LISTO]: 'Listo',
  [OrderStatus.ENTREGADO]: 'Entregado',
  [OrderStatus.CANCELADO]: 'Cancelado',
}

/**
 * Brutalist color palette for order statuses
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: '#999999', // Neutral gray
  [OrderStatus.EN_PREPARACION]: '#ff6b35', // Burnt orange
  [OrderStatus.LISTO]: '#00ff00', // Terminal green
  [OrderStatus.ENTREGADO]: '#9b59b6', // Electric violet
  [OrderStatus.CANCELADO]: '#ff0000', // Pure red
}

/**
 * Type guard to check if a string is a valid OrderStatus
 */
export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return Object.values(OrderStatus).includes(status as OrderStatus)
}
