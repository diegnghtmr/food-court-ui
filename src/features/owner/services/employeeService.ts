import type { Employee, CreateEmployeeData } from '../models'

export const employeeService = {
  createEmployee: async (data: CreateEmployeeData): Promise<Employee> => {
    // TODO: Implement create employee API call
    return Promise.resolve({
      id: '1',
      name: data.name,
      surname: data.surname,
      documentNumber: data.documentNumber,
      phone: data.phone,
      email: data.email,
      restaurantId: data.restaurantId,
      createdAt: new Date().toISOString(),
    })
  },

  getEmployees: async (_restaurantId: string): Promise<Employee[]> => {
    // TODO: Implement get employees API call
    return Promise.resolve([])
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    // TODO: Implement get employee by id API call
    return Promise.resolve({
      id,
      name: 'Mock',
      surname: 'Employee',
      documentNumber: '123456789',
      phone: '+1234567890',
      email: 'employee@example.com',
      restaurantId: '1',
      createdAt: new Date().toISOString(),
    })
  },
}
