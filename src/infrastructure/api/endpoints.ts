/**
 * API Endpoints Configuration
 * Centralized microservices URLs from environment variables
 */

/**
 * Base URLs for each microservice
 */
export const API_ENDPOINTS = {
  USUARIOS:
    import.meta.env.VITE_API_USUARIOS_URL || 'http://localhost:8090/user-api',
  PLAZOLETA:
    import.meta.env.VITE_API_PLAZOLETA_URL ||
    'http://localhost:8091/foodcourt-api',
  PEDIDOS:
    import.meta.env.VITE_API_PEDIDOS_URL || 'http://localhost:8092/order-api',
  TRAZABILIDAD:
    import.meta.env.VITE_API_TRAZABILIDAD_URL ||
    'http://localhost:8093/traceability-api',
} as const

/**
 * Type-safe endpoint access
 */
export type ApiEndpointKey = keyof typeof API_ENDPOINTS

/**
 * Helper to build full URL
 */
export const buildUrl = (service: ApiEndpointKey, path: string): string => {
  const baseUrl = API_ENDPOINTS[service]
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}
