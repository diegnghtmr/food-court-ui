/**
 * Axios Instance Configuration
 * Pre-configured axios client with interceptors for authentication and error handling
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getToken, removeToken } from '@infrastructure/auth/tokenManager'

/**
 * Create axios instance with default config
 */
const axiosInstance = axios.create({
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Automatically inject JWT Bearer token into all requests
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Global error handling, especially for authentication errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      // Remove invalid token
      removeToken()

      // Redirect to login (only if not already there)
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access denied: Insufficient permissions')
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found')
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error: Please try again later')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
