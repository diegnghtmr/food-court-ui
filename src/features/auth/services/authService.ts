/**
 * Authentication Service
 * API calls for authentication (Login, Register)
 */

import axiosInstance from '@infrastructure/api/axiosInstance'
import { API_ENDPOINTS } from '@infrastructure/api/endpoints'
import type { LoginCredentials, RegisterData, AuthResponse } from '../models'

export const authService = {
  /**
   * Login user
   * @param credentials - User login credentials (correo, clave)
   * @returns Promise with token and user data
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.USUARIOS}/login`,
      credentials
    )
    return response.data
  },

  /**
   * Register new user (CLIENTE role by default)
   * @param userData - User registration data
   * @returns Promise<void> - No data returned, just success
   */
  register: async (userData: RegisterData): Promise<void> => {
    await axiosInstance.post(`${API_ENDPOINTS.USUARIOS}/registrar`, {
      ...userData,
      rol: 'CLIENTE',
    })
  },
}
