// Tipos para el sistema de Plazoleta de Comidas

export type UserRole = "ADMIN" | "PROPIETARIO" | "CLIENTE" | "EMPLEADO"

export type OrderStatus = "PENDIENTE" | "EN_PREPARACION" | "LISTO" | "ENTREGADO" | "CANCELADO"

export interface User {
  id: number
  nombre: string
  apellido: string
  documento: string
  celular: string
  correo: string
  fechaNacimiento?: string
  rol: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Restaurant {
  id: number
  nombre: string
  nit: string
  direccion: string
  telefono: string
  urlLogo: string
  idPropietario: number
}

export interface Category {
  id: number
  nombre: string
}

export interface Dish {
  id: number
  nombre: string
  precio: number
  descripcion: string
  urlImagen: string
  activo: boolean
  idCategoria: number
  idRestaurante: number
  categoria?: Category
}

export interface OrderItem {
  idPlato: number
  cantidad: number
  plato?: Dish
}

export interface Order {
  id: number
  idCliente: number
  idRestaurante: number
  estado: OrderStatus
  fechaCreacion: string
  items: OrderItem[]
  idEmpleado?: number
  codigoPin?: string
  restaurante?: Restaurant
}

export interface EfficiencyReport {
  idEmpleado: number
  nombreEmpleado: string
  tiempoPromedio: number
  pedidosCompletados: number
}

export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  currentPage: number
}

// DTOs para crear entidades
export interface CreateUserDTO {
  nombre: string
  apellido: string
  documento: string
  celular: string
  correo: string
  clave: string
  fechaNacimiento?: string
  rol?: UserRole
}

export interface CreateRestaurantDTO {
  nombre: string
  nit: string
  direccion: string
  telefono: string
  urlLogo: string
  idPropietario: number
}

export interface CreateDishDTO {
  nombre: string
  precio: number
  descripcion: string
  urlImagen: string
  idCategoria: number
}

export interface UpdateDishDTO {
  precio?: number
  descripcion?: string
}

export interface CreateOrderDTO {
  idRestaurante: number
  items: { idPlato: number; cantidad: number }[]
}

export interface LoginDTO {
  correo: string
  clave: string
}
