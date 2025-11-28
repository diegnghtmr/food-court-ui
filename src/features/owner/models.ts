export interface Dish {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  restaurantId: string
  active: boolean
  createdAt: string
}

export interface CreateDishData {
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  restaurantId: string
}

export interface UpdateDishData {
  description?: string
  price?: number
}

export interface Employee {
  id: string
  name: string
  surname: string
  documentNumber: string
  phone: string
  email: string
  restaurantId: string
  createdAt: string
}

export interface CreateEmployeeData {
  name: string
  surname: string
  documentNumber: string
  phone: string
  birthDate: string
  email: string
  password: string
  restaurantId: string
}

export interface EfficiencyReport {
  employeeId: string
  employeeName: string
  completedOrders: number
  averageCompletionTime: number
  efficiency: number
  period: string
}

export interface OwnerStats {
  totalDishes: number
  activeDishes: number
  totalEmployees: number
  totalOrders: number
}
