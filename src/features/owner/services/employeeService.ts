/**
 * Employee Service (Owner)
 * API calls for employee management by restaurant owner
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { Employee, CreateEmployeeData } from '../models'

interface EmployeeDto {
  id?: string | number
  firstName: string
  lastName: string
  documentNumber: string
  phone: string
  email: string
  restaurantId?: string | number
  createdAt?: string
}

export const employeeService = {
  /**
   * Create a new employee (EMPLEADO)
   * @param data - Employee creation data
   * @returns Promise with created employee data
   */
  createEmployee: async (data: CreateEmployeeData): Promise<Employee> => {
    // Map frontend fields to backend fields
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.USUARIOS}/user/employee`,
      {
        firstName: data.name,
        lastName: data.surname,
        documentNumber: data.documentNumber,
        phone: data.phone,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password,
        restaurantId: Number(data.restaurantId),
      }
    )

    // Map backend response to frontend model
    return {
      id: response.data.id?.toString() || '',
      name: response.data.firstName || data.name,
      surname: response.data.lastName || data.surname,
      documentNumber: response.data.documentNumber || data.documentNumber,
      phone: response.data.phone || data.phone,
      email: response.data.email || data.email,
      restaurantId: response.data.restaurantId?.toString() || data.restaurantId,
      createdAt: response.data.createdAt || new Date().toISOString(),
    }
  },

  /**
   * Get all employees for a restaurant
   * @param restaurantId - Restaurant ID
   * @returns Promise with array of employees
   */
  getEmployees: async (restaurantId: string): Promise<Employee[]> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.USUARIOS}/user/employees/restaurant/${restaurantId}`
    )

    // Map backend array to frontend models
    const employees: EmployeeDto[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.content)
        ? response.data.content
        : []

    return employees.map((employee) => ({
      id: employee.id?.toString() || '',
      name: employee.firstName,
      surname: employee.lastName,
      documentNumber: employee.documentNumber,
      phone: employee.phone,
      email: employee.email,
      restaurantId: employee.restaurantId?.toString() || restaurantId,
      createdAt: employee.createdAt || new Date().toISOString(),
    }))
  },

  /**
   * Get employee by ID
   * @param id - Employee ID
   * @returns Promise with employee data
   */
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.USUARIOS}/user/${id}`
    )

    // Map backend response to frontend model
    return {
      id: response.data.id?.toString() || id,
      name: response.data.firstName,
      surname: response.data.lastName,
      documentNumber: response.data.documentNumber,
      phone: response.data.phone,
      email: response.data.email,
      restaurantId: response.data.restaurantId?.toString() || '',
      createdAt: response.data.createdAt,
    }
  },
}
