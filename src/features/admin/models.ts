export interface Owner {
  id: string
  name: string
  surname: string
  documentNumber: string
  phone: string
  email: string
  createdAt: string
}

export interface CreateOwnerData {
  name: string
  surname: string
  documentNumber: string
  phone: string
  birthDate: string
  email: string
  password: string
}

export interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  urlLogo: string
  nit: string
  ownerId: string
  ownerName?: string
  createdAt: string
}

export interface CreateRestaurantData {
  name: string
  address: string
  phone: string
  urlLogo: string
  nit: string
  ownerId: string
}

export interface AdminStats {
  totalOwners: number
  totalRestaurants: number
  activeRestaurants: number
}

export const ADMIN_ACTIVITY_TYPES = {
  OWNER: 'OWNER',
  RESTAURANT: 'RESTAURANT',
} as const

export type AdminActivityType =
  (typeof ADMIN_ACTIVITY_TYPES)[keyof typeof ADMIN_ACTIVITY_TYPES]

export interface AdminActivity {
  id: string
  type: AdminActivityType
  title: string
  description: string
  createdAt: string
}
