import { OrderStatus } from '@shared/types'

/**
 * Order Item Interface
 * Represents an individual item within an order
 */
export interface OrderItem {
  id: number
  platoId: number
  platoNombre: string
  cantidad: number
  precio: number
}

/**
 * Order Interface
 * Represents a complete order in the system
 */
export interface Order {
  id: string
  restauranteId: number
  clienteId: number
  clienteNombre: string
  clienteCorreo: string
  items: OrderItem[]
  estado: OrderStatus
  empleadoId?: string
  pin?: string // Only visible when estado = LISTO
  fechaCreacion: string
  fechaActualizacion?: string
}

/**
 * Orders grouped by status
 * Used for Kanban board organization
 */
export interface OrdersByStatus {
  PENDIENTE: Order[]
  EN_PREPARACION: Order[]
  LISTO: Order[]
  ENTREGADO: Order[]
}

/**
 * Update Order Status Request
 * Payload for status transition endpoints
 */
export interface UpdateOrderStatusData {
  nuevoEstado: OrderStatus
  empleadoId?: number
}

/**
 * PIN Validation Request
 * Payload for PIN verification endpoint
 */
export interface PinValidationRequest {
  pin: string
}

/**
 * PIN Validation Response
 * Response from PIN verification endpoint
 */
export interface PinValidationResponse {
  valido: boolean
  mensaje?: string
}
