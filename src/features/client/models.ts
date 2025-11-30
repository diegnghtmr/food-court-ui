import { DishCategory, OrderStatus } from '@shared/types'

/**
 * Restaurant model matching backend API structure
 */
export interface Restaurant {
  id: number
  nombre: string
  nit: string
  direccion: string
  telefono: string
  urlLogo: string
  idPropietario: number
}

/**
 * Dish model matching backend API structure
 */
export interface Dish {
  id: number
  nombre: string
  precio: number
  descripcion: string
  urlImagen: string
  categoria: DishCategory
  activo: boolean
  restauranteId: number
}

/**
 * Cart item for local state management
 */
export interface CartItem {
  plato: Dish
  cantidad: number
}

/**
 * Data transfer object for order creation
 */
export interface CreateOrderData {
  restauranteId: number
  platos: Array<{
    platoId: number
    cantidad: number
  }>
}

/**
 * Client order model with full details
 */
export interface ClientOrder {
  id: string
  restauranteId: number
  restauranteNombre: string
  items: Array<{
    platoNombre: string
    cantidad: number
    precio: number
  }>
  total: number
  estado: OrderStatus
  pin?: string
  fechaCreacion: string
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}
